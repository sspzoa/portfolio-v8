import { getTranslationFromCache, saveTranslationToCache } from "./mongodb"
import { generateHash, extractTextContent } from "./hash"
import { SupportedLanguage } from "./translate"

export async function getOrCreateTranslation<T>(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects",
  data: T,
  itemId: string,
  targetLang: SupportedLanguage,
  translateFunction: (data: T, lang: SupportedLanguage) => Promise<T>
): Promise<T> {
  if (targetLang === "ko") {
    return data
  }

  const textContent = extractTextContent(data as Record<string, unknown>)
  const originalHash = generateHash({ content: textContent })

  const cachedTranslation = await getTranslationFromCache(
    contentType,
    itemId,
    targetLang,
    originalHash
  )

  if (cachedTranslation) {
    return cachedTranslation as T
  }

  const translatedData = await translateFunction(data, targetLang)

  await saveTranslationToCache(
    contentType,
    itemId,
    targetLang,
    originalHash,
    translatedData as Record<string, unknown>
  )

  return translatedData
}

export function extractItemId(data: Record<string, unknown>): string {
  const id = data.id || data._id
  if (typeof id === "string") {
    return id
  }
  return generateHash(data)
}
