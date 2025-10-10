"use client"

import { useAtom } from "jotai"
import styled from "@emotion/styled"
import { languageAtom } from "@/store/atoms"
import { SupportedLanguage } from "@/lib/translate"

interface Language {
  code: SupportedLanguage
  label: string
  flag: string
  alertMessage: string
}

const languages: Language[] = [
  {
    code: "ko",
    label: "KO",
    flag: "🇰🇷",
    alertMessage: "원본 언어입니다.",
  },
  {
    code: "en",
    label: "EN",
    flag: "🇺🇸",
    alertMessage:
      "This content has been translated using AI and may not be completely accurate.",
  },
  {
    code: "ja",
    label: "JP",
    flag: "🇯🇵",
    alertMessage:
      "このコンテンツはAIによって翻訳されており、完全に正確ではない可能性があります。",
  },
]

const Container = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 50;
  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
  }
`

const LanguageBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background: var(--components-fill-standard-primary);
  border-radius: 9999px;
  box-shadow: 0 4px 12px var(--components-translucent-secondary);
  border: 1px solid var(--line-outline);
  padding: 4px;
  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 20px;
  }
`

const LanguageButton = styled.button<{ isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 60px;
  padding: 8px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  background: ${({ isActive }) =>
    isActive ? "var(--core-accent)" : "transparent"};
  color: ${({ isActive }) =>
    isActive ? "var(--solid-white)" : "var(--content-standard-secondary)"};
  box-shadow: ${({ isActive }) =>
    isActive ? "0 2px 4px var(--core-accent-translucent)" : "none"};

  &:hover {
    background: ${({ isActive }) =>
      isActive ? "var(--core-accent)" : "var(--components-interactive-hover)"};
    color: ${({ isActive }) =>
      isActive ? "var(--solid-white)" : "var(--content-standard-primary)"};
  }

  &:active {
    background: ${({ isActive }) =>
      isActive
        ? "var(--core-accent)"
        : "var(--components-interactive-pressed)"};
  }
`

const Flag = styled.span`
  font-size: 12px;
  line-height: 1;
`

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
`

export default function LanguageSelector() {
  const [language, setLanguage] = useAtom(languageAtom)

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    const selectedLanguage = languages.find((lang) => lang.code === langCode)
    if (selectedLanguage && langCode !== "ko") {
      alert(selectedLanguage.alertMessage)
    }
    setLanguage(langCode)
  }

  return (
    <Container>
      <LanguageBar>
        {languages.map((lang) => (
          <LanguageButton
            key={lang.code}
            isActive={language === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <Flag>{lang.flag}</Flag>
            <Label>{lang.label}</Label>
          </LanguageButton>
        ))}
      </LanguageBar>
    </Container>
  )
}
