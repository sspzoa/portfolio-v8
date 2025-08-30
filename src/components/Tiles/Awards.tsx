import { Tile } from "@/components/common/Tile"
import { useAwards } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import { DescriptionText, TitleText } from "@/components/common/Typo"
import { Card, Content, TileContainer } from "@/components/common/Layout"

const Medal = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`

const getMedalEmoji = (medalType?: string) => {
  switch (medalType) {
    case "Gold":
      return "🥇"
    case "Silver":
      return "🥈"
    case "Bronze":
      return "🥉"
    default:
      return "🏆"
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}.${month}`
}

export function Awards() {
  const { data: awards, isLoading, error } = useAwards()

  if (isLoading)
    return (
      <Tile title="Awards">
        <TileContainer gap="1.5rem">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </TileContainer>
      </Tile>
    )
  if (error) return <Tile title="Awards">Error loading awards</Tile>

  return (
    <Tile title="Awards">
      <TileContainer gap="1.5rem">
        {awards?.map((award) => (
          <Card key={award.id}>
            <Medal>{getMedalEmoji(award.properties.medal?.select?.name)}</Medal>
            <Content>
              <TitleText>
                {award.properties.name?.title[0]?.plain_text}
              </TitleText>
              <DescriptionText>
                {formatDate(award.properties.date?.date.start)} /{" "}
                {award.properties.description?.rich_text[0]?.plain_text}
              </DescriptionText>
            </Content>
          </Card>
        ))}
      </TileContainer>
    </Tile>
  )
}
