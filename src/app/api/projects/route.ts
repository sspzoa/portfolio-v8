import { NextResponse } from "next/server"
import { translateProject, SupportedLanguage } from "@/lib/translate"
import { ProjectType } from "@/types/ProjectType"

const PROJECTS_DATABASE_ID = "c47cae2234124b8abf20e1ec41f864e0"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"
  const res = await fetch(
    `https://api.notion.com/v1/databases/${PROJECTS_DATABASE_ID}/query`,
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
            property: "workPeriod",
            direction: "descending",
          },
        ],
      }),
    }
  )

  const data = await res.json()

  if (lang !== "ko" && data.results && data.results.length > 0) {
    const translatedResults = await Promise.all(
      data.results.map((item: ProjectType) => translateProject(item, lang))
    )
    data.results = translatedResults
  }

  return NextResponse.json(data)
}
