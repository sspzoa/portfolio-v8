"use client"

import styled from "@emotion/styled"
import { Footer } from "@/components/Footer"
import { AboutMe } from "@/components/Tiles/AboutMe"
import { Skills } from "@/components/Tiles/Skills"
import { Experience } from "@/components/Tiles/Experience"
import { Awards } from "@/components/Tiles/Awards"
import { Certificates } from "@/components/Tiles/Certificates"
import { Projects } from "@/components/Tiles/Projects"
import { Contributions } from "@/components/Tiles/Contributions"

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
  height: 80dvh;
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
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`

const TitleText = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const TileArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 8rem;
  padding: 0 1rem;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
        <LogoImage src="/sspzoa_logo.svg" alt="sspzoa Logo" draggable={false} />
        <TitleText>
          <span>sspzoa</span>{" "}
          <span style={{ color: "var(--content-standard-tertiary)" }}>
            Seungpyo Suh
          </span>{" "}
        </TitleText>
      </HeroArea>
      <TileArea>
        <AboutMe />
        <Row>
          <Column>
            <Skills />
            <Experience />
          </Column>
          <Column>
            <Awards />
            <Certificates />
          </Column>
        </Row>
      </TileArea>
      <TileArea>
        <Contributions />
        <Projects />
      </TileArea>
      <Footer />
    </Container>
  )
}
