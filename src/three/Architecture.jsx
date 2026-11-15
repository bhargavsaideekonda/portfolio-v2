import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef } from 'react'

const FLOOR = -3.2

// A receding colonnade of portals plus a field of monoliths, all drawn with a
// single instanced mesh.
function buildBoxes() {
  const boxes = []
  const w = 13
  const h = 9.5
  const t = 0.42
  for (let i = 0; i < 9; i++) {
    const z = -5 - i * 4.6
    const cx = -1.2
    boxes.push({ p: [cx - w / 2, FLOOR + h / 2, z], s: [t, h, t * 2.2] })
    boxes.push({ p: [cx + w / 2, FLOOR + h / 2, z], s: [t, h, t * 2.2] })
    boxes.push({ p: [cx, FLOOR + h, z], s: [w + t, t, t * 2.2] })
  }
  const monoliths = [
    [-10.5, -3, 1.4, 7, 0.4],
    [-13, -9, 2.2, 13, 0.5],
    [-9.5, -16, 1.0, 5, 0.4],
    [-16, -21, 3.0, 17, 0.6],
    [-11.5, -29, 1.6, 10, 0.5],
    [9.5, -7, 1.0, 11, 0.4],
    [12.5, -13, 2.4, 6, 0.5],
    [10, -20, 1.4, 15, 0.5],
    [15.5, -26, 2.8, 9, 0.6],
    [11, -34, 1.8, 19, 0.6],
  ]
  for (const [x, z, bw, bh, bd] of monoliths) {
    boxes.push({ p: [x, FLOOR + bh / 2, z], s: [bw, bh, bd] })
  }
  return boxes
}

export default function Architecture() {
  const ref = useRef()
  const boxes = useMemo(buildBoxes, [])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    boxes.forEach((b, i) => {
      m.compose(new THREE.Vector3(...b.p), q, new THREE.Vector3(...b.s))
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [boxes])

  return (
    <group>
      <instancedMesh ref={ref} args={[null, null, boxes.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.7} roughness={0.45} />
      </instancedMesh>

      {/* matte floor + survey grid */}
      <mesh rotation-x={-Math.PI / 2} position-y={FLOOR}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <gridHelper args={[160, 80, '#2c2c2c', '#151515']} position-y={FLOOR + 0.01} />

      {/* halo: a thin luminous arc that back-lights the sculpture */}
      <mesh position={[5, 1.9, -14]}>
        <torusGeometry args={[6.4, 0.035, 8, 220]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[5, 1.9, -14.2]}>
        <torusGeometry args={[8.3, 0.012, 6, 220]} />
        <meshBasicMaterial color="#8a8a8a" />
      </mesh>
    </group>
  )
}
