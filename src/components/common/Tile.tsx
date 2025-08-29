import styled from "@emotion/styled"
import React from "react"

const TileContainer = styled.div`
  background-color: var(--components-fill-standard-primary);
  border-radius: 16px;
  padding: 1.5rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
`
const TileTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--content-standard-tertiary);
  margin-bottom: 1.5rem;
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
