export interface AboutMeType {
  properties: {
    content?: { title: { plain_text: string }[] }
  }
}

export interface AwardType {
  id: string
  public_url: string
  properties: {
    name?: { title: { plain_text: string }[] }
    description?: { rich_text: { plain_text: string }[] }
    date?: { date: { start: string } }
  }
}

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

export interface SkillType {
  id: string
  properties: {
    name?: { title: { plain_text: string }[] }
    icon?: { files: Array<{ file: { url: string } }> }
    category?: { select: { name: string } }
    isMain: { checkbox: boolean }
  }
}

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

export interface ActivityType {
  id: string
  public_url: string
  properties: {
    name?: { title: { plain_text: string }[] }
    host?: { multi_select: { name: string }[] }
    date?: { date: { start: string } }
  }
}

export interface CertificateType {
  id: string
  public_url: string
  properties: {
    name?: { title: { plain_text: string }[] }
    kind?: { rich_text: { plain_text: string }[] }
    institution?: { rich_text: { plain_text: string }[] }
    date?: { date: { start: string } }
  }
}
