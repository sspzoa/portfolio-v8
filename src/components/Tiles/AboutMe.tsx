import { Tile } from "@/components/common/Tile"
import { useAboutMe } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import styled from "@emotion/styled"
import { DetailText } from "@/components/common/Typo"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  padding: 0.5rem;
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
