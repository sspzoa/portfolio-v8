export interface ExperienceType {
  id: string
  properties: {
    name?: { title: { plain_text: string }[] }
    organization?: { rich_text: { plain_text: string }[] }
    date?: { date: { start: string; end?: string } }
    url?: { rich_text: { plain_text: string }[] }
    description?: { rich_text: { plain_text: string }[] }
    logo?: { files: Array<{ file: { url: string } }> }
  }
}
