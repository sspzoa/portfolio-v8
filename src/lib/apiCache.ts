import { getTranslationFromCache, saveTranslationToCache } from "./mongodb"
import { generateHash } from "./hash"
import { SupportedLanguage } from "./translate"

export async function getOrCreateApiTranslation<T>(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects",
  data: { results: T[] },
  lang: SupportedLanguage,
  translateFunction: (item: T, lang: SupportedLanguage) => Promise<T>
): Promise<{ results: T[] }> {
  if (lang === "ko") {
    return data
  }

  const originalHash = generateHash(data)
  const cacheKey = `${contentType}_${lang}`

  const cachedTranslation = await getTranslationFromCache(
    contentType,
    cacheKey,
    lang,
    originalHash
  )

  if (cachedTranslation) {
    return cachedTranslation as { results: T[] }
  }

  const translatedResults = await Promise.all(
    data.results.map((item: T) => translateFunction(item, lang))
  )

  const translatedData = { results: translatedResults }

  await saveTranslationToCache(
    contentType,
    cacheKey,
    lang,
    originalHash,
    translatedData as Record<string, unknown>
  )

  return translatedData
}