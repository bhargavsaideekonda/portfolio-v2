import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { S } from '../lib/store'
import { poses, projects } from '../data'
import { HEAD, NORMAL, POSITION } from './shader'

const damp = THREE.MathUtils.damp
const lerp = THREE.MathUtils.lerp
const galleryPoses = [poses.intro, ...projects.map((p) => p.pose)]
const KEYS = ['freq', 'amp', 'twist', 'squash', 'spread']

// Where the sculpture sits for each 3D chapter: [x, y, z, scale]
const PLACES = {
  hero: { wide: [1.95, 0.95, 0, 0.7], tall: [0.35, 1.25, 0, 0.46] },
  projects: { wide: [2.45, 0.2, 0, 0.74], tall: [0.5, 1.35, 0, 0.42] },
  contact: { wide: [3.5, 1.75, -0.5, 0.62], tall: [0.45, 2.15, 0, 0.36] },
}

// Base tilt of each mechanical ring (x, z). `spread` scales them, so the
// gyroscope opens and folds flat as the pose changes.
const TILTS = [
  [1.15, 0.35],
  [-0.55, -0.7],
  [0.3, 1.2],
  [-1.0, 0.15],
]

function Ticks({ radius, count, material }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const axis = new THREE.Vector3(0, 0, 1)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const long = i % 6 === 0
      const len = long ? 0.2 : 0.09
      p.set(Math.cos(a) * (radius - len / 2), Math.sin(a) * (radius - len / 2), 0)
      q.setFromAxisAngle(axis, a)
      s.set(len, long ? 0.014 : 0.008, 0.012)
      m.compose(p, q, s)
      ref.current.setMatrixAt(i, m)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [radius, count])
  return (
    <instancedMesh ref={ref} args={[null, null, count]} material={material}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  )
}

export default function Sculpture() {
  const group = useRef()
  const tilt = useRef([])
  const spinners = useRef([])
  const size = useThree((s) => s.size)
  const pose = useRef({ ...poses.hero })
  const target = useRef({ ...poses.hero })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFreq: { value: poses.hero.freq },
      uAmp: { value: poses.hero.amp },
      uTwist: { value: poses.hero.twist },
      uSquash: { value: poses.hero.squash },
    }),
    [],
  )

  const coreMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 1,
      roughness: 0.07,
      envMapIntensity: 1.3,
    })
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, uniforms)
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', `#include <common>\n${HEAD}`)
        .replace('#include <beginnormal_vertex>', NORMAL)
        .replace('#include <begin_vertex>', POSITION)
    }
    return m
  }, [uniforms])

  const chrome = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0f0f0',
        metalness: 1,
        roughness: 0.14,
        envMapIntensity: 1.2,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8d8d8d', metalness: 1, roughness: 0.32 }),
    [],
  )

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const t = state.clock.elapsedTime
    const tall = size.width < 900
    const g = group.current

    // --- pose: which shape the liquid core is flowing toward
    const tp = target.current
    if (S.stage === 'projects') {
      const f = THREE.MathUtils.clamp(S.projectIndex + 1, 0, galleryPoses.length - 1)
      const i = Math.min(Math.floor(f), galleryPoses.length - 2)
      const k = THREE.MathUtils.smoothstep(f - i, 0.15, 0.85)
      for (const key of KEYS) tp[key] = lerp(galleryPoses[i][key], galleryPoses[i + 1][key], k)
    } else {
      Object.assign(tp, poses[S.stage] || poses.hero)
    }
    const p = pose.current
    for (const key of KEYS) p[key] = damp(p[key], tp[key], 3.2, d)
    uniforms.uTime.value = t
    uniforms.uFreq.value = p.freq
    uniforms.uAmp.value = p.amp
    uniforms.uTwist.value = p.twist
    uniforms.uSquash.value = p.squash

    // --- placement
    const [x, y, z, s] = (PLACES[S.stage] || PLACES.hero)[tall ? 'tall' : 'wide']
    g.position.x = damp(g.position.x, x, 2.6, d)
    g.position.y = damp(g.position.y, y + Math.sin(t * 0.6) * 0.06, 2.6, d)
    g.position.z = damp(g.position.z, z, 2.6, d)
    const sc = damp(g.scale.x, s, 2.6, d)
    g.scale.setScalar(sc)

    // --- rotation: slow drift + pointer tilt + pointer-velocity spin + scroll
    S.spin *= Math.pow(0.02, d)
    S.spin = THREE.MathUtils.clamp(S.spin, -0.6, 0.6)
    g.userData.yaw = (g.userData.yaw || 0) + d * 0.12 + S.spin * d * 9
    const scrollTurn = S.stage === 'projects' ? S.projects * Math.PI * 1.5 : S.hero * 1.4
    g.rotation.y = damp(g.rotation.y, g.userData.yaw + S.mouse.x * 0.45 + scrollTurn, 4, d)
    g.rotation.x = damp(g.rotation.x, S.mouse.y * 0.32, 4, d)

    // --- mechanical rings
    tilt.current.forEach((r, i) => {
      if (!r) return
      r.rotation.x = TILTS[i][0] * p.spread + Math.sin(t * 0.25 + i) * 0.05
      r.rotation.z = TILTS[i][1] * p.spread
    })
    spinners.current.forEach((r, i) => {
      if (r) r.rotation.z = t * (i % 2 ? -1 : 1) * (0.1 + i * 0.045)
    })
  })

  const setTilt = (i) => (el) => (tilt.current[i] = el)
  const setSpin = (i) => (el) => (spinners.current[i] = el)

  return (
    <group ref={group} position={[1.95, 0.95, 0]} scale={0.7}>
      {/* liquid-metal core */}
      <mesh material={coreMat}>
        <icosahedronGeometry args={[1, 48]} />
      </mesh>

      {/* ring 1 — flat machined band with a rider */}
      <group ref={setTilt(0)}>
        <group ref={setSpin(0)}>
          <mesh material={chrome} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[1.58, 1.58, 0.11, 160, 1, true]} />
          </mesh>
          <mesh material={chrome} position={[1.58, 0, 0]}>
            <boxGeometry args={[0.1, 0.22, 0.2]} />
          </mesh>
        </group>
      </group>

      {/* ring 2 — fine wire with a satellite */}
      <group ref={setTilt(1)}>
        <group ref={setSpin(1)}>
          <mesh material={chrome}>
            <torusGeometry args={[1.92, 0.016, 10, 220]} />
          </mesh>
          <mesh material={chrome} position={[1.92, 0, 0]}>
            <sphereGeometry args={[0.075, 32, 32]} />
          </mesh>
        </group>
      </group>

      {/* ring 3 — three square-section arcs */}
      <group ref={setTilt(2)}>
        <group ref={setSpin(2)}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} material={chrome} rotation-z={(i * Math.PI * 2) / 3}>
              <torusGeometry args={[2.24, 0.05, 4, 72, 1.55]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ring 4 — instrument dial */}
      <group ref={setTilt(3)}>
        <group ref={setSpin(3)}>
          <Ticks radius={2.56} count={96} material={steel} />
          <mesh material={steel}>
            <torusGeometry args={[2.6, 0.007, 6, 240]} />
          </mesh>
          <mesh material={chrome} position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.05, 24, 24]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
