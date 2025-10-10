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
import LanguageSelector from "@/components/LanguageSelector"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const TileArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1024px;
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
      <LanguageSelector />
      <HeroSection />
      <Content>
        <TileArea>
          <AboutMe />
          <Skills />
          <Row>
            <Column>
              <Experiences />
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
      </Content>
    </Container>
  )
}
