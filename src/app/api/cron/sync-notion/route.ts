import { NextResponse } from "next/server"
import { generateHash } from "@/lib/hash"
import {
  saveNotionCache,
  getTranslationFromCache,
  saveTranslationToCache,
} from "@/lib/mongodb"
import { batchTranslateTexts, SupportedLanguage } from "@/lib/translate"
import {
  uploadImageToS3,
  fetchImageFromNotion,
  deleteAllPortfolioImages,
} from "@/lib/s3"

const DATABASE_IDS = {
  aboutme: "25fcc9b72a9c801ba124c5d2158a7f84",
  awards: "e01e1b8eb9ac45049db60a8b0e91523c",
  certificates: "105cc9b72a9c8088a82defcfa25890aa",
  experiences: "11ecc9b72a9c800aa061f9d2fe431f33",
  projects: "c47cae2234124b8abf20e1ec41f864e0",
  activities: "9ada0cfa5510493ea8f5a3be2b8b516a",
  skills: "11ecc9b72a9c800eba06e276577aa180",
}

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ja"]

export async function GET() {
  try {
    // 기존 S3 파일들 삭제
    console.log("Deleting existing S3 portfolio images...")
    const deletedCount = await deleteAllPortfolioImages()
    console.log(`Deleted ${deletedCount} existing images from S3`)
    const [
      aboutmeRes,
      awardsRes,
      certificatesRes,
      experiencesRes,
      projectsRes,
      activitiesRes,
      skillsRes,
    ] = await Promise.all([
      fetchNotionData(DATABASE_IDS.aboutme),
      fetchNotionData(DATABASE_IDS.awards, [
        { property: "score", direction: "descending" },
        { property: "date", direction: "descending" },
      ]),
      fetchNotionData(DATABASE_IDS.certificates, [
        { property: "date", direction: "descending" },
      ]),
      fetchNotionData(DATABASE_IDS.experiences, [
        { property: "date", direction: "descending" },
      ]),
      fetchNotionData(DATABASE_IDS.projects, [
        { property: "score", direction: "descending" },
        { property: "workPeriod", direction: "descending" },
      ]),
      fetchNotionData(DATABASE_IDS.activities, [
        { property: "date", direction: "descending" },
      ]),
      fetchNotionData(DATABASE_IDS.skills, [
        { property: "category", direction: "ascending" },
        { property: "name", direction: "ascending" },
      ]),
    ])

    const data = {
      aboutme: await processImages(aboutmeRes.results),
      awards: await processImages(awardsRes.results),
      certificates: await processImages(certificatesRes.results),
      experiences: await processImages(experiencesRes.results),
      projects: await processImages(projectsRes.results),
      activities: await processImages(activitiesRes.results),
      skills: await processImages(skillsRes.results),
    }

    await Promise.all([
      saveNotionCache("aboutme", data.aboutme),
      saveNotionCache("awards", data.awards),
      saveNotionCache("certificates", data.certificates),
      saveNotionCache("experiences", data.experiences),
      saveNotionCache("projects", data.projects),
      saveNotionCache("activities", data.activities),
      saveNotionCache("skills", data.skills),
    ])

    await updateTranslations(data)

    return NextResponse.json({
      success: true,
      updated: Object.keys(data).length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cron sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync notion data" },
      { status: 500 }
    )
  }
}

async function fetchNotionData(
  databaseId: string,
  sorts?: Record<string, unknown>[]
) {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      },
      body: JSON.stringify({ sorts: sorts || [] }),
    }
  )

  return res.json()
}

async function updateTranslations(data: {
  aboutme: Record<string, unknown>[]
  awards: Record<string, unknown>[]
  certificates: Record<string, unknown>[]
  experiences: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  activities: Record<string, unknown>[]
  skills: Record<string, unknown>[]
}) {
  const globalHash = generateHash(data as unknown as Record<string, unknown>)

  const translationPromises = SUPPORTED_LANGUAGES.map(async (lang) => {
    const cachedGlobal = await getTranslationFromCache(lang, globalHash)

    if (!cachedGlobal) {
      const allTexts: string[] = []
      const mappings: Array<{
        id: string
        type: keyof typeof data
        itemIndex: number
        field: string
        text: string
      }> = []

      Object.entries(data).forEach(([type, items]) => {
        items.forEach((item: Record<string, unknown>, itemIndex: number) => {
          extractTextsFromItem(
            item,
            type as keyof typeof data,
            itemIndex,
            allTexts,
            mappings
          )
        })
      })

      if (allTexts.length > 0) {
        const translatedTexts = await batchTranslateTexts(
          allTexts,
          lang,
          "This is a complete developer portfolio including projects, experiences, awards, certificates, and about me section. Maintain consistent professional terminology and style throughout."
        )

        const translationMap = new Map<string, string>()
        mappings.forEach((mapping, index) => {
          const translatedText = translatedTexts[index]
          if (translatedText) {
            translationMap.set(mapping.id, translatedText)
          }
        })

        await saveTranslationToCache(
          lang,
          globalHash,
          Object.fromEntries(translationMap) as Record<string, unknown>
        )
      }
    }
  })

  await Promise.all(translationPromises)
}

