import Home from "./components/Home"
import About from "./components/About"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Education from "./components/Education"
import Experience from "./components/Experience"
import Contact from "./components/Contact"
import Certifications from "./components/Certifications"
import ParticleBackground from "./components/ParticleBackground"
import LoadingBar from "./components/LoadingBar"
import CustomCursor from "./components/CustomCursor"
import NetworkBackground from "./components/NetworkBackground"
import Header from "./components/Header"
import Chatbot from "./components/Chatbot"
import Footer from "./components/Footer"

export default function Page() {
  return (
    <main className="min-h-screen text-gray-900 dark:text-white relative">
      <LoadingBar />
      <CustomCursor />
      <NetworkBackground />
      <ParticleBackground />
      <div className="relative z-10">
        <Header />
        <Home />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />
      </div>
      <Chatbot />
    </main>
  )
}
