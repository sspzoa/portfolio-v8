import { Tile } from "@/components/common/Tile"
import { useSkills } from "@/hooks/api"
import Skeleton from "@/components/common/Skeleton"
import Image from "next/image"
import styled from "@emotion/styled"
import { Tag, Tags, TileContainer } from "@/components/common/Layout"
import { SkillType } from "@/types/SkillType"

const Categories = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 3rem;
  justify-items: flex-start;
  align-items: flex-start;
`

const CategorySection = styled.div``

const CategoryTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--content-standard-tertiary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
`

export function Skills() {
  const { data: skills, isLoading, error } = useSkills()

  if (isLoading)
    return (
      <Tile title="Skills">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} width={37} height={37} borderRadius="999px" />
        ))}
      </Tile>
    )
  if (error) return <Tile title="Skills">Error loading skills</Tile>

  const groupedSkills =
    skills?.reduce((acc: Record<string, SkillType[]>, skill) => {
      const category = skill.properties.category?.select?.name || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      if (
        skill.properties.name?.title[0]?.plain_text &&
        skill.properties.icon?.files[0]?.file?.url
      ) {
        acc[category].push(skill)
      }
      return acc
    }, {}) || {}

  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    if (a === "Other") return 1
    if (b === "Other") return -1
    return a.localeCompare(b)
  })

  return (
    <Tile title="Skills">
      <TileContainer>
        <Categories>
          {sortedCategories.map((category) => (
            <CategorySection key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              <Tags>
                {groupedSkills[category].map((skill) => (
                  <Tag key={skill.id}>
                    <Image
                      src={skill.properties.icon?.files[0].file.url || ""}
                      title={skill.properties.name?.title[0]?.plain_text}
                      alt={skill.properties.name?.title[0]?.plain_text || ""}
                      width={16}
                      height={16}
                      draggable={false}
                    />
                    {skill.properties.name?.title[0].plain_text}
                  </Tag>
                ))}
              </Tags>
            </CategorySection>
          ))}
        </Categories>
      </TileContainer>
    </Tile>
  )
}
