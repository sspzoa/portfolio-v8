import styled from "@emotion/styled"
import React from "react"

const TileContainer = styled.div`
  background-color: var(--components-fill-standard-primary);
  border-radius: 16px;
  padding: 1.5rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`
const TileTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--content-standard-tertiary);
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`

interface TileProps {
  children: React.ReactNode
  title: string
}

export const Tile: React.FC<TileProps> = ({ children, title }) => {
  return (
    <TileContainer>
      <TileTitle>{title}</TileTitle>
      {children}
    </TileContainer>
  )
}
