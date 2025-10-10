import { NextResponse } from "next/server"
import { translateCertificate, SupportedLanguage } from "@/lib/translate"
import { CertificateType } from "@/types/CertificateType"

const CERTIFICATES_DATABASE_ID = "105cc9b72a9c8088a82defcfa25890aa"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"
  const res = await fetch(
    `https://api.notion.com/v1/databases/${CERTIFICATES_DATABASE_ID}/query`,
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
      data.results.map((item: CertificateType) =>
        translateCertificate(item, lang)
      )
    )
    data.results = translatedResults
  }

  return NextResponse.json(data)
}
