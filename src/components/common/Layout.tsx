import styled from "@emotion/styled"

export const Card = styled.div<{ hasBackground?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  ${({ hasBackground = false }) =>
    hasBackground &&
    `
      padding: 1rem;
      border-radius: 16px;
      background-color: var(--backgroud-standard-secondary);
    `}
`
export const TileContainer = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap || "2.75rem"};
  padding: 0.5rem;
  @media (max-width: 768px) {
    padding: 0;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

export const CardColumn = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
`
