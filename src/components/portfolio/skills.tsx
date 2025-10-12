import { Tile } from "@/components/ui/tile"
import { usePortfolio } from "@/hooks/api"
import Skeleton from "@/components/ui/skeleton"
import Image from "next/image"
import styled from "@emotion/styled"
import { Tag, Tags, TileContainer } from "@/components/ui/layout"
import { SkillType } from "@/types"
import { DescriptionText } from "@/components/ui/typo"

const Categories = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 3rem;
  justify-items: flex-start;
  align-items: flex-start;
`

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.75rem;
`

export function Skills() {
  const { data, isLoading, error } = usePortfolio()
  const skills = data?.skills

  if (isLoading)
    return (
      <Tile title="Skills">
        <TileContainer>
          <Categories>
            {Array.from({ length: 5 }).map((_, categoryIndex) => (
              <CategorySection key={categoryIndex}>
                <Skeleton width={150} height={14.5} borderRadius={4} />
                <Tags>
                  {Array.from({ length: 4 }).map((_, tagIndex) => (
                    <Skeleton
                      key={tagIndex}
                      width={90}
                      height={26}
                      borderRadius={999}
                    />
                  ))}
                </Tags>
              </CategorySection>
            ))}
          </Categories>
        </TileContainer>
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
              <DescriptionText>{category}</DescriptionText>
              <Tags>
                {groupedSkills[category].map((skill) => (
                  <Tag
                    key={skill.id}
                    isEmphasized={skill.properties.isMain.checkbox}
                  >
                    <Image
                      src={skill.properties.icon?.files[0].file.url || ""}
                      title={skill.properties.name?.title[0]?.plain_text}
                      alt={skill.properties.name?.title[0]?.plain_text || ""}
                      width={16}
                      height={16}
                      draggable={false}
                    />
                    <DescriptionText>
                      {skill.properties.name?.title[0].plain_text}
                    </DescriptionText>
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
