import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bus } from './store'

gsap.registerPlugin(ScrollTrigger)

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initScroll() {
  if (reduced || lenis) return
  lenis = new Lenis({ lerp: 0.095 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  if (document.documentElement.classList.contains('locked')) lenis.stop()
}

export function lockScroll(on) {
  document.documentElement.classList.toggle('locked', on)
  if (lenis) on ? lenis.stop() : lenis.start()
}

// Instant jump, used underneath the curtain transition.
export function jumpTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY)
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
  ScrollTrigger.update()
}

// Curtain-wipe navigation between sections.
export function goTo(id, label, index) {
  bus.dispatchEvent(new CustomEvent('goto', { detail: { id, label, index } }))
}
