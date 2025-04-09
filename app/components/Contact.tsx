"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin, Phone, Github } from "lucide-react"

export default function Contact() {
  const contactMethods = [
    {
      id: 1,
      icon: Mail,
      title: "Email",
      value: "vijaybharathi8804@gmail.com",
      link: "mailto:vijaybharathi8804@gmail.com",
    },
    {
      id: 2,
      icon: Linkedin,
      title: "LinkedIn",
      value: "https://www.linkedin.com/in/vijay-vardhan-itla/",
      link: "https://www.linkedin.com/in/vijay-vardhan-itla/",
    },
    {
      id: 3,
      icon: Github,
      title: "Github",
      value: "https://github.com/vijay-nani-45/",
      link: "https://github.com/vijay-nani-45/",
    
    },
    {
      id: 4,
      icon: Phone,
      title: "WhatsApp",
      value: "*********",
      link: "https://wa.me/9390051556",
    },
  ]

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-8 py-20">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.id}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-5 rounded-lg p-6 text-center hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <method.icon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-200">{method.title}</h3>
              <p className="text-sm text-gray-400">{method.value}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
