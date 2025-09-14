import styled from "@emotion/styled"

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--backgroud-standard-primary);
`

const FooterText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: var(--content-standard-tertiary);
`

export const Footer = () => {
  return (
    <Container>
      <FooterText>
        &copy; 2023-{new Date().getFullYear()} Seungpyo Suh. All rights
        reserved.
      </FooterText>
    </Container>
  )
}
