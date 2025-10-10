import { NextResponse } from "next/server"
import { translateAboutMe, SupportedLanguage } from "@/lib/translate"
import { AboutMeType } from "@/types/AboutMeType"

const ABOUTME_DATABASE_ID = "25fcc9b72a9c801ba124c5d2158a7f84"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

  const res = await fetch(
    `https://api.notion.com/v1/databases/${ABOUTME_DATABASE_ID}/query`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      },
      body: JSON.stringify({}),
    }
  )

  const data = await res.json()

  if (lang !== "ko" && data.results && data.results.length > 0) {
    const translatedResults = await Promise.all(
      data.results.map((item: AboutMeType) => translateAboutMe(item, lang))
    )
    data.results = translatedResults
  }

  return NextResponse.json(data)
}
