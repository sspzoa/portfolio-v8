import { Tile } from "@/components/common/Tile"
import { useSkills } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import Image from "next/image"
import styled from "@emotion/styled"
import { TileContainer } from "@/components/common/Layout"

const SkillsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 1rem;
  justify-items: center;
  align-items: center;
`

export function Skills() {
  const { data: skills, isLoading, error } = useSkills()

  if (isLoading)
    return (
      <Tile title="Skills">
        <SkillsGrid>
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} width={37} height={37} borderRadius="999px" />
          ))}
        </SkillsGrid>
      </Tile>
    )
  if (error) return <Tile title="Skills">Error loading skills</Tile>

  return (
    <Tile title="Skills">
      <TileContainer gap="1rem">
        <SkillsGrid>
          {skills?.map((skill) => (
            <div key={skill.id}>
              {skill.properties.icon?.files[0]?.file?.url && (
                <Image
                  src={skill.properties.icon.files[0].file.url}
                  title={skill.properties.name?.title[0]?.plain_text}
                  alt={skill.properties.name?.title[0]?.plain_text || ""}
                  width={32}
                  height={32}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </SkillsGrid>
      </TileContainer>
    </Tile>
  )
}
