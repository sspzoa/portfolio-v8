import { Tile } from "@/components/ui/tile"
import { usePortfolio } from "@/hooks/api"
import Skeleton from "@/components/ui/skeleton"
import { DescriptionText, DetailText, TitleText } from "@/components/ui/typo"
import {
  Card,
  CardColumn,
  Content,
  TileContainer,
} from "@/components/ui/layout"
import { Icon, IconImage } from "@/components/ui/object"

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

export function Experiences() {
  const { data, isLoading, error } = usePortfolio()
  const experiences = data?.experiences

  if (isLoading)
    return (
      <Tile title="Experiences">
        <TileContainer gap="3rem">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardColumn key={index}>
              <Skeleton width="100%" height={70} borderRadius="16px" />
              <Skeleton width="100%" height={20} borderRadius="4px" />
              <Skeleton width="80%" height={20} borderRadius="4px" />
              <Skeleton width="90%" height={20} borderRadius="4px" />
            </CardColumn>
          ))}
        </TileContainer>
      </Tile>
    )
  if (error) return <Tile title="Experiences">Error loading experiences</Tile>

  return (
    <Tile title="Experiences">
      <TileContainer gap="3rem">
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
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--content-standard-secondary)",
                    }}
                  >
                    💼
                  </span>
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
      </TileContainer>
    </Tile>
  )
}
