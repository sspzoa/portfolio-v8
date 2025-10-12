import { NextResponse } from "next/server"
import { SupportedLanguage } from "@/lib/translate"
import { DATABASE_IDS, fetchNotionData, applyTranslations } from "@/lib/portfolio"
import { getGlobalTranslations } from "@/lib/globalTranslate"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

  try {
    const experiencesRes = await fetchNotionData(DATABASE_IDS.experiences, [
      { property: "date", direction: "descending" },
    ])
    const data = experiencesRes.results

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations({ experiences: data }, lang)
      data.forEach((item: Record<string, unknown>, itemIndex: number) => {
        applyTranslations(item, "experiences", itemIndex, translationMap)
      })
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error("Experiences API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch experiences data" },
      { status: 500 }
    )
  }
}