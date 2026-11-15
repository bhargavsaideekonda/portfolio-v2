// Shared, mutable scroll + pointer state. The 3D scene reads it every frame,
// the DOM sections write to it — no React re-renders involved.
export const S = {
  stage: 'hero', // 'hero' | 'projects' | 'contact'
  hero: 0, // 0..1 progress through the hero
  projects: 0, // 0..1 progress through the horizontal gallery
  projectIndex: -1, // float: -1 = gallery intro, 0..4 = project
  contact: 0, // 0..1 progress into the contact finale
  mouse: { x: 0, y: 0 }, // -1..1
  spin: 0, // pointer velocity fed into the sculpture
}

export const bus = new EventTarget()

if (typeof window !== 'undefined') {
  let lastX = null
  window.addEventListener(
    'pointermove',
    (e) => {
      S.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      S.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      if (lastX !== null) S.spin += (e.clientX - lastX) * 0.00035
      lastX = e.clientX
    },
    { passive: true },
  )
}
