"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface ImageCarouselProps {
  images: {
    src: string
    alt: string
  }[]
  autoScrollInterval?: number
  height?: number
}

export default function ImageCarousel({ images, autoScrollInterval = 3000, height = 300 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      nextImage()
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [autoScrollInterval, isHovering])

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={carouselRef}
        className="overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="relative" style={{ height: `${height}px` }}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full h-full flex-shrink-0 px-2">
                <div className="relative w-full h-full overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentIndex === index
                ? "bg-purple-500"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
