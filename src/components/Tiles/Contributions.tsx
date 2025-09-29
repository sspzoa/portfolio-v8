import { Tile } from "@/components/common/Tile"
import GitHubCalendar from "react-github-calendar"
import styled from "@emotion/styled"

const Container = styled.a`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
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
        <GitHubCalendar username="sspzoa" />
      </Container>
    </Tile>
  )
}
