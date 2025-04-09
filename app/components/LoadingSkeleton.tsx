"use client"

import { motion } from "framer-motion"

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        className="w-32 h-32 relative"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full border-t-4 border-blue-500 rounded-full"
            initial={{ rotate: index * 45 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
