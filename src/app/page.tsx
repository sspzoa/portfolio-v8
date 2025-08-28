"use client"

import styled from "@emotion/styled"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100%;
`

export default function Home() {
  return (
    <Container>
      <h1>Hello World</h1>
    </Container>
  )
}
