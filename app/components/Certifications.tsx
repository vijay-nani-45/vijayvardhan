"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Update this array with your actual certification image links
const certifications = [
  {
    id: 1,
    name: "Career Essentials in Data Analysis",
    issuer: "Microsoft & LinkedIn",
    year: "2024",
    link: "https://drive.google.com/file/d/1Y37vKy32bnSjeBfJqGtQ1GRAfHIAzYfF/view?usp=drive_link",
    image: "DA.png", // Replace with your actual image URL
  },
  {
    id: 2,
    name: "Python (Basic)",
    issuer: "HackerRank",
    year: "2024",
    link: "https://drive.google.com/file/d/1e7fUAojvCpGCbBsmu2oiz38Eepo4d6v_/view?usp=drive_link",
    image: "python.png", // Replace with your actual image URL
  },
  {
    id: 3,
    name: "AI Primer Certification",
    issuer: "Infosys Springboard",
    year: "2024",
    link: "https://drive.google.com/file/d/188ggCbHI6ln-2SMRJODm0I7kZNF3E7sZ/view?usp=drive_link",
    image: "aip.png", // Replace with your actual image URL
  },
  {
    id: 4,
    name: "Machine Learning with Python",
    issuer: "IBM",
    year: "2024",
    link: "https://drive.google.com/file/d/1V5zgiJIg_R8lxpubc6O35px0frjFa-6U/view?usp=drive_link",
    image: "ml.png", // Replace with your actual image URL
  },
  {
    id: 5,
    name: "Principles of Generative AI",
    issuer: "Infosys Springboard",
    year: "2023",
    link: "https://drive.google.com/file/d/1UfTYN7X7TOWNzSVJMJxRfDxKOBen6pgE/view?usp=drive_link",
    image: "pgenai.png", // Replace with your actual image URL
  },
  {
    id: 6,
    name: "Data Analytics and Visualization Job Simulation",
    issuer: "Accenture",
    year: "2024",
    link: "https://drive.google.com/file/d/1K_u3Ch1JiI_leSjyOQyPb8_tMdCDDQdw/view?usp=drive_link",
    image: "acc.png", // Replace with your actual image URL
  },
  {
    id: 7,
    name: "Artificial Intelligence Job Simulation",
    issuer: "Cognizant",
    year: "2024",
    link: "https://drive.google.com/file/d/1MtDRDpjNqgPaxLj2JbV0GuNtfkXAQwu9/view?usp=drive_link",
    image: "cts.png", // Replace with your actual image URL
  },
  {
    id: 8,
    name: "Social Networks",
    issuer: "NPTEL",
    year: "2024",
    link: "https://drive.google.com/file/d/1905xoECRXFMa9egb9eKjGxvQHdgnTKaT/view?usp=drive_link",
    image: "nptel.png", // Replace with your actual image URL
  },
  {
    id: 9,
    name: "Introduction to SQL",
    issuer: "IBM",
    year: "2024",
    link: "https://drive.google.com/file/d/1xMEoEoNR6SZaCXxKzs6yF6CtJcvWbz63/view?usp=drive_link",
    image: "sql.png", // Replace with your actual image URL
  },
  {
    id: 10,
    name: "Node Js",
    issuer: "Scalar",
    year: "2024",
    link: "https://drive.google.com/file/d/1KtxMDLrkRCj4q5jJBIPaSJqTAEWzjuUZ/view?usp=drive_link",
    image: "node.png", // Replace with your actual image URL
  },
  {
    id: 11,
    name: "Google AI for Anyone",
    issuer: "Google",
    year: "2024",
    link: "https://drive.google.com/file/d/1k-q-l5HNXa1cYbjoJNMAlRjHCa9dGHG_/view?usp=drive_link",
    image: "google.png", // Replace with your actual image URL
  },
  {
    id: 12,
    name: "Power Searching with Google",
    issuer: "Google",
    year: "2024",
    link: "https://drive.google.com/file/d/1_SrJiTSim5UKcre7J0aIVnafTRTtAH8E/view?usp=drive_link",
    image: "google1.png", // Replace with your actual image URL
  },
  {
    id: 13,
    name: "Introduction to Prompt Engineering",
    issuer: "IBM",
    year: "2024",
    link: "https://drive.google.com/file/d/1sQmLQGZSbg0iNxOTAhoLX-bLgTnk5yns/view?usp=drive_link",
    image: "prompt.png", // Replace with your actual image URL
  }, {
    id: 14,
    name: "Cybersecurity Basics",
    issuer: "IBM",
    year: "2024",
    link: "https://drive.google.com/file/d/14U1sC9T9d4k1_h-11GoeSP_rRE6Gpl23/view?usp=drive_link",
    image: "cybersecurity.png", // Replace with your actual image URL
  }, 
  {
    id: 15,
    name: "Network Essentials",
    issuer: "Cisco",
    year: "2022",
    link: "https://drive.google.com/file/d/1UcaeuCnObK1pFZWjr42kbcsVDANdo2be/view?usp=drive_link",
    image: "network.png", // Replace with your actual image URL
  },
  {
    id: 16,
    name: "Switching, Routing, and Wireless Essentials",
    issuer: "Cisco",
    year: "2022",
    link: "https://drive.google.com/file/d/1c7RMFfp0Cw66MFqStvBa6UHijBPJpJee/view?usp=drive_link",
    image: "switch.png", // Replace with your actual image URL
  },{
    id: 18,
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
    year: "2024",
    link: "https://drive.google.com/file/d/1PeEXOz6GZnVQXe1v0WgJ4Yy6BTaykUH1/view?usp=drive_link",
    image: "genai.png", // Replace with your actual image URL
  },
  {
    id: 20,
    name: "Data Science Internship Certicate",
    issuer: "Data Valley",
    year: "2024",
    link: "https://drive.google.com/file/d/1KnDycOT0smhPKFtW79Ndo_p2vAVkTkVP/view?usp=drive_link",
    image: "datavalley.jpg", // Replace with your actual image URL
  },
  {
    id: 21,
    name: "AI Intern Certificate",
    issuer: "Infosys Springboar",
    year: "2025",
    link: "https://drive.google.com/file/d/1Y1fXN0Qswpa7mUquJrV6lVduQDoDlez1/view?usp=drive_link",
    image: "infosys.png", // Replace with your actual image URL
  },{
    id: 22,
    name: "Research Internship Certificate",
    issuer: "NIT Warangal",
    year: "2024",
    link: "https://drive.google.com/file/d/1BPsT3HCNUh0YhJaMqCRDsv6atGEU28Mt/view?usp=drive_link",
    image: "nit.png", // Replace with your actual image URL
  },
  {
    id: 22,
    name: "ChatGPT & GEN AI Internship Certificate",
    issuer: "BlackBucks",
    year: "2025",
    link: "https://drive.google.com/file/d/1hp531xeb40uV2cdNbCTbnHMuaYUwq9Jd/view?usp=drive_link",
    image: "blackbucks.png", // Replace with your actual image URL
  },


]

