import styled from "@emotion/styled"

const TileContainer = styled.div`
  background-color: var(--components-fill-standard-primary);
  border-radius: 16px;
  padding: 1.5rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`
const TileTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--content-standard-tertiary);
  margin-bottom: 1.5rem;
`

export const Tile: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <TileContainer>
      <TileTitle>{title}</TileTitle>
      {children}
    </TileContainer>
  )
}
