import { Tile } from "@/components/common/Tile"
import { useCertificates } from "@/hooks/api"

export function Certificates() {
  const { data: certificates, isLoading, error } = useCertificates()

  if (isLoading) return <Tile title="Certificates">Loading...</Tile>
  if (error) return <Tile title="Certificates">Error loading certificates</Tile>

  return (
    <Tile title="Certificates">
      {certificates?.map((certificate) => (
        <div key={certificate.id}>
          <h3>{certificate.properties.name?.title[0]?.plain_text}</h3>
          <p>Kind: {certificate.properties.kind?.rich_text[0]?.plain_text}</p>
          <p>Institution: {certificate.properties.institution?.rich_text[0]?.plain_text}</p>
          <p>Date: {certificate.properties.date?.date.start}</p>
        </div>
      ))}
    </Tile>
  )
}