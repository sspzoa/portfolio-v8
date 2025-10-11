import { createHash } from "crypto"

export function generateHash(data: Record<string, unknown>): string {
  const jsonString = JSON.stringify(data, Object.keys(data).sort())
  return createHash("sha256").update(jsonString).digest("hex")
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
