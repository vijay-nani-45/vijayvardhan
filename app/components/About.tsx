"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { FileDown } from "lucide-react"
import { useState } from "react"

export default function About() {
  // Add state to handle image loading errors
  const [imageError, setImageError] = useState(false)

  // Replace this with your actual profile image URL
  const profileImageUrl =
    "./vijay.png" // Replace with your actual image URL

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden shadow-lg">
              <Image
                src={profileImageUrl}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
          <div className="md:w-2/3 md:pl-12">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <p className="text-xl mb-6">
              I'm a dedicated and curious software engineer with a strong foundation in programming, AI, and data science.
            </p>
            <p className="text-xl mb-8">
            I have experience working across various domains, including AI, machine learning, and web development.
            Well-versed in Python, Java, SQL, and modern development tools and frameworks.
            Driven by a passion for learning, creating, and contributing to impactful, real-world solutions.I thrive in collaborative environments and am always eager to learn from others.
            </p>
            <motion.a
  href="https://drive.google.com/uc?export=download&id=1r-6awebA_mHkYyjMeJkftGdtkBfHPTw2"
  className="relative inline-flex items-center px-6 py-3 overflow-hidden rounded-lg group"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  target="_blank" // optional, for user clarity
  rel="noopener noreferrer"
>

              <span className="absolute w-full h-full bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative flex items-center text-white">
                <FileDown className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download Resume
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
