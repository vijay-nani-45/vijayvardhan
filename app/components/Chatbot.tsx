"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, X, Mic, Volume2, VolumeX, Sparkles, Zap, Brain, Cpu, AlertTriangle } from "lucide-react"

// Declare SpeechRecognition interface to avoid Typescript errors
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true)
  const [speechRecognitionDisabled, setSpeechRecognitionDisabled] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showVoiceAnimation, setShowVoiceAnimation] = useState(false)
  const [networkStatus, setNetworkStatus] = useState("online")
  const chatContainerRef = useRef(null)
  const abortControllerRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const inputRef = useRef(null)
  const networkErrorCountRef = useRef(0)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus("online")
      console.log("Network is online")
    }

    const handleOffline = () => {
      setNetworkStatus("offline")
      console.log("Network is offline")

      // If we're currently listening, stop
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition on network offline:", e)
        }
      }
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isListening])

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis

      // Simulate initialization process
      const timer = setTimeout(() => {
        setIsInitializing(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    return () => {
      // Stop any ongoing speech when component unmounts
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel()
      }

      // Stop any ongoing speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore errors when stopping
        }
      }
    }
  }, [])

  // Hide welcome animation after 5 seconds
  useEffect(() => {
    if (isOpen && showWelcomeAnimation) {
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showWelcomeAnimation])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Check for speech recognition support when component mounts
  useEffect(() => {
    // Check if speech recognition is supported
    const checkSpeechSupport = () => {
      const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      setIsSpeechSupported(isSupported)

      if (!isSupported) {
        console.warn("Speech recognition is not supported in this browser")
      }
    }

    checkSpeechSupport()
  }, [])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isInitializing && !showWelcomeAnimation && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 500)
    }
  }, [isOpen, isInitializing, showWelcomeAnimation])

  // Reset network error count when component unmounts
  useEffect(() => {
    return () => {
      networkErrorCountRef.current = 0
    }
  }, [])

  // Add a function to check network connectivity
  const checkNetworkConnectivity = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch("/api/ping", {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      console.error("Network connectivity check failed:", error)
      return false
    }
  }

  const startListening = async () => {
    // If speech recognition is disabled due to too many errors, don't try again
    if (speechRecognitionDisabled) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content:
            "Speech recognition has been temporarily disabled due to network issues. Please try typing your message instead.",
        },
      ])
      return
    }

    // Check if we're offline
    if (networkStatus === "offline") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: "You appear to be offline. Speech recognition requires an internet connection.",
        },
      ])
      return
    }

    // Check network connectivity before starting
    const isConnected = await checkNetworkConnectivity()
    if (!isConnected) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: "Network connection appears to be unstable. Speech recognition may not work properly.",
        },
      ])
      networkErrorCountRef.current += 1

      if (networkErrorCountRef.current >= 3) {
        setSpeechRecognitionDisabled(true)
        setTimeout(() => {
          setSpeechRecognitionDisabled(false)
          networkErrorCountRef.current = 0
        }, 60000)
        return
      }
    }

    // Show voice animation
    setShowVoiceAnimation(true)

    try {
      // Clear any previous recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors when stopping previous instance
        }
        recognitionRef.current = null
      }

      if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const errorMessage = "Speech recognition is not supported in your browser."
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "bot",
            content: `🎤 ${errorMessage} Please try typing your message instead.`,
          },
        ])
        setShowVoiceAnimation(false)
        return
      }

      // Initialize speech recognition with more robust error handling
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()

        // Configure recognition
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"
        recognitionRef.current.maxAlternatives = 1

        // Add a timeout to prevent hanging
        const recognitionTimeout = setTimeout(() => {
          if (isListening) {
            try {
              recognitionRef.current.stop()
              console.log("Speech recognition timed out")
            } catch (e) {
              console.error("Error stopping timed out recognition:", e)
            }
          }
          setShowVoiceAnimation(false)
        }, 10000) // 10 second timeout

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          // Reset retry count on successful start
          setRetryCount(0)
        }

        recognitionRef.current.onend = () => {
          clearTimeout(recognitionTimeout)
          setIsListening(false)
          setShowVoiceAnimation(false)

          // Auto-submit if we got input
          if (inputRef.current && inputRef.current.value.trim()) {
            setTimeout(() => {
              const event = new Event("submit", { bubbles: true })
              inputRef.current.form.dispatchEvent(event)
            }, 500)
          }
        }

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          // Reset network error count on successful result
          networkErrorCountRef.current = 0
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error, event)
          setShowVoiceAnimation(false)

          // Handle specific error types
          let errorMessage = ""
          switch (event.error) {
            case "network":
              networkErrorCountRef.current += 1
              console.log(`Network error count: ${networkErrorCountRef.current}`)

              // If we've had too many network errors, disable speech recognition temporarily
              if (networkErrorCountRef.current >= 3) {
                errorMessage =
                  "Multiple network errors detected. Speech recognition has been temporarily disabled. Please check your internet connection and try again later."
                setSpeechRecognitionDisabled(true)

                // Re-enable after 1 minute
                setTimeout(() => {
                  setSpeechRecognitionDisabled(false)
                  networkErrorCountRef.current = 0
                }, 60000)
              } else {
                errorMessage = "Network error occurred. Please check your connection and try again."

                // Implement exponential backoff for retries
                if (retryCount < 3) {
                  const backoffTime = Math.pow(2, retryCount) * 1000
                  setRetryCount((prev) => prev + 1)

                  setTimeout(() => {
                    console.log(`Retrying speech recognition after ${backoffTime}ms`)
                    startListening()
                  }, backoffTime)

                  errorMessage += " Retrying automatically..."
                }
              }
              break
            case "not-allowed":
              errorMessage = "Microphone access was denied. Please allow microphone access to use speech recognition."
              break
            case "aborted":
              errorMessage = "Speech recognition was aborted."
              break
            case "audio-capture":
              errorMessage = "Could not detect any audio from your microphone. Please check your device settings."
              break
            case "no-speech":
              errorMessage = "No speech was detected. Please try speaking again."
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }

          // Display error message to user
          if (errorMessage && event.error !== "no-speech" && event.error !== "aborted") {
            // Add error message to chat for user feedback
            const errorNotification = {
              id: Date.now(),
              type: "bot",
              content: `🎤 ${errorMessage}`,
            }
            setMessages((prev) => [...prev, errorNotification])
          }

          setIsListening(false)
        }

        // Use a try-catch block specifically for the start method
        try {
          recognitionRef.current.start()
        } catch (startError) {
          console.error("Error starting speech recognition:", startError)
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "bot",
              content: "Failed to start speech recognition. Please try typing your message instead.",
            },
          ])
          setIsListening(false)
          setShowVoiceAnimation(false)
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "bot",
            content: `🎤 There was an error initializing speech recognition. Please try typing your message instead.`,
          },
        ])
        setIsListening(false)
        setShowVoiceAnimation(false)
      }
    } catch (error) {
      console.error("Error in startListening function:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: `🎤 There was an error with speech recognition. Please try typing your message instead.`,
        },
      ])
      setIsListening(false)
      setShowVoiceAnimation(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
      setIsListening(false)
      setShowVoiceAnimation(false)
    }
  }

  const speakText = (text, messageId) => {
    if (!synthRef.current) return

    // Stop any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }

    // If we're already speaking this message, just stop
    if (messageId === speakingMessageId) {
      setSpeakingMessageId(null)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to get a good voice
    const voices = synthRef.current.getVoices()
    const preferredVoice =
      voices.find((voice) => voice.name.includes("Google") && voice.lang.includes("en-US")) ||
      voices.find((voice) => voice.lang.includes("en-US"))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      setSpeakingMessageId(messageId)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error", event)
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }

    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // If we were listening but got no input, inform the user
    if (isListening && !input.trim()) {
      stopListening()
      return
    }

    if (!input.trim() || isLoading) return

    const userMessage = { id: Date.now(), type: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError)
        throw new Error("Failed to parse response")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.availableModels) {
        console.log("Available models:", data.availableModels)
      }

      const botResponse = data.response || "I'm sorry, I couldn't process that request."
      const botMessage = { id: Date.now(), type: "bot", content: botResponse }
      setMessages((prev) => [...prev, botMessage])

      // Don't automatically speak the response
      // Only speak when the user clicks the speaker button
    } catch (error) {
      console.error("Chat Error:", error)
      let errorMessage = "Sorry, I encountered an error. Please try again."

      if (error.name === "AbortError") {
        console.log("Request was aborted")
        errorMessage = "The request was cancelled. Please try again."
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      }

      // Log additional details about the error
      console.log("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      const botMessage = { id: Date.now(), type: "bot", content: errorMessage }
      setMessages((prev) => [...prev, botMessage])

      // Don't automatically speak the error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChat = () => {
    setIsOpen(true)
    setShowWelcomeAnimation(true)
    // Reset messages if chat was closed
    if (!isOpen) {
      setMessages([])
    }
  }

  // Particle animation component
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-500"
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 600,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 400,
              y: Math.random() * 600,
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        ))}
      </div>
    )
  }

  // Neural network animation
  const NeuralNetwork = () => {
    const nodes = [
      { x: 200, y: 100 },
      { x: 100, y: 200 },
      { x: 300, y: 200 },
      { x: 150, y: 300 },
      { x: 250, y: 300 },
      { x: 200, y: 400 },
    ]

    const connections = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
    ]

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="400" height="500" className="opacity-30">
          {connections.map((conn, i) => (
            <motion.line
              key={`line-${i}`}
              x1={nodes[conn.from].x}
              y1={nodes[conn.from].y}
              x2={nodes[conn.to].x}
              y2={nodes[conn.to].y}
              stroke="#06b6d4"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 0.6,
                strokeWidth: [2, 3, 2],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 5,
              }}
            />
          ))}
          {nodes.map((node, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r="10"
              fill="#06b6d4"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                fill: ["#06b6d4", "#a855f7", "#06b6d4"],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </svg>
      </div>
    )
  }

  // Welcome animation
  const WelcomeAnimation = () => {
    return (
      <motion.div
        className="absolute inset-0 bg-[#0A192F] flex flex-col items-center justify-center z-10 chatbot-interface"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative w-32 h-32 mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyan-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
              borderColor: ["#06b6d4", "#a855f7", "#06b6d4"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Brain size={64} className="text-purple-500" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-cyan-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Maximus AI
        </motion.h2>

        <motion.div
          className="flex items-center space-x-2 text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              color: ["#c4b5fd", "#ffffff", "#c4b5fd"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Initializing
          </motion.span>
          <motion.div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: i * 0.3,
                }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[<Cpu key="cpu" />, <Zap key="zap" />, <Sparkles key="sparkles" />].map((icon, i) => (
            <motion.div
              key={i}
              className="text-cyan-500"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 10, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  // Jarvis-like animation components
  const CircleWave = ({ delay = 0, size = 100 }) => (
    <motion.div
      className="absolute rounded-full border-2 border-cyan-500"
      style={{
        width: size,
        height: size,
        opacity: 0.2,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0],
        scale: [0, 1, 1.5],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )

  // Network status indicator
  const NetworkStatusIndicator = () => {
    if (networkStatus === "online" && !speechRecognitionDisabled && networkErrorCountRef.current === 0) return null

    return (
      <motion.div
        className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs chatbot-hoverable"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <AlertTriangle size={12} />
        <span>{networkStatus === "offline" ? "You are offline" : "Network issues detected"}</span>
      </motion.div>
    )
  }

  // Voice animation overlay
  const VoiceAnimationOverlay = () => {
    return (
      <AnimatePresence>
        {showVoiceAnimation && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center chatbot-interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              stopListening()
              setShowVoiceAnimation(false)
            }}
          >
            <motion.div
              className="relative bg-[#0A192F] rounded-full w-64 h-64 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ripple effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className="absolute inset-0 rounded-full border-2 border-cyan-500"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{
                    scale: [1, 1.5 + i * 0.2],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Central orb */}
              <motion.div
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px 0 rgba(6, 182, 212, 0.5)",
                    "0 0 40px 10px rgba(6, 182, 212, 0.7)",
                    "0 0 20px 0 rgba(6, 182, 212, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Audio wave visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="voice-wave">
                    {[...Array(5)].map((_, i) => (
                      <div key={`wave-${i}`} className="voice-wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>

                {/* Microphone icon */}
                <motion.div
                  className="absolute"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Mic size={40} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Status text */}
              <motion.div
                className="absolute bottom-10 text-white font-medium text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  Listening...
                </motion.p>
                <p className="text-xs text-cyan-300 mt-2">Tap to cancel</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg z-50 transition-all duration-500 flex items-center gap-2 chatbot-hoverable"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(79, 70, 229, 0.6)",
          background: "linear-gradient(to right, #6366f1, #a855f7)",
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -10, 0],
          boxShadow: [
            "0 4px 6px rgba(0, 0, 0, 0.1)",
            "0 10px 15px rgba(6, 182, 212, 0.3)",
            "0 4px 6px rgba(0, 0, 0, 0.1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onClick={handleOpenChat}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Bot size={20} className="text-white" />
          <motion.div
            className="absolute -inset-1 rounded-full"
            animate={{
              boxShadow: isButtonHovered ? "0 0 10px 2px rgba(255, 255, 255, 0.7)" : "none",
              scale: isButtonHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 1.5, repeat: isButtonHovered ? Number.POSITIVE_INFINITY : 0 }}
          />
        </motion.div>
        <span className="font-medium">Chat with Maximus</span>
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              "0 0 0 0 rgba(6, 182, 212, 0.4)",
              "0 0 0 4px rgba(6, 182, 212, 0)",
              "0 0 0 0 rgba(6, 182, 212, 0.4)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 w-[400px] h-[600px] bg-[#0A192F] rounded-lg shadow-xl overflow-hidden z-50 border border-[#1B2435] chatbot-hoverable chatbot-interface md:w-[450px] sm:w-[350px] sm:h-[500px] xs:w-[300px] xs:h-[450px]"
          >
            <div className="bg-[#1B2435] text-white p-4 flex justify-between items-center border-b border-[#2A3444]">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Bot size={24} className="text-purple-400" />
                </motion.div>
                <h3 className="font-bold text-lg">Chat With Maximus</h3>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors chatbot-hoverable"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative h-[calc(100%-8rem)]">
              {isInitializing ? (
                <div className="h-full flex items-center justify-center bg-[#0A192F] relative">
                  <div className="relative flex items-center justify-center">
                    {/* Concentric animated circles */}
                    <CircleWave size={50} delay={0} />
                    <CircleWave size={100} delay={0.5} />
                    <CircleWave size={150} delay={1} />

                    {/* Central pulsing dot */}
                    <motion.div
                      className="w-8 h-8 bg-cyan-500 rounded-full z-10"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(6, 182, 212, 0.7)",
                          "0 0 0 10px rgba(6, 182, 212, 0)",
                          "0 0 0 0 rgba(6, 182, 212, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Audio wave visualization */}
                    <div className="absolute bottom-[-50px] flex items-end justify-center space-x-1 w-40">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-cyan-500"
                          animate={{
                            height: [5, 15 + Math.random() * 20, 5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-0 right-0 text-center">
                    <motion.p
                      className="text-cyan-400 font-medium mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Loading AI Assistant
                    </motion.p>
                    <motion.div
                      className="flex justify-center items-center gap-1 text-cyan-300 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.2 }}
                      >
                        Initializing
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.2, delay: 0.2 }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.2, delay: 0.4 }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.2, delay: 0.6 }}
                      >
                        .
                      </motion.span>
                    </motion.div>
                    <motion.div className="mt-2 h-1 bg-gray-700 rounded-full w-48 mx-auto overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                </div>
              ) : (
                <>
                  <AnimatePresence>{showWelcomeAnimation && <WelcomeAnimation />}</AnimatePresence>

                  {/* Background animations */}
                  <Particles />
                  <NeuralNetwork />

                  {/* Network status indicator */}
                  <NetworkStatusIndicator />

                  <div
                    ref={chatContainerRef}
                    className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#2A3444] scrollbar-track-transparent"
                  >
                    {messages.length === 0 && (
                      <motion.div
                        className="text-gray-400 text-center mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="mb-2">
                          Hi, I'm Maximus! I can tell you about Vijay's projects, skills, work experience, and
                          education.
                        </p>
                        <p>What would you like to know?</p>
                      </motion.div>
                    )}
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * (index % 3) }}
                      >
                        {msg.type === "bot" && (
                          <motion.div
                            className="w-8 h-8 rounded-full bg-[#1B2435] flex items-center justify-center mr-2"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Bot size={16} className="text-purple-400" />
                          </motion.div>
                        )}
                        <motion.div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === "user" ? "bg-purple-500 text-white" : "bg-[#1B2435] text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {msg.content}
                          {msg.type === "bot" && (
                            <motion.button
                              onClick={() =>
                                speakingMessageId === msg.id ? stopSpeaking() : speakText(msg.content, msg.id)
                              }
                              className="ml-2 text-gray-400 hover:text-white transition-colors chatbot-hoverable"
                              aria-label={speakingMessageId === msg.id ? "Stop speaking" : "Speak message"}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {speakingMessageId === msg.id ? (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                                >
                                  <VolumeX size={14} />
                                </motion.div>
                              ) : (
                                <Volume2 size={14} />
                              )}
                            </motion.button>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        className="flex justify-start mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#1B2435] flex items-center justify-center mr-2">
                          <Bot size={16} className="text-purple-400" />
                        </div>
                        <div className="bg-[#1B2435] text-white p-3 rounded-lg max-w-[80%] flex items-center">
                          <motion.span
                            className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-1"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          />
                          <motion.span
                            className="inline-block w-2 h-2 bg-purple-400 rounded-full mx-1"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          />
                          <motion.span
                            className="inline-block w-2 h-2 bg-purple-400 rounded-full ml-1"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#2A3444]">
              <div className="flex gap-2">
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading || isListening}
                  className="flex-grow p-2 rounded-lg bg-[#1B2435] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-[#2A3444] disabled:opacity-50 chatbot-hoverable"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)" }}
                />
                {isSpeechSupported && !speechRecognitionDisabled && (
                  <motion.button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading || networkStatus === "offline"}
                    className={`p-2 rounded-lg transition-colors chatbot-hoverable ${
                      isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                    } ${networkStatus === "offline" ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isListening ? "Stop listening" : "Start listening"}
                    title={isListening ? "Stop listening" : "Start voice input"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={
                        isListening
                          ? {
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Mic size={20} />
                    </motion.div>
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 chatbot-hoverable"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send size={20} />
                </motion.button>
              </div>

              {/* Speech recognition status message */}
              {(speechRecognitionDisabled || networkStatus === "offline") && (
                <motion.div
                  className="mt-2 text-xs text-red-300 text-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {networkStatus === "offline"
                    ? "You are offline. Speech recognition requires an internet connection."
                    : "Speech recognition temporarily disabled due to network issues."}
                  {speechRecognitionDisabled && (
                    <motion.button
                      onClick={() => {
                        setSpeechRecognitionDisabled(false)
                        networkErrorCountRef.current = 0
                      }}
                      className="ml-1 underline text-cyan-400 hover:text-cyan-300 chatbot-hoverable"
                      whileHover={{ scale: 1.05 }}
                    >
                      Try again
                    </motion.button>
                  )}
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice animation overlay */}
      <VoiceAnimationOverlay />
    </>
  )
}
