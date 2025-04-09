"use client"

import { useState } from "react"
import { useImageUrls } from "../context/ImageUrlContext"
import ImageUrlManager from "./ImageUrlManager"

export default function ImageUrlDashboard() {
  const { updateAllImageUrls, imageUrls } = useImageUrls()
  const [isOpen, setIsOpen] = useState(false)

  const sections = [
    "profileImage",
    "project1Image1",
    "project1Image2",
    "project1Image3",
    "project2Image1",
    "project2Image2",
    "project2Image3",
    "project3Image1",
    "project3Image2",
    "project3Image3",
    "project4Image1",
    "project4Image2",
    "project4Image3",
    "project5Image1",
    "project5Image2",
    "project5Image3",
    "certification1",
    "certification2",
    "certification3",
    "certification4",
    "certification5",
    "certification6",
    "certification7",
    "certification8",
    "certification9",
    "certification10",
    "certification11",
    "certification12",
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-purple-600 transition-colors"
      >
        Manage Images
      </button>
      {isOpen && (
        <ImageUrlManager
          sections={sections}
          initialUrls={imageUrls}
          onSave={(urls) => {
            updateAllImageUrls(urls)
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}
