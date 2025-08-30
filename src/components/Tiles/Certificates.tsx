import { Tile } from "@/components/common/Tile"
import { useCertificates } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import { Card, Content } from "@/components/common/Layout"
import { DescriptionText, TitleText } from "@/components/common/Typo"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;
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
              <TitleText>
                {certificate.properties.name?.title[0]?.plain_text}
              </TitleText>
              <DescriptionText>
                {formatDate(certificate.properties.date?.date.start)} /{" "}
                {certificate.properties.kind?.rich_text[0]?.plain_text} /{" "}
                {certificate.properties.institution?.rich_text[0]?.plain_text}
              </DescriptionText>
            </Content>
          </Card>
        ))}
      </Container>
    </Tile>
  )
}
