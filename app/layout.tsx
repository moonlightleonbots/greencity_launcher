import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Elbfuhrt Netzwerk - FiveM Launcher",
  description: "FiveM Server Launcher für das Elbfuhrt Netzwerk",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
@font-face {
  font-family: 'Hemi Head';
  src: url('/fonts/hemi-head-bd-it.ttf') format('truetype');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}

html {
  font-family: 'Hemi Head', ${GeistSans.style.fontFamily};
  --font-sans: 'Hemi Head', ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-hemi: 'Hemi Head', sans-serif;
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
