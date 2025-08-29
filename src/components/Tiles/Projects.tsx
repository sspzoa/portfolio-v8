import { Tile } from "@/components/common/Tile"
import { useProjects } from "@/hooks/api"

export function Projects() {
  const { data: projects, isLoading, error } = useProjects()

  if (isLoading) return <Tile title="Projects">Loading...</Tile>
  if (error) return <Tile title="Projects">Error loading projects</Tile>

  return (
    <Tile title="Projects">
      {projects?.map((project) => (
        <div key={project.id}>
          <h3>{project.properties.name?.title[0]?.plain_text}</h3>
          <p>
            Description:{" "}
            {project.properties.description?.rich_text[0]?.plain_text}
          </p>
          <p>
            Side Project:{" "}
            {project.properties.isSideProject.checkbox ? "Yes" : "No"}
          </p>
          {project.icon?.file?.url && (
            <img
              src={project.icon.file.url}
              alt="Project icon"
              width={50}
              height={50}
            />
          )}
        </div>
      ))}
    </Tile>
  )
}
