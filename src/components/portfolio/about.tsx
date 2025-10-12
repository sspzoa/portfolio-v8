import { Tile } from "@/components/ui/tile"
import { usePortfolio } from "@/hooks/api"
import Skeleton from "@/components/ui/skeleton"
import { DetailText } from "@/components/ui/typo"
import { TileContainer } from "@/components/ui/layout"
import styled from "@emotion/styled"

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export function AboutMe() {
  const { data, isLoading } = usePortfolio()
  const aboutme = data?.aboutme

  if (isLoading) {
    return (
      <Tile title="About Me">
        <TileContainer>
          <SkeletonContainer>
            <Skeleton width="100%" height={20} borderRadius="4px" />
            <Skeleton width="100%" height={20} borderRadius="4px" />
            <Skeleton width="80%" height={20} borderRadius="4px" />
            <Skeleton width="90%" height={20} borderRadius="4px" />
            <Skeleton width="40%" height={20} borderRadius="4px" />
            <Skeleton width="100%" height={20} borderRadius="4px" />
            <Skeleton width="100%" height={20} borderRadius="4px" />
            <Skeleton width="80%" height={20} borderRadius="4px" />
            <Skeleton width="90%" height={20} borderRadius="4px" />
            <Skeleton width="40%" height={20} borderRadius="4px" />
          </SkeletonContainer>
        </TileContainer>
      </Tile>
    )
  }

  return (
    <Tile title="About Me">
      <TileContainer>
        <DetailText>
          {aboutme?.properties.content?.title[0].plain_text}
        </DetailText>
      </TileContainer>
    </Tile>
  )
}
