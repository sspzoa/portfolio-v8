"use client"

import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

interface ScalingContextType {
  windowWidth: number
  windowHeight: number
  scale: number
  scaledVh: (vh: number) => number
}

const ScalingContext = createContext<ScalingContextType>({
  windowWidth: 0,
  windowHeight: 0,
  scale: 1,
  scaledVh: (vh) => vh,
})

export const useScaling = () => useContext(ScalingContext)

interface ScalingLayoutProps {
  children: ReactNode
  minWidth?: number
  className?: string
  disableScalingAboveMinWidth?: boolean
  maxScale?: number
  scaleStep?: number
}

export default function ScalingLayout({
  children,
  minWidth = 512,
  className = "",
  disableScalingAboveMinWidth = true,
  maxScale = 1,
  scaleStep = 0.01,
}: ScalingLayoutProps) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(document.documentElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const scale = useMemo(() => {
    if (dimensions.width === 0) return 1

    let newScale: number

    if (dimensions.width < minWidth) {
      newScale = Math.max(dimensions.width / minWidth, 0.1)
    } else if (disableScalingAboveMinWidth) {
      newScale = 1
    } else {
      newScale = Math.min(dimensions.width / minWidth, maxScale)
    }

    return Math.round(newScale / scaleStep) * scaleStep
  }, [
    dimensions.width,
    minWidth,
    disableScalingAboveMinWidth,
    maxScale,
    scaleStep,
  ])

  const scaledVh = useMemo(() => {
    return (vh: number) => {
      const pixelValue = (dimensions.height * vh) / 100
      return pixelValue / scale
    }
  }, [dimensions.height, scale])

  const contextValue = useMemo(
    () => ({
      windowWidth: dimensions.width,
      windowHeight: dimensions.height,
      scale,
      scaledVh,
    }),
    [dimensions.width, dimensions.height, scale, scaledVh]
  )

  if (!mounted) {
    return null
  }

  const scaleStyle = {
    "--scale": scale,
    "--inverse-scale": 1 / scale,
  } as React.CSSProperties

  return (
    <ScalingContext.Provider value={contextValue}>
      <div
        style={{
          ...scaleStyle,
          transformOrigin: "left top",
          transform: "scale(var(--scale))",
          width: "calc(100% * var(--inverse-scale))",
          height: "100dvh",
          position: "relative",
        }}
        className={className}
      >
        {children}
      </div>
    </ScalingContext.Provider>
  )
}
