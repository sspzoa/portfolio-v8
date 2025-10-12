import styled from "@emotion/styled"

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
}

const SkeletonContainer = styled.div`
  background-color: var(--components-fill-standard-tertiary);
  animation: pulse 1.5s infinite;
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
`

export default function Skeleton({
  width,
  height,
  borderRadius,
}: SkeletonProps) {
  return (
    <SkeletonContainer
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  )
}
