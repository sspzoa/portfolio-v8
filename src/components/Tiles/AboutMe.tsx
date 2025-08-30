import { Tile } from "@/components/common/Tile"
import { useAboutMe } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  padding: 0.5rem;
`

const DetailText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-line;
`

export function AboutMe() {
  const { data: aboutme, isLoading } = useAboutMe()

  if (isLoading) {
    return (
      <Tile title="About Me">
        <Container>
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="80%" height={20} borderRadius="4px" />
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="90%" height={20} borderRadius="4px" />
        </Container>
      </Tile>
    )
  }

  return (
    <Tile title="About Me">
      <Container>
        <DetailText>
          {aboutme?.properties.content?.title[0].plain_text}
        </DetailText>
      </Container>
    </Tile>
  )
}
