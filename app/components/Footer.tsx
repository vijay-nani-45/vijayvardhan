"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-6 mb-4"
          >
            <a
              href="https://github.com/vijay-nani-45"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-500 transition-colors duration-300"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/vijay-vardhan-itla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-500 transition-colors duration-300"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:vijaybharathi8804@gmail.com"
              className="text-gray-400 hover:text-cyan-500 transition-colors duration-300"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-400">
              © {new Date().getFullYear()} Vijay Vardhan Satya Srinivasa Rao Itla. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
