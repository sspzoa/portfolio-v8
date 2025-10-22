import { Tile } from "@/components/ui/tile"
import GitHubCalendar from "react-github-calendar"
import styled from "@emotion/styled"

const Container = styled.a`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: var(--components-fill-standard-primary);
  border: 1px solid var(--line-outline);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--components-interactive-hover);
    border-color: var(--core-accent);
  }

  &:active {
    background-color: var(--components-interactive-pressed);
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`

export function Contributions() {
  return (
    <Tile title="Contributions">
      <Container
        target="_blank"
        rel="noreferrer noopener"
        href="https://github.com/sspzoa"
      >
        <GitHubCalendar
          username="sspzoa"
          theme={{
            light: [
              "var(--components-fill-standard-secondary)",
              "rgba(84, 114, 235, 0.2)",
              "rgba(84, 114, 235, 0.6)",
              "rgba(84, 114, 235, 0.8)",
              "var(--core-accent)",
            ],
            dark: [
              "var(--components-fill-standard-secondary)",
              "rgba(84, 114, 235, 0.2)",
              "rgba(84, 114, 235, 0.6)",
              "rgba(84, 114, 235, 0.8)",
              "var(--core-accent)",
            ],
          }}
        />
      </Container>
    </Tile>
  )
}
