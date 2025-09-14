import styled from "@emotion/styled"
import React from "react"

export const TitleText = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`

export const DescriptionText = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
`

const StyledDetailText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 2;
  white-space: pre-line;
`

const parseLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const url = new URL(part)
      const domain = url.hostname.replace(/^www\./, "")

      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0066cc",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          {domain}
        </a>
      )
    }
    return part
  })
}

const parseBoldText = (text: string | undefined) => {
  if (!text) return ""

  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2)
      return (
        <strong key={index} style={{ fontWeight: 700 }}>
          {parseLinks(boldText)}
        </strong>
      )
    }
    return parseLinks(part)
  })
}

interface DetailTextProps {
  children?: string
}

export const DetailText: React.FC<DetailTextProps> = ({ children }) => {
  const parsedContent = parseBoldText(children)

  return <StyledDetailText>{parsedContent}</StyledDetailText>
}
