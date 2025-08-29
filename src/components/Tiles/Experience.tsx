import { Tile } from "@/components/common/Tile"
import { useExperiences } from "@/hooks/api"

export function Experience() {
  const { data: experiences, isLoading, error } = useExperiences()

  if (isLoading) return <Tile title="Experience">Loading...</Tile>
  if (error) return <Tile title="Experience">Error loading experiences</Tile>

  return (
    <Tile title="Experience">
      {experiences?.map((experience) => (
        <div key={experience.id}>
          <h3>{experience.properties.name?.title[0]?.plain_text}</h3>
          <p>Organization: {experience.properties.organization?.rich_text[0]?.plain_text}</p>
          <p>Date: {experience.properties.date?.date.start}</p>
          {experience.properties.url?.rich_text[0]?.plain_text && (
            <p>URL: {experience.properties.url.rich_text[0].plain_text}</p>
          )}
        </div>
      ))}
    </Tile>
  )
}
