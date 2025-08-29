"use client"

import styled from "@emotion/styled"
import { Tile } from "@/components/common/Tile"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HeroArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: 90dvh;
  width: 100%;
`

const LogoImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 36px;
  transition: box-shadow 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 0 24px #6d87a8;
  }
`

const TitleText = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
`

const TileArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

export default function Home() {
  return (
    <Container>
      <HeroArea>
        <LogoImage src="/sspzoa_logo.svg" alt="sspzoa Logo" />
        <TitleText>
          <span>sspzoa</span>{" "}
          <span style={{ color: "var(--content-standard-tertiary)" }}>
            Seungpyo Suh
          </span>{" "}
        </TitleText>
      </HeroArea>
      <TileArea>
        <Tile title="About">asdf</Tile>
        <Row>
          <Column>
            <Tile title="About">asdf</Tile>
            <Tile title="About">asdf</Tile>
          </Column>
          <Column>
            <Tile title="About">asdf</Tile>
            <Tile title="About">asdf</Tile>
          </Column>
        </Row>
      </TileArea>
    </Container>
  )
}
