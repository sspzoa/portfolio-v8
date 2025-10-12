import { NextResponse } from "next/server"
import { SupportedLanguage } from "@/lib/translate"
import {
  DATABASE_IDS,
  fetchNotionData,
  applyTranslations,
} from "@/lib/portfolio"
import { getGlobalTranslations } from "@/lib/globalTranslate"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

  try {
    const projectsRes = await fetchNotionData(DATABASE_IDS.projects, [
      { property: "score", direction: "descending" },
      { property: "workPeriod", direction: "descending" },
    ])
    const data = projectsRes.results

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations(
        { projects: data },
        lang
      )
      data.forEach((item: Record<string, unknown>, itemIndex: number) => {
        applyTranslations(item, "projects", itemIndex, translationMap)
      })
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error("Projects API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects data" },
      { status: 500 }
    )
  }
}
