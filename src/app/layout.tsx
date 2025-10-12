import type { Metadata, Viewport } from "next"
import "./globals.css"
import React from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Seungpyo Suh · 서승표",
  description: "I'm Seungpyo Suh, a software engineer.",
  openGraph: {
    images: [{ url: "https://sspzoa.io/og-image.png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#5472EB",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="robots" content="noimageindex" />
      </head>
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
