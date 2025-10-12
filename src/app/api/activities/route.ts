import { NextResponse } from "next/server"
import { SupportedLanguage } from "@/lib/translate"
import { DATABASE_IDS, fetchNotionData, applyTranslations } from "@/lib/portfolio"
import { getGlobalTranslations } from "@/lib/globalTranslate"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

  try {
    const activitiesRes = await fetchNotionData(DATABASE_IDS.activities, [
      { property: "date", direction: "descending" },
    ])
    const data = activitiesRes.results

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations({ activities: data }, lang)
      data.forEach((item: Record<string, unknown>, itemIndex: number) => {
        applyTranslations(item, "activities", itemIndex, translationMap)
      })
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error("Activities API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities data" },
      { status: 500 }
    )
  }
}