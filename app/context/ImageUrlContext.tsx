"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface ImageUrlContextType {
  imageUrls: Record<string, string>
  updateImageUrl: (section: string, url: string) => void
  updateAllImageUrls: (urls: Record<string, string>) => void
}

const ImageUrlContext = createContext<ImageUrlContextType | undefined>(undefined)

export function useImageUrls() {
  const context = useContext(ImageUrlContext)
  if (context === undefined) {
    throw new Error("useImageUrls must be used within an ImageUrlProvider")
  }
  return context
}

interface ImageUrlProviderProps {
  children: ReactNode
}

export function ImageUrlProvider({ children }: ImageUrlProviderProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  // Load saved image URLs from localStorage on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem("portfolioImageUrls")
    if (savedUrls) {
      try {
        setImageUrls(JSON.parse(savedUrls))
      } catch (error) {
        console.error("Failed to parse saved image URLs:", error)
      }
    }
  }, [])

  // Save image URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("portfolioImageUrls", JSON.stringify(imageUrls))
  }, [imageUrls])

  const updateImageUrl = (section: string, url: string) => {
    setImageUrls((prev) => ({ ...prev, [section]: url }))
  }

  const updateAllImageUrls = (urls: Record<string, string>) => {
    setImageUrls(urls)
  }

  return (
    <ImageUrlContext.Provider value={{ imageUrls, updateImageUrl, updateAllImageUrls }}>
      {children}
    </ImageUrlContext.Provider>
  )
}
