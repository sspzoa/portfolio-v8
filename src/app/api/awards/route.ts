import { NextResponse } from "next/server"
import { translateAward, SupportedLanguage } from "@/lib/translate"
import { AwardType } from "@/types/AwardType"

const AWARDS_DATABASE_ID = "e01e1b8eb9ac45049db60a8b0e91523c"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"
  const res = await fetch(
    `https://api.notion.com/v1/databases/${AWARDS_DATABASE_ID}/query`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      },
      body: JSON.stringify({
        sorts: [
          {
            property: "score",
            direction: "descending",
          },
          {
            property: "date",
            direction: "descending",
          },
        ],
      }),
    }
  )

  const data = await res.json()

  if (lang !== "ko" && data.results && data.results.length > 0) {
    const translatedResults = await Promise.all(
      data.results.map((item: AwardType) => translateAward(item, lang))
    )
    data.results = translatedResults
  }

  return NextResponse.json(data)
}
