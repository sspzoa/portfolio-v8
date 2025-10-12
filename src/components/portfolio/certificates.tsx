import { Tile } from "@/components/ui/tile"
import { usePortfolio } from "@/hooks/api"
import Skeleton from "@/components/ui/skeleton"
import { Card, Content, TileContainer } from "@/components/ui/layout"
import { DescriptionText, TitleText } from "@/components/ui/typo"

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}.${month}`
}

export function Certificates() {
  const { data, isLoading, error } = usePortfolio()
  const certificates = data?.certificates

  if (isLoading)
    return (
      <Tile title="Certificates">
        <TileContainer gap="1.5rem">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={38} borderRadius="8px" />
          ))}
        </TileContainer>
      </Tile>
    )
  if (error) return <Tile title="Certificates">Error loading certificates</Tile>

  return (
    <Tile title="Certificates">
      <TileContainer gap="1.5rem">
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
      </TileContainer>
    </Tile>
  )
}