function extractTextsFromItem(
  item: Record<string, unknown>,
  type: keyof typeof DATABASE_IDS,
  itemIndex: number,
  allTexts: string[],
  mappings: Array<{
    id: string
    type: keyof typeof DATABASE_IDS
    itemIndex: number
    field: string
    text: string
  }>
) {
  if (!item.properties) return

  const fieldsToTranslate: Record<string, string[]> = {
    aboutme: ["content"],
    awards: ["name", "description"],
    certificates: ["name", "kind", "institution"],
    experiences: ["name", "organization", "description"],
    projects: ["name", "description", "shortDescription"],
    activities: [],
    skills: [],
  }

  const fields = fieldsToTranslate[type] || []

  fields.forEach((field) => {
    const properties = item.properties as Record<string, unknown>
    const property = properties[field] as Record<string, unknown>
    let text = ""

    if (property?.title && Array.isArray(property.title) && property.title[0]) {
      const titleItem = property.title[0] as Record<string, unknown>
      if (titleItem.plain_text && typeof titleItem.plain_text === "string") {
        text = titleItem.plain_text
      }
    } else if (
      property?.rich_text &&
      Array.isArray(property.rich_text) &&
      property.rich_text[0]
    ) {
      const richTextItem = property.rich_text[0] as Record<string, unknown>
      if (
        richTextItem.plain_text &&
        typeof richTextItem.plain_text === "string"
      ) {
        text = richTextItem.plain_text
      }
    }

    if (text && text.trim()) {
      const id = `${type}_${itemIndex}_${field}`
      allTexts.push(text)
      mappings.push({ id, type, itemIndex, field, text })
    }
  })
}

async function processImages(
  items: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  return await Promise.all(
    items.map(async (item: Record<string, unknown>) => {
      const updatedItem = { ...item }

      // properties 처리
      if (item.properties && typeof item.properties === "object") {
        const properties = item.properties as Record<string, unknown>

        for (const [key, property] of Object.entries(properties)) {
          if (property && typeof property === "object") {
            const prop = property as Record<string, unknown>

            if (prop.type === "files" && Array.isArray(prop.files)) {
              const updatedFiles = await Promise.all(
                prop.files.map(async (file: Record<string, unknown>) => {
                  if (
                    file.type === "file" &&
                    file.file &&
                    typeof file.file === "object"
                  ) {
                    const fileObj = file.file as Record<string, unknown>

                    if (
                      typeof fileObj.url === "string" &&
                      (fileObj.url.includes("prod-files-secure.s3") ||
                        fileObj.url.includes("notion.so")) &&
                      !fileObj.url.includes(`${process.env.S3_BUCKET_NAME}.s3`)
                    ) {
                      try {
                        const {
                          buffer,
                          filename,
                          contentType: mimeType,
                        } = await fetchImageFromNotion(fileObj.url)
                        const s3Url = await uploadImageToS3(
                          buffer,
                          filename,
                          mimeType
                        )

                        console.log(
                          `Image migrated: ${fileObj.url} -> ${s3Url}`
                        )

                        return {
                          ...file,
                          file: {
                            ...fileObj,
                            url: encodeURI(s3Url),
                            expiry_time: undefined,
                          },
                        }
                      } catch (error) {
                        console.error(
                          `Failed to migrate image ${fileObj.url}:`,
                          error
                        )
                        return file
                      }
                    }
                  }

                  return file
                })
              )

              ;(updatedItem.properties as Record<string, unknown>)[key] = {
                ...prop,
                files: updatedFiles,
              }
            }
          }
        }
      }

      // cover 이미지 처리 (프로젝트의 커버 이미지)
      if (item.cover && typeof item.cover === "object") {
        const cover = item.cover as Record<string, unknown>

        if (
          cover.type === "file" &&
          cover.file &&
          typeof cover.file === "object"
        ) {
          const fileObj = cover.file as Record<string, unknown>

          if (
            typeof fileObj.url === "string" &&
            (fileObj.url.includes("prod-files-secure.s3") ||
              fileObj.url.includes("notion.so")) &&
            !fileObj.url.includes(`${process.env.S3_BUCKET_NAME}.s3`)
          ) {
            try {
              const {
                buffer,
                filename,
                contentType: mimeType,
              } = await fetchImageFromNotion(fileObj.url)
              const s3Url = await uploadImageToS3(buffer, filename, mimeType)

              console.log(`Cover image migrated: ${fileObj.url} -> ${s3Url}`)

              updatedItem.cover = {
                ...cover,
                file: {
                  ...fileObj,
                  url: encodeURI(s3Url),
                  expiry_time: undefined,
                },
              }
            } catch (error) {
              console.error(
                `Failed to migrate cover image ${fileObj.url}:`,
                error
              )
            }
          }
        }
      }

      // icon 이미지 처리 (페이지 아이콘)
      if (item.icon && typeof item.icon === "object") {
        const icon = item.icon as Record<string, unknown>

        if (
          icon.type === "file" &&
          icon.file &&
          typeof icon.file === "object"
        ) {
          const fileObj = icon.file as Record<string, unknown>

          if (
            typeof fileObj.url === "string" &&
            (fileObj.url.includes("prod-files-secure.s3") ||
              fileObj.url.includes("notion.so")) &&
            !fileObj.url.includes(`${process.env.S3_BUCKET_NAME}.s3`)
          ) {
            try {
              const {
                buffer,
                filename,
                contentType: mimeType,
              } = await fetchImageFromNotion(fileObj.url)
              const s3Url = await uploadImageToS3(buffer, filename, mimeType)

              console.log(`Icon image migrated: ${fileObj.url} -> ${s3Url}`)

              updatedItem.icon = {
                ...icon,
                file: {
                  ...fileObj,
                  url: encodeURI(s3Url),
                  expiry_time: undefined,
                },
              }
            } catch (error) {
              console.error(
                `Failed to migrate icon image ${fileObj.url}:`,
                error
              )
            }
          }
        }
      }

      return updatedItem
    })
  )
}
