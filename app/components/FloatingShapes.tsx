"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Box, Torus } from "@react-three/drei"
import type * as THREE from "three"

export default function FloatingShapes() {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    group.current.rotation.x = Math.sin(time / 4) / 2
    group.current.rotation.y = Math.sin(time / 2) / 2
    group.current.rotation.z = Math.sin(time / 3) / 2
    group.current.position.y = Math.sin(time / 1.5) / 2
  })

  return (
    <group ref={group}>
      <Sphere args={[1, 16, 16]} position={[-4, 0, 0]}>
        <meshStandardMaterial color="#ff6b6b" wireframe />
      </Sphere>
      <Box args={[1.5, 1.5, 1.5]} position={[4, 0, 0]}>
        <meshStandardMaterial color="#4ecdc4" wireframe />
      </Box>
      <Torus args={[1, 0.4, 16, 32]} position={[0, 0, 4]}>
        <meshStandardMaterial color="#f9d56e" wireframe />
      </Torus>
    </group>
  )
}
