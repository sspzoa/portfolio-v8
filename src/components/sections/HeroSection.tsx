import styled from "@emotion/styled"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"

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
    width: 120px;
    height: 120px;
    border-radius: 24px;
  }
`

const TitleText = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const Contacts = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`

export function HeroSection() {
  return (
    <HeroArea>
      <LogoImage src="/sspzoa_logo.svg" alt="sspzoa Logo" draggable={false} />
      <TitleText>
        <span>sspzoa</span>{" "}
        <span style={{ color: "var(--content-standard-tertiary)" }}>
          Seungpyo Suh
        </span>{" "}
      </TitleText>
      <Contacts>
        <a
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2xl" />
        </a>

        <a
          href="https://linkedin.com/in/seungpyosuh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLinkedin} size="2xl" />
        </a>

        <a href="mailto:me@sspzoa.io" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faEnvelope} size="2xl" />
        </a>
      </Contacts>
    </HeroArea>
  )
}
