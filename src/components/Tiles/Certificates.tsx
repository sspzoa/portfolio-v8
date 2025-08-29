import { Tile } from "@/components/common/Tile"
import { useCertificates } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 0.5rem;
`

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 8px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--content-standard-primary);
  margin: 0;
`

const Description = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--content-standard-primary);
  margin: 0;
`

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}.${month}`
}

export function Certificates() {
  const { data: certificates, isLoading, error } = useCertificates()

  if (isLoading)
    return (
      <Tile title="Certificates">
        <Container>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </Container>
      </Tile>
    )
  if (error) return <Tile title="Certificates">Error loading certificates</Tile>

  return (
    <Tile title="Certificates">
      <Container>
        {certificates?.map((certificate) => (
          <Card key={certificate.id}>
            <Content>
              <Title>{certificate.properties.name?.title[0]?.plain_text}</Title>
              <Description>
                {formatDate(certificate.properties.date?.date.start)} /{" "}
                {certificate.properties.kind?.rich_text[0]?.plain_text} /{" "}
                {certificate.properties.institution?.rich_text[0]?.plain_text}
              </Description>
            </Content>
          </Card>
        ))}
      </Container>
    </Tile>
  )
}
