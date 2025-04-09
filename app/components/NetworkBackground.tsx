"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Create neurons
    const neuronCount = 200
    const neurons = new THREE.Group()
    const neuronGeometry = new THREE.SphereGeometry(0.05, 8, 8)
    const neuronMaterial = new THREE.MeshBasicMaterial({
      color: theme === "dark" ? 0x00ffff : 0x6366f1,
    })

    for (let i = 0; i < neuronCount; i++) {
      const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 4 + Math.random() * 2
      neuron.position.x = radius * Math.sin(phi) * Math.cos(theta)
      neuron.position.y = radius * Math.sin(phi) * Math.sin(theta)
      neuron.position.z = radius * Math.cos(phi)
      neurons.add(neuron)
    }
    scene.add(neurons)

    // Create synapses
    const synapsesMaterial = new THREE.LineBasicMaterial({
      color: theme === "dark" ? 0x00ffff : 0x6366f1,
      transparent: true,
      opacity: 0.2,
    })

    for (let i = 0; i < neurons.children.length; i++) {
      for (let j = i + 1; j < neurons.children.length; j++) {
        if (Math.random() > 0.95) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            neurons.children[i].position,
            neurons.children[j].position,
          ])
          const line = new THREE.Line(geometry, synapsesMaterial)
          scene.add(line)
        }
      }
    }

    camera.position.z = 10

    const animate = () => {
      requestAnimationFrame(animate)
      neurons.rotation.y += 0.001
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [theme])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      <div className="fixed top-0 left-0 w-full h-full transition-colors duration-300 -z-10">
        <div className="w-full h-full bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-black from-white via-purple-100 to-gray-100" />
      </div>
    </>
  )
}
