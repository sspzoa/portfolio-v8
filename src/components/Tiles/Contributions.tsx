import { Tile } from "@/components/common/Tile"
import Link from "next/link"
import GitHubCalendar from "react-github-calendar"
import styled from "@emotion/styled"

const Container = styled.a`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
