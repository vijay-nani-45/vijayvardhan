'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  GraduationCap,
  Briefcase,
  Code,
  FolderKanban,
  Award,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import About from './About'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = document.querySelectorAll('section[id]')
      const scrollY = window.scrollY

      sections.forEach((section) => {
        const sectionId = section.getAttribute('id')
        if (!sectionId) return

        const sectionHeight = section.offsetHeight
        const sectionTop = (section as HTMLElement).offsetTop - 100

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    {id:'about',label:'About',icon: User},
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'dark:bg-gray-900/90 bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900 dark:text-white">Vijay Vardhan</div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-900 dark:text-white">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.id}
                smooth={true}
                duration={500}
                offset={-80}
                className="relative px-4 py-2 cursor-pointer flex items-center space-x-2"
              >
                <motion.div
                  className={`absolute inset-0 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'dark:bg-cyan-500/20 bg-purple-500/20'
                      : 'bg-transparent'
                  }`}
                  layoutId="activeSection"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
                <item.icon className="w-5 h-5 dark:text-white text-gray-900" />
                <span className="relative z-10 dark:text-white text-gray-900 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
          {mounted && (
            <li>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative px-4 py-2 flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white hover:text-cyan-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900 hover:text-cyan-500" />
                )}
                <span
                  className={`relative z-10 ${
                    theme === 'dark'
                      ? 'text-white hover:text-cyan-400'
                      : 'text-gray-900 hover:text-cyan-500'
                  }`}
                >
                  Theme
                </span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4"
          >
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.id}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <item.icon className="w-5 h-5 text-gray-900 dark:text-white" />
                    <span className="text-gray-900 dark:text-white">{item.label}</span>
                  </Link>
                </li>
              ))}
              {mounted && (
                <li>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-white" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-900" />
                    )}
                    <span className="text-gray-900 dark:text-white">Theme</span>
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
