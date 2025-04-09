"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const fullName = "VIJAY VARDHAN SATYA SRINIVASA RAO ITLA"
const positions = ["AI INTERN", "ML RESEARCH INTERN", "AI ENTHUSIAST", "DATA ANALYTICS"]

export default function Home() {
  const [displayedName, setDisplayedName] = useState("")
  const [displayedPosition, setDisplayedPosition] = useState("")
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
  const [isTypingName, setIsTypingName] = useState(true)
  const [isTypingPosition, setIsTypingPosition] = useState(false)
  const [isErasing, setIsErasing] = useState(false)

  // Type the name
  useEffect(() => {
    if (isTypingName) {
      if (displayedName.length < fullName.length) {
        const timer = setTimeout(() => {
          setDisplayedName(fullName.slice(0, displayedName.length + 1))
        }, 50)
        return () => clearTimeout(timer)
      } else {
        setIsTypingName(false)
        setIsTypingPosition(true)
      }
    }
  }, [displayedName, isTypingName])

  // Type and erase positions
  useEffect(() => {
    if (!isTypingPosition) return

    const currentPosition = positions[currentPositionIndex]

    if (!isErasing) {
      // Typing the position
      if (displayedPosition.length < currentPosition.length) {
        const timer = setTimeout(() => {
          setDisplayedPosition(currentPosition.slice(0, displayedPosition.length + 1))
        }, 100)
        return () => clearTimeout(timer)
      } else {
        // Finished typing, wait before erasing
        const timer = setTimeout(() => {
          setIsErasing(true)
        }, 2000)
        return () => clearTimeout(timer)
      }
    } else {
      // Erasing the position
      if (displayedPosition.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedPosition(displayedPosition.slice(0, displayedPosition.length - 1))
        }, 50)
        return () => clearTimeout(timer)
      } else {
        // Finished erasing, move to next position
        setIsErasing(false)
        setCurrentPositionIndex((prev) => (prev + 1) % positions.length)
      }
    }
  }, [displayedPosition, isTypingPosition, isErasing, currentPositionIndex])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          className="text-3xl md:text-4xl mb-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          HELLO I&apos;M
        </motion.h1>
        <motion.h2
          className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayedName}
          {isTypingName && <span className="inline-block w-[3px] h-16 bg-purple-500 ml-1 animate-blink" />}
        </motion.h2>
        <motion.h3
          className="text-xl md:text-2xl text-purple-400 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {displayedPosition}
          <span className="inline-block w-[3px] h-6 bg-purple-500 ml-1 animate-blink" />
        </motion.h3>
      </div>
    </section>
  )
}
