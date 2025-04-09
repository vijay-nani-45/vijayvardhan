"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

const particleCount = 5000
const maxRadius = 20

function generateParticles() {
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    const radius = Math.random() * maxRadius

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const color = new THREE.Color()
    color.setHSL(Math.random(), 0.7, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 0.5 + 0.5
  }

  return { positions, colors, sizes }
}

export default function Background() {
  const ref = useRef<THREE.Points>(null!)
  const { positions, colors, sizes } = useMemo(() => generateParticles(), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      ref.current.geometry.attributes.position.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.01
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y = time * 0.05
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
