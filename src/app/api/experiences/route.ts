import { NextResponse } from "next/server"
import { getNotionCache, getGlobalTranslationFromCache } from "@/lib/mongodb"
import { SupportedLanguage } from "@/lib/translate"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = (searchParams.get("lang") as SupportedLanguage) || "ko"

    const data = await getNotionCache("experiences")

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 })
    }

    if (lang === "ko") {
      return NextResponse.json(data)
    }

    const cachedTranslations = await getGlobalTranslationFromCache(lang)

    if (!cachedTranslations) {
      return NextResponse.json(data)
    }

    const translationMap = new Map(
      Object.entries(cachedTranslations as Record<string, string>)
    )

    const translatedData = data.map(
      (item: Record<string, unknown>, index: number) => {
        if (!item.properties) return item

        const translatedItem = { ...item }
        const fieldsToTranslate = ["name", "organization", "description"]

        fieldsToTranslate.forEach((field) => {
          const translationKey = `experiences_${index}_${field}`
          const translation = translationMap.get(translationKey)

          const properties = translatedItem.properties as Record<
            string,
            Record<string, unknown>
          >
          if (translation && properties[field]) {
            const property = properties[field]
            if (property.title && Array.isArray(property.title)) {
              properties[field] = {
                ...property,
                title: [
                  {
                    ...(property.title[0] as Record<string, unknown>),
                    plain_text: translation,
                  },
                ],
              }
            } else if (
              property.rich_text &&
              Array.isArray(property.rich_text)
            ) {
              properties[field] = {
                ...property,
                rich_text: [
                  {
                    ...(property.rich_text[0] as Record<string, unknown>),
                    plain_text: translation,
                  },
                ],
              }
            }
          }
        })

        return translatedItem
      }
    )

    return NextResponse.json(translatedData)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch experiences data" },
      { status: 500 }
    )
  }
}
