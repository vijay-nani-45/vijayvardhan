"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorVariant, setCursorVariant] = useState("default")
  const cursorRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Show cursor immediately
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      // Set mouse position immediately with no delay or smoothing
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Reset the timeout on each mouse move
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Hide cursor after 3 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      // Show cursor when it moves
      if (!isVisible) {
        setIsVisible(true)
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if the element is part of the chatbot interface
      if (
        target.closest(".chatbot-interface") ||
        target.classList.contains("chatbot-hoverable") ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "input"
      ) {
        setIsHovering(true)
        setCursorVariant("hover")
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorVariant("default")
    }

    // Add global event listeners with passive flag for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Setup mutation observer to handle dynamically added elements
    const observer = new MutationObserver(() => {
      // When DOM changes, find all interactive elements and add event listeners
      setupEventListeners()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    })

    // Initial setup of event listeners
    setupEventListeners()

    function setupEventListeners() {
      // Remove existing listeners to prevent duplicates
      document.querySelectorAll('a, button, input, .chatbot-hoverable, [role="button"]').forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      // Add fresh listeners
      document.querySelectorAll('a, button, input, .chatbot-hoverable, [role="button"]').forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter)
        el.addEventListener("mouseleave", handleMouseLeave)
      })

      // Special handling for chatbot interface
      document.querySelectorAll(".chatbot-interface, .chatbot-interface *").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
        el.addEventListener("mouseenter", handleMouseEnter)
        el.addEventListener("mouseleave", handleMouseLeave)
      })
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      document.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()

      // Clean up all event listeners
      document
        .querySelectorAll(
          'a, button, input, .chatbot-hoverable, [role="button"], .chatbot-interface, .chatbot-interface *',
        )
        .forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter)
          el.removeEventListener("mouseleave", handleMouseLeave)
        })
    }
  }, [isVisible])

  // Define cursor variants for different states with immediate transitions
  const variants = {
    default: {
      opacity: isVisible ? 1 : 0,
      scale: 1,
      transition: {
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    hover: {
      opacity: isVisible ? 1 : 0,
      scale: 1.5,
      transition: {
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] will-change-transform"
      variants={variants}
      animate={cursorVariant}
      style={{
        left: `${mousePosition.x - 16}px`,
        top: `${mousePosition.y - 16}px`,
        transform: "translate(0, 0)", // Force hardware acceleration
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          rotate: isHovering ? 45 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <motion.circle
          cx="16"
          cy="16"
          r="8"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
            stroke: isHovering ? "#06b6d4" : "white",
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.circle
          cx="16"
          cy="16"
          r="3"
          fill={isHovering ? "#06b6d4" : "white"}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.svg>
    </motion.div>
  )
}
