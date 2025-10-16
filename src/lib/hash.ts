import { createHash } from "crypto"

export function generateHash(data: Record<string, unknown>): string {
  const allTexts: string[] = []

  const fieldsToTranslate: Record<string, string[]> = {
    aboutme: ["content"],
    awards: ["name", "description"],
    certificates: ["name", "kind", "institution"],
    experiences: ["name", "organization", "description"],
    projects: ["name", "description", "shortDescription"],
    activities: [],
    skills: [],
  }

  Object.entries(data).forEach(([type, items]) => {
    if (Array.isArray(items)) {
      items.forEach((item: Record<string, unknown>) => {
        if (!item.properties) return

        const fields = fieldsToTranslate[type] || []
        fields.forEach((field) => {
          const properties = item.properties as Record<string, unknown>
          const property = properties[field] as Record<string, unknown>
          let text = ""

          if (
            property?.title &&
            Array.isArray(property.title) &&
            property.title[0]
          ) {
            const titleItem = property.title[0] as Record<string, unknown>
            if (
              titleItem.plain_text &&
              typeof titleItem.plain_text === "string"
            ) {
              text = titleItem.plain_text
            }
          } else if (
            property?.rich_text &&
            Array.isArray(property.rich_text) &&
            property.rich_text[0]
          ) {
            const richTextItem = property.rich_text[0] as Record<
              string,
              unknown
            >
            if (
              richTextItem.plain_text &&
              typeof richTextItem.plain_text === "string"
            ) {
              text = richTextItem.plain_text
            }
          }

          if (text && text.trim()) {
            allTexts.push(text)
          }
        })
      })
    }
  })

  const extractedText = allTexts.join(" ")
  const hash = createHash("sha256").update(extractedText).digest("hex")

  return hash
}
export function extractTextContent(data: Record<string, unknown>): string {
  const textParts: string[] = []

  function extractFromProperty(property: Record<string, unknown>) {
    if (property?.title && Array.isArray(property.title)) {
      property.title.forEach((item: Record<string, unknown>) => {
        if (item.plain_text && typeof item.plain_text === "string") {
          textParts.push(item.plain_text)
        }
      })
    }

    if (property?.rich_text && Array.isArray(property.rich_text)) {
      property.rich_text.forEach((item: Record<string, unknown>) => {
        if (item.plain_text && typeof item.plain_text === "string") {
          textParts.push(item.plain_text)
        }
      })
    }
  }

  if (data?.properties && typeof data.properties === "object") {
    Object.values(data.properties as Record<string, unknown>).forEach(
      (property) => {
        if (property && typeof property === "object") {
          extractFromProperty(property as Record<string, unknown>)
        }
      }
    )
  }

  return textParts.join(" ")
}
