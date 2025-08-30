"use client"

import styled from "@emotion/styled"
import { Footer } from "@/components/Footer"
import { AboutMe } from "@/components/Tiles/AboutMe"
import { Skills } from "@/components/Tiles/Skills"
import { Experiences } from "@/components/Tiles/Experiences"
import { Awards } from "@/components/Tiles/Awards"
import { Certificates } from "@/components/Tiles/Certificates"
import { Projects } from "@/components/Tiles/Projects"
import { Contributions } from "@/components/Tiles/Contributions"
import { HeroSection } from "@/components/sections/HeroSection"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TileArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
  padding: 0 1rem;
  margin-bottom: 8rem;
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0;
  }
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
      <HeroSection />
      <TileArea>
        <AboutMe />
        <Row>
          <Column>
            <Experiences />
          </Column>
          <Column>
            <Skills />
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
