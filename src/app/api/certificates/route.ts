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
    const certificatesRes = await fetchNotionData(DATABASE_IDS.certificates, [
      { property: "date", direction: "descending" },
    ])
    const data = certificatesRes.results

    if (lang !== "ko") {
      const translationMap = await getGlobalTranslations(
        { certificates: data },
        lang
      )
      data.forEach((item: Record<string, unknown>, itemIndex: number) => {
        applyTranslations(item, "certificates", itemIndex, translationMap)
      })
    }

    return NextResponse.json({ results: data })
  } catch (error) {
    console.error("Certificates API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch certificates data" },
      { status: 500 }
    )
  }
}
