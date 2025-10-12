import { NextResponse } from "next/server"
import { SupportedLanguage } from "@/lib/translate"
import { DATABASE_IDS, fetchNotionData, applyTranslations } from "@/lib/portfolio"
import { getGlobalTranslations } from "@/lib/globalTranslate"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

  try {
    const awardsRes = await fetchNotionData(DATABASE_IDS.awards, [
      { property: "score", direction: "descending" },
      { property: "date", direction: "descending" },
    ])
    const data = awardsRes.results

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations({ awards: data }, lang)
      data.forEach((item: Record<string, unknown>, itemIndex: number) => {
        applyTranslations(item, "awards", itemIndex, translationMap)
      })
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error("Awards API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch awards data" },
      { status: 500 }
    )
  }
}