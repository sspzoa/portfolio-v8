export interface ProjectType {
  id: string
  public_url: string
  icon: { file: { url: string } }
  cover: { file: { url: string } }
  properties: {
    teamSize: { number: number }
    name?: { title: { plain_text: string }[] }
    description?: { rich_text: { plain_text: string }[] }
    shortDescription?: { rich_text: { plain_text: string }[] }
    isSideProject: { checkbox: boolean }
    tags: { multi_select: { name: string }[] }
    workPeriod?: { date: { start: string; end?: string } }
  }
}
