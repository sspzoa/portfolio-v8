import { NextResponse } from "next/server"
import { generateHash } from "@/lib/hash"
import {
  saveNotionCache,
  getTranslationFromCache,
  saveTranslationToCache,
} from "@/lib/mongodb"
import { batchTranslateTexts, SupportedLanguage } from "@/lib/translate"

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
      aboutme: aboutmeRes.results,
      awards: awardsRes.results,
      certificates: certificatesRes.results,
      experiences: experiencesRes.results,
      projects: projectsRes.results,
      activities: activitiesRes.results,
      skills: skillsRes.results,
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
