import { Tile } from "@/components/common/Tile"
import { useAwards } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 0.5rem;
`

const AwardCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 8px;
`

const MedalEmoji = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`

const AwardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

const AwardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--content-standard-primary);
  margin: 0;
`

const AwardDescription = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--content-standard-primary);
  margin: 0;
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
        <Container>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </Container>
      </Tile>
    )
  if (error) return <Tile title="Awards">Error loading awards</Tile>

  return (
    <Tile title="Awards">
      <Container>
        {awards?.map((award) => (
          <AwardCard key={award.id}>
            <MedalEmoji>
              {getMedalEmoji(award.properties.medal?.select?.name)}
            </MedalEmoji>
            <AwardContent>
              <AwardTitle>
                {award.properties.name?.title[0]?.plain_text}
              </AwardTitle>
              <AwardDescription>
                {formatDate(award.properties.date?.date.start)} /{" "}
                {award.properties.description?.rich_text[0]?.plain_text}
              </AwardDescription>
            </AwardContent>
          </AwardCard>
        ))}
      </Container>
    </Tile>
  )
}
