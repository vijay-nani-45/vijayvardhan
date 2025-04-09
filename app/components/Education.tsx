"use client"

import { motion } from "framer-motion"

export default function Education() {
  const education = [
    {
      "id": 1,
      "degree": "Bachelor of Technology (Honors)",
      "logo": "jntugvcev.jpg",
      "field": "Information Technology",
      "school": "Jawaharlal Nehru Technological University - Gurajada, Vizianagaram",
      "year": "2022 - 2025",
      "description": "Pursuing a Bachelor of Technology with Honors."
    }
    ,
    {
      "id": 2,
      "degree": "Diploma in Computer Science",
      "logo": "./cr-reddy.png",
      "field": "Computer Engineering",
      "school": "Sir C.R. Reddy Polytechnic, Eluru",
      "year": "2019 - 2022",
      "description": "Specialized in Software Engineering with a strong foundation in programming and system design."
    },
      ]

  return (
    <section id="education" className="min-h-screen flex items-center justify-center py-16">
    <div className="container mx-auto px-6 py-20">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center text-purple-400"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Education
      </motion.h2>
  
      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            className="bg-white bg-opacity-5 dark:bg-gray-800 rounded-lg p-6 hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={edu.logo}
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-xl font-semibold text-purple-400">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-gray-300">{edu.field}</p>
                </div>
              </div>
              <p className="text-sm text-blue-400 mt-4 md:mt-0">{edu.year}</p>
            </div>
  
            <p className="text-base text-gray-400 mb-1">{edu.school}</p>
            <p className="text-sm text-gray-500">{edu.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  
  )
}