export default function Certifications() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const carouselRef = useRef(null)

  const nextCertification = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % certifications.length)
  }

  const prevCertification = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + certifications.length) % certifications.length)
  }

  useEffect(() => {
    if (isAutoScrolling && !isHovering) {
      const timer = setInterval(nextCertification, 3000)
      return () => clearInterval(timer)
    }
  }, [isAutoScrolling, isHovering])

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <section id="certifications" className="min-h-screen flex items-center justify-center py-16 overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Certifications
        </motion.h2>

        <div
          className="relative w-full max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={carouselRef}
        >
          <div className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {certifications.map((cert, index) => (
                <div key={cert.id} className="min-w-full p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-2/3 relative h-[340px] rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={imageError[index] ? "/placeholder.svg" : cert.image}
                      alt={cert.name}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(index)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-2xl font-semibold mb-4">{cert.name}</h3>
                    <p className="text-cyan-400 mb-2">{cert.issuer}</p>
                    <p className="text-gray-400 mb-6">{cert.year}</p>
                    <motion.a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg self-start"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Certificate
                    </motion.a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevCertification}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 dark:bg-gray-800/30 p-3 rounded-full shadow-lg hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300"
            aria-label="Previous certification"
          >
            <ChevronLeft className="w-6 h-6 text-cyan-400" />
          </button>

          <button
            onClick={nextCertification}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 dark:bg-gray-800/30 p-3 rounded-full shadow-lg hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300"
            aria-label="Next certification"
          >
            <ChevronRight className="w-6 h-6 text-cyan-400" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {certifications.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index
                    ? "bg-cyan-500"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to certification ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
