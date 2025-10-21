"use client"

import styled from "@emotion/styled"
import { Footer } from "@/components/portfolio/footer"
import { AboutMe } from "@/components/portfolio/about"
import { Skills } from "@/components/portfolio/skills"
import { Experiences } from "@/components/portfolio/experiences"
import { Awards } from "@/components/portfolio/awards"
import { Certificates } from "@/components/portfolio/certificates"
import { Projects } from "@/components/portfolio/projects"
import { Contributions } from "@/components/portfolio/contributions"
import { HeroSection } from "@/components/portfolio/hero"
import LanguageSelector from "@/components/ui/language-selector"

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
