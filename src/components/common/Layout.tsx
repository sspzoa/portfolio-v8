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

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Tag = styled.span<{ isEmphasized?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--line-outline);
  color: var(--content-standard-secondary);
  background-color: var(--components-fill-standard-primary);
  transition: all 0.2s ease;

  ${({ isEmphasized }) =>
    isEmphasized &&
    `
      background-color: var(--core-accent-translucent);
      color: var(--core-accent);
      border: 1px solid var(--core-accent);
    `}

  &:hover {
    background-color: var(--components-interactive-hover);
    color: var(--content-standard-primary);
  }
`
