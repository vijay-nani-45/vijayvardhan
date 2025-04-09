"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const skills = [
  {
    category: "Languages",
    items: [
      { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },   
    ],
  },
  {
    category: "Version Control & Database",
    items: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
     {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
    ],
  },
  {
    category: "Web Technologies",
    items: [
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
{ name: "Node Js", icon: "./image.png"},
    ],
  },
  {
    category: "Relevant Coursework",
    items: [
      {
        name: "DSA",
        icon: "./dsa.webp",
       },
            
      {
        name: "DBMS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      
      {
        name: "Operating Systems",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      },
      {
        name: "Object Oriented Programming",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
    ],
  },
  {
    category: "Soft Skills",
    items: [
      {
        name: "Problem Solving",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
      },
      { name: "Self-learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
      { name: "Presentation", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
      { name: "Adaptability", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
    ],
  },
  {
    category: "Data Science & Machine Learning",
    items: [
      { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      {
        name: "Matplotlib",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
      },
      
      { name: "MATLAB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
      {
        name: "TensorFlow",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
      },
      { name: "Keras", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg" },
      // { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
      { name: "Scikit-learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
      { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
    ],
  },
  {
    category: "IDEs",
    items: [
      {
        name: "Visual Studio Code",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      },
      {
        name: "IntelliJ IDEA",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
      },
      { name: "Eclipse", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg" },
      { name: "PyCharm", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg" },
    ],
  },
  {
    category: "Productivity Tools",
    items: [
      {
        name: "Microsoft Office",
        icon: "https://imgs.search.brave.com/yXErr8Fi6_WWWXH8wLQw8RJ8buHy8LLjvBLWrpAOXIo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaWNvbi1pY29u/cy5jb20vMTE1Ni9Q/TkcvOTYvMTQ4NjU2/NTU3My1taWNyb3Nv/ZnQtb2ZmaWNlXzgx/NTU3LnBuZw",
      },
      { name: "LaTeX", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg" },
      {
        name: "Google Workspace",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      },
      {
        name: "postman",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
      }
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-purple-400"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skillCategory, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1 shadow-lg h-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">{skillCategory.category}</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {skillCategory.items.map((skill, skillIndex) => (
                  <li key={skillIndex} className="flex items-center space-x-1">
                    <Image src={skill.icon} alt={skill.name} width={16} height={16} />
                    <span className="text-gray-300 text-xs">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
