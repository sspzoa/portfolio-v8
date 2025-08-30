import { Tile } from "@/components/common/Tile"
import { useExperiences } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import {
  DescriptionText,
  DetailText,
  TitleText,
} from "@/components/common/Typo"
import { Card, CardColumn, Content } from "@/components/common/Layout"
import { Icon, IconImage } from "@/components/common/Object"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 0.5rem;
`

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}.${month}`
}

const formatDateRange = (startDate?: string, endDate?: string) => {
  const start = formatDate(startDate)
  if (!endDate) return `${start} - Present`
  const end = formatDate(endDate)
  return `${start} - ${end}`
}

export function Experience() {
  const { data: experiences, isLoading, error } = useExperiences()

  if (isLoading)
    return (
      <Tile title="Experience">
        <Container>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </Container>
      </Tile>
    )
  if (error) return <Tile title="Experience">Error loading experiences</Tile>

  return (
    <Tile title="Experience">
      <Container>
        {experiences?.map((experience) => (
          <CardColumn key={experience.id}>
            <Card hasBackground={true}>
              <Icon>
                {experience.properties.logo?.files?.[0]?.file?.url ? (
                  <IconImage
                    draggable={false}
                    src={experience.properties.logo.files[0].file.url}
                    alt={
                      experience.properties.organization?.rich_text[0]
                        ?.plain_text
                    }
                  />
                ) : (
                  <span style={{ fontSize: "1.5rem" }}>💼</span>
                )}
              </Icon>
              <Content>
                <TitleText>
                  {experience.properties.organization?.rich_text[0]?.plain_text}{" "}
                  - {experience.properties.name?.title[0]?.plain_text}
                </TitleText>
                <DescriptionText>
                  {formatDateRange(
                    experience.properties.date?.date?.start,
                    experience.properties.date?.date?.end
                  )}
                </DescriptionText>
              </Content>
            </Card>
            <DetailText>
              {experience.properties.description?.rich_text[0].plain_text}
            </DetailText>
          </CardColumn>
        ))}
      </Container>
    </Tile>
  )
}
