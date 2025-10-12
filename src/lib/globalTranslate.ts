import { batchTranslateTexts, SupportedLanguage } from "@/lib/translate"
import { generateHash } from "@/lib/hash"
import { getTranslationFromCache, saveTranslationToCache } from "@/lib/mongodb"

interface GlobalTranslationData {
  aboutme: Record<string, unknown>[]
  awards: Record<string, unknown>[]
  certificates: Record<string, unknown>[]
  experiences: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  activities: Record<string, unknown>[]
  skills: Record<string, unknown>[]
}

interface GlobalTextMapping {
  id: string
  type: keyof GlobalTranslationData
  itemIndex: number
  field: string
  text: string
}

export async function getGlobalTranslations(
  data: GlobalTranslationData,
  targetLang: SupportedLanguage
): Promise<Map<string, string>> {
  if (targetLang === "ko") return new Map()

  // 전체 데이터의 해시 생성
  const globalHash = generateHash(data as unknown as Record<string, unknown>)

  // 글로벌 번역 캐시 확인
  const cachedGlobal = await getTranslationFromCache(
    "projects", // 대표 타입으로 사용
    "global_translations",
    targetLang,
    globalHash
  )

  if (cachedGlobal) {
    return new Map(Object.entries(cachedGlobal as Record<string, string>))
  }

  // 모든 텍스트 추출
  const allTexts: string[] = []
  const mappings: GlobalTextMapping[] = []

  // 각 타입별로 텍스트 추출
  Object.entries(data).forEach(([type, items]) => {
    items.forEach((item: Record<string, unknown>, itemIndex: number) => {
      extractTextsFromItem(
        item,
        type as keyof GlobalTranslationData,
        itemIndex,
        allTexts,
        mappings
      )
    })
  })

  // 배치 번역 실행
  const translatedTexts = await batchTranslateTexts(
    allTexts,
    targetLang,
    "This is a complete developer portfolio including projects, experiences, awards, certificates, and about me section. Maintain consistent professional terminology and style throughout."
  )

  // 번역 결과를 맵으로 변환
  const translationMap = new Map<string, string>()
  mappings.forEach((mapping, index) => {
    const translatedText = translatedTexts[index]
    if (translatedText) {
      translationMap.set(mapping.id, translatedText)
    }
  })

  // 글로벌 캐시에 저장
  await saveTranslationToCache(
    "projects",
    "global_translations",
    targetLang,
    globalHash,
    Object.fromEntries(translationMap) as Record<string, unknown>
  )

  return translationMap
}

function extractTextsFromItem(
  item: Record<string, unknown>,
  type: keyof GlobalTranslationData,
  itemIndex: number,
  allTexts: string[],
  mappings: GlobalTextMapping[]
) {
  if (!item.properties) return

  // 각 타입별로 번역할 필드 정의
  const fieldsToTranslate: Record<string, string[]> = {
    aboutme: ["content"],
    awards: ["name", "description"],
    certificates: ["name", "kind", "institution"],
    experiences: ["name", "organization", "description"],
    projects: ["name", "description", "shortDescription"],
    activities: [], // activities는 번역하지 않음
    skills: [], // skills는 번역하지 않음
  }

  const fields = fieldsToTranslate[type] || []

  fields.forEach((field) => {
    const properties = item.properties as Record<string, unknown>
    const property = properties[field] as Record<string, unknown>
    let text = ""

    if (property?.title && Array.isArray(property.title) && property.title[0]) {
      const titleItem = property.title[0] as Record<string, unknown>
      if (titleItem.plain_text && typeof titleItem.plain_text === "string") {
        text = titleItem.plain_text
      }
    } else if (
      property?.rich_text &&
      Array.isArray(property.rich_text) &&
      property.rich_text[0]
    ) {
      const richTextItem = property.rich_text[0] as Record<string, unknown>
      if (
        richTextItem.plain_text &&
        typeof richTextItem.plain_text === "string"
      ) {
        text = richTextItem.plain_text
      }
    }

    if (text && text.trim()) {
      const id = `${type}_${itemIndex}_${field}`
      allTexts.push(text)
      mappings.push({ id, type, itemIndex, field, text })
    }
  })
}
