import { Tile } from "@/components/common/Tile"
import { useExperiences } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  padding: 0.5rem;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 8px;
`

const Logo = styled.div`
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
`

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

const TitleArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex: 1;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
`

const Description = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
`

const DetailText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  white-space: pre-line;
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
          <Card key={experience.id}>
            <TitleArea>
              <Logo>
                {experience.properties.logo?.files?.[0]?.file?.url ? (
                  <LogoImage
                    src={experience.properties.logo.files[0].file.url}
                    alt={
                      experience.properties.organization?.rich_text[0]
                        ?.plain_text
                    }
                  />
                ) : (
                  <span style={{ fontSize: "1.5rem" }}>💼</span>
                )}
              </Logo>
              <Content>
                <Title>
                  {experience.properties.organization?.rich_text[0]?.plain_text}{" "}
                  - {experience.properties.name?.title[0]?.plain_text}
                </Title>
                <Description>
                  {formatDateRange(
                    experience.properties.date?.date?.start,
                    experience.properties.date?.date?.end
                  )}
                </Description>
              </Content>
            </TitleArea>
            <DetailText>
              {experience.properties.description?.rich_text[0].plain_text}
            </DetailText>
          </Card>
        ))}
      </Container>
    </Tile>
  )
}
