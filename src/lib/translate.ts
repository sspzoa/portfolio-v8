import OpenAI from "openai"
import { AboutMeType } from "@/types/AboutMeType"
import { ExperienceType } from "@/types/ExperienceType"
import { AwardType } from "@/types/AwardType"
import { CertificateType } from "@/types/CertificateType"
import { ProjectType } from "@/types/ProjectType"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type SupportedLanguage = "ko" | "en" | "ja"

const languageMap = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
}

export async function translateAboutMe(
  data: AboutMeType,
  targetLang: SupportedLanguage
): Promise<AboutMeType> {
  if (targetLang === "ko") return data

  const content = data.properties.content?.title?.[0]?.plain_text
  if (!content) return data

  const translated = await translateText(content, targetLang)

  return {
    properties: {
      content: {
        title: [{ plain_text: translated }],
      },
    },
  }
}

export async function translateExperience(
  data: ExperienceType,
  targetLang: SupportedLanguage
): Promise<ExperienceType> {
  if (targetLang === "ko") return data

  const name = data.properties.name?.title?.[0]?.plain_text
  const organization = data.properties.organization?.rich_text?.[0]?.plain_text
  const description = data.properties.description?.rich_text?.[0]?.plain_text

  const [translatedName, translatedOrganization, translatedDescription] =
    await Promise.all([
      name ? translateText(name, targetLang) : name,
      organization ? translateText(organization, targetLang) : organization,
      description ? translateText(description, targetLang) : description,
    ])

  return {
    ...data,
    properties: {
      ...data.properties,
      name: translatedName
        ? { title: [{ plain_text: translatedName }] }
        : data.properties.name,
      organization: translatedOrganization
        ? { rich_text: [{ plain_text: translatedOrganization }] }
        : data.properties.organization,
      description: translatedDescription
        ? { rich_text: [{ plain_text: translatedDescription }] }
        : data.properties.description,
    },
  }
}

export async function translateAward(
  data: AwardType,
  targetLang: SupportedLanguage
): Promise<AwardType> {
  if (targetLang === "ko") return data

  const name = data.properties.name?.title?.[0]?.plain_text
  const description = data.properties.description?.rich_text?.[0]?.plain_text

  const [translatedName, translatedDescription] = await Promise.all([
    name ? translateText(name, targetLang) : name,
    description ? translateText(description, targetLang) : description,
  ])

  return {
    ...data,
    properties: {
      ...data.properties,
      name: translatedName
        ? { title: [{ plain_text: translatedName }] }
        : data.properties.name,
      description: translatedDescription
        ? { rich_text: [{ plain_text: translatedDescription }] }
        : data.properties.description,
    },
  }
}

export async function translateCertificate(
  data: CertificateType,
  targetLang: SupportedLanguage
): Promise<CertificateType> {
  if (targetLang === "ko") return data

  const name = data.properties.name?.title?.[0]?.plain_text
  const kind = data.properties.kind?.rich_text?.[0]?.plain_text
  const institution = data.properties.institution?.rich_text?.[0]?.plain_text

  const [translatedName, translatedKind, translatedInstitution] =
    await Promise.all([
      name ? translateText(name, targetLang) : name,
      kind ? translateText(kind, targetLang) : kind,
      institution ? translateText(institution, targetLang) : institution,
    ])

  return {
    ...data,
    properties: {
      ...data.properties,
      name: translatedName
        ? { title: [{ plain_text: translatedName }] }
        : data.properties.name,
      kind: translatedKind
        ? { rich_text: [{ plain_text: translatedKind }] }
        : data.properties.kind,
      institution: translatedInstitution
        ? { rich_text: [{ plain_text: translatedInstitution }] }
        : data.properties.institution,
    },
  }
}

export async function translateProject(
  data: ProjectType,
  targetLang: SupportedLanguage
): Promise<ProjectType> {
  if (targetLang === "ko") return data

  const name = data.properties.name?.title?.[0]?.plain_text
  const description = data.properties.description?.rich_text?.[0]?.plain_text
  const shortDescription =
    data.properties.shortDescription?.rich_text?.[0]?.plain_text

  const [translatedName, translatedDescription, translatedShortDescription] =
    await Promise.all([
      name ? translateText(name, targetLang) : name,
      description ? translateText(description, targetLang) : description,
      shortDescription
        ? translateText(shortDescription, targetLang)
        : shortDescription,
    ])

  return {
    ...data,
    properties: {
      ...data.properties,
      name: translatedName
        ? { title: [{ plain_text: translatedName }] }
        : data.properties.name,
      description: translatedDescription
        ? { rich_text: [{ plain_text: translatedDescription }] }
        : data.properties.description,
      shortDescription: translatedShortDescription
        ? { rich_text: [{ plain_text: translatedShortDescription }] }
        : data.properties.shortDescription,
    },
  }
}

async function translateText(
  text: string,
  targetLang: SupportedLanguage
): Promise<string> {
  try {
    const systemPrompt = `You are a professional translator. Translate the given text to ${languageMap[targetLang]}. Only return the translated text without any additional comments or explanations.

Special translation rules:
- "서승표" should be translated to "Seungpyo Suh" in English and "徐丞杓" in Japanese
- Keep these name translations consistent throughout all content`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.1,
    })

    return response.choices[0].message.content || text
  } catch (error) {
    console.error("Translation error:", error)
    return text
  }
}
