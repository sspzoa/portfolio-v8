import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type SupportedLanguage = "ko" | "en" | "ja"

const languageMap = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
}

export async function batchTranslateTexts(
  texts: string[],
  targetLang: SupportedLanguage,
  context?: string
): Promise<string[]> {
  if (targetLang === "ko") return texts

  try {
    const numberedTexts = texts
      .map((text, index) => `${index + 1}. ${text}`)
      .join("\n\n")

    const systemPrompt = `You are a professional translator. Translate all the numbered texts to ${languageMap[targetLang]}.

Return ONLY the translated texts in the same numbered format, maintaining consistency across all translations.

Special translation rules:
- "서승표" should be translated to "Seungpyo Suh" in English and "ソ・スンピョ" in Japanese
- Keep these name translations consistent throughout all content
- Preserve all formatting including text wrapped with double asterisks (**bold text**) for emphasis
- Maintain the same formatting structure in the translated output
- Ensure terminology and style consistency across all numbered items
${context ? `- Context: ${context}` : ""}

Example format:
1. [First translated text]

2. [Second translated text]

3. [Third translated text]`

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: numberedTexts,
        },
      ],
    })

    const translatedContent = response.choices[0].message.content || ""

    const translatedTexts = translatedContent
      .split(/\n\n\d+\.\s/)
      .map((text) => text.replace(/^\d+\.\s/, "").trim())
      .filter((text) => text.length > 0)

    return translatedTexts.length === texts.length ? translatedTexts : texts
  } catch (error) {
    console.error("Batch translation error:", error)
    return texts
  }
}
