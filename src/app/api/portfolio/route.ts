import { NextResponse } from "next/server"
import { SupportedLanguage } from "@/lib/translate"
import { getGlobalTranslations } from "@/lib/globalTranslate"

const DATABASE_IDS = {
  aboutme: "25fcc9b72a9c801ba124c5d2158a7f84",
  awards: "e01e1b8eb9ac45049db60a8b0e91523c",
  certificates: "105cc9b72a9c8088a82defcfa25890aa",
  experiences: "11ecc9b72a9c800aa061f9d2fe431f33",
  projects: "c47cae2234124b8abf20e1ec41f864e0",
  activities: "9ada0cfa5510493ea8f5a3be2b8b516a",
  skills: "11ecc9b72a9c800eba06e276577aa180",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"
  const type = searchParams.get("type")

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

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations(data, lang)

      Object.entries(data).forEach(([type, items]) => {
        items.forEach((item: Record<string, unknown>, itemIndex: number) => {
          applyTranslations(item, type, itemIndex, translationMap)
        })
      })
    }

    if (type && type in data) {
      return NextResponse.json({
        results: data[type as keyof typeof data] || [],
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Portfolio API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
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

function applyTranslations(
  item: Record<string, unknown>,
  type: string,
  itemIndex: number,
  translationMap: Map<string, string>
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
    const id = `${type}_${itemIndex}_${field}`
    const translation = translationMap.get(id)
    const properties = item.properties as Record<string, unknown>
    const property = properties[field] as Record<string, unknown>

    if (translation && property) {
      if (
        property.title &&
        Array.isArray(property.title) &&
        property.title[0]
      ) {
        const titleItem = property.title[0] as Record<string, unknown>
        titleItem.plain_text = translation
      } else if (
        property.rich_text &&
        Array.isArray(property.rich_text) &&
        property.rich_text[0]
      ) {
        const richTextItem = property.rich_text[0] as Record<string, unknown>
        richTextItem.plain_text = translation
      }
    }
  })
}
