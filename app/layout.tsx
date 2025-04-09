import "regenerator-runtime/runtime"
import "./globals.css"
import "./components/scrollbar-hide.css"
import "./components/chatbot-animations.css"
import "./components/smooth-animations.css"
import "./components/responsive.css"
import { Inter } from "next/font/google"
import type React from "react"
import ThemeProvider from "./components/ThemeProvider"
import SearchProvider from "./components/SearchProvider"
import { ImageUrlProvider } from "./context/ImageUrlContext"
import CustomCursor from "./components/CustomCursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Vijay's Portfolio",
  description: "Personal portfolio of Vijay Vardhan Satya Srinivasa Rao Itla",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SearchProvider>
            <ImageUrlProvider>
              {children}
              <CustomCursor />
            </ImageUrlProvider>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'