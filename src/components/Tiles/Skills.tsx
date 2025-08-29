import { Tile } from "@/components/common/Tile"
import { useSkills } from "@/hooks/api"

export function Skills() {
  const { data: skills, isLoading, error } = useSkills()

  if (isLoading) return <Tile title="Skills">Loading...</Tile>
  if (error) return <Tile title="Skills">Error loading skills</Tile>

  return (
    <Tile title="Skills">
      {skills?.map((skill) => (
        <div key={skill.id}>
          <h3>{skill.properties.name?.title[0]?.plain_text}</h3>
          {skill.properties.icon?.files[0]?.file?.url && (
            <img src={skill.properties.icon.files[0].file.url} alt="Skill icon" width={32} height={32} />
          )}
        </div>
      ))}
    </Tile>
  )
}
