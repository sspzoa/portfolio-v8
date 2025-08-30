import { Tile } from "@/components/common/Tile"
import { useAboutMe } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import { DetailText } from "@/components/common/Typo"
import { TileContainer } from "../common/Layout"

export function AboutMe() {
  const { data: aboutme, isLoading } = useAboutMe()

  if (isLoading) {
    return (
      <Tile title="About Me">
        <TileContainer>
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="80%" height={20} borderRadius="4px" />
          <Skeleton width="100%" height={20} borderRadius="4px" />
          <Skeleton width="90%" height={20} borderRadius="4px" />
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
