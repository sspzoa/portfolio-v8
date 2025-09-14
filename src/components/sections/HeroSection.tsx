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
  height: 30rem;
  width: 100%;
`

const MainImage = styled.div`
  width: 150px;
  height: 200px;
  border-radius: 36px;
  background-image: url("/photo.jpg");
  background-size: 110%;
  background-position: top -1px center;
`

const TitleText = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
`

const Contacts = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`
const Images = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`

export function HeroSection() {
  return (
    <HeroArea>
      <MainImage />
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
