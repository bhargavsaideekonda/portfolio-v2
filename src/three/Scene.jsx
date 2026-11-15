import * as THREE from 'three'
import { useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { S } from '../lib/store'
import Sculpture from './Sculpture'
import Architecture from './Architecture'

const damp = THREE.MathUtils.damp

// Scroll-controlled camera. Each 3D chapter has its own move:
// hero = dolly in and rise, projects = slow orbit, contact = crane up.
function Rig() {
  const size = useThree((s) => s.size)
  const look = useMemo(() => new THREE.Vector3(0.6, 0.1, 0), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const aim = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const cam = state.camera
    const mx = S.mouse.x
    const my = S.mouse.y
    const tall = size.width < 900
    const lx = tall ? 0.2 : 0.6

    if (S.stage === 'projects') {
      const a = (S.projects - 0.5) * 0.5
      pos.set(Math.sin(a) * 8.6 + mx * 0.3, 0.25 - my * 0.2, Math.cos(a) * 8.6)
      aim.set(lx, tall ? 0.5 : 0, 0)
    } else if (S.stage === 'contact') {
      const c = S.contact
      pos.set(mx * 0.3, -1.9 + c * 1.5 - my * 0.2, 11.5 - c * 2.2)
      aim.set(lx, 0.5 + c * 0.2, 0)
    } else {
      const h = S.hero
      pos.set(mx * 0.35, 0.2 - my * 0.22 + h * 1.1, 9 - h * 3.6)
      aim.set(lx, 0.1 + h * 0.7, 0)
    }

    cam.position.x = damp(cam.position.x, pos.x, 2.4, d)
    cam.position.y = damp(cam.position.y, pos.y, 2.4, d)
    cam.position.z = damp(cam.position.z, pos.z, 2.4, d)
    look.x = damp(look.x, aim.x, 2.4, d)
    look.y = damp(look.y, aim.y, 2.4, d)
    look.z = damp(look.z, aim.z, 2.4, d)
    cam.lookAt(look)
  })
  return null
}

export default function Scene() {
  // Only render while a 3D chapter is on screen.
  const [active, setActive] = useState(true)
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-3d]')]
    const visible = new Set()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
      setActive(visible.size > 0)
    })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? 'always' : 'never'}
        camera={{ fov: 35, position: [0, 0.2, 9], near: 0.1, far: 90 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#060606']} />
        <fog attach="fog" args={['#060606', 11, 44]} />

        <directionalLight position={[4, 9, 6]} intensity={2.6} />
        <directionalLight position={[-8, 3, -6]} intensity={0.7} />
        <pointLight position={[1.2, 1, -9]} intensity={60} distance={30} />

        {/* A studio of white light panels: this is what the chrome reflects. */}
        <Environment resolution={512} frames={1}>
          <color attach="background" args={['#040404']} />
          <Lightformer form="rect" intensity={7} position={[0, 6, 0]} scale={[9, 3, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={3.5} position={[-7, 1.5, 2]} scale={[1.2, 9, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.5} position={[7, 0, 3]} scale={[0.5, 9, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2} position={[6, 2, -5]} scale={[0.4, 8, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2} position={[-5, -1, -6]} scale={[0.4, 8, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={5} position={[0, 1, 8]} scale={3.2} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} position={[0, -6, 0]} scale={[12, 12, 1]} target={[0, 0, 0]} />
        </Environment>

        <Rig />
        <Sculpture />
        <Architecture />
      </Canvas>
    </div>
  )
}
