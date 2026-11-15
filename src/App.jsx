import { lazy, Suspense, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from './lib/scroll'
import { Cursor, Curtain, Nav, Preloader } from './components/ui'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Journey from './sections/Journey'
import Contact from './sections/Contact'

// three.js is the heaviest part of the site, so it loads on its own.
const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  const [ready, setReady] = useState(false)

  // One shared reveal language for every section.
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.set('[data-reveal]', { autoAlpha: 0, y: 34 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07 }),
      })
      gsap.utils.toArray('[data-lines]').forEach((el) => {
        gsap.from(el.querySelectorAll('.mask > span'), {
          yPercent: 112,
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      ctx.revert()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Nav />
      <Curtain />
      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
    </>
  )
}
