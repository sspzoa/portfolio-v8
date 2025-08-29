import { Tile } from "@/components/common/Tile"
import { useAwards } from "@/hooks/api"

export function Awards() {
  const { data: awards, isLoading, error } = useAwards()

  if (isLoading) return <Tile title="Awards">Loading...</Tile>
  if (error) return <Tile title="Awards">Error loading awards</Tile>

  return (
    <Tile title="Awards">
      {awards?.map((award) => (
        <div key={award.id}>
          <h3>{award.properties.name?.title[0]?.plain_text}</h3>
          <p>
            Description:{" "}
            {award.properties.description?.rich_text[0]?.plain_text}
          </p>
          <p>Date: {award.properties.date?.date.start}</p>
        </div>
      ))}
    </Tile>
  )
}
