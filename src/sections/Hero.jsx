import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { S } from '../lib/store'
import { goTo, reduced } from '../lib/scroll'
import { Magnetic } from '../components/ui'
import { profile } from '../data'

export default function Hero({ ready }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (s) => (S.hero = s.progress),
        onToggle: (s) => s.isActive && (S.stage = 'hero'),
      })
      if (reduced) return
      gsap.set('.hero-char', { yPercent: 118 })
      gsap.set('.hero-fade', { autoAlpha: 0, y: 22 })
      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-name', { yPercent: -22, ease: 'none', scrollTrigger: scrub })
      gsap.to('.hero-side', { yPercent: -70, autoAlpha: 0, ease: 'none', scrollTrigger: { ...scrub, end: '55% top' } })
    }, root)
    return () => ctx.revert()
  }, [])

  // Entrance plays as the preloader curtain lifts.
  useEffect(() => {
    if (!ready || reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.25 })
        .to('.hero-char', { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.045 })
        .to('.hero-fade', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09 }, '-=1')
    }, root)
    return () => ctx.kill()
  }, [ready])

  const go = (id, label, i) => (e) => {
    e.preventDefault()
    goTo(id, label, i)
  }

  return (
    <section className="hero" id="top" ref={root} data-3d>
      <div className="hero-top hero-side">
        <p className="mono hero-fade">{profile.course}</p>
        <p className="mono hero-fade">{profile.years}</p>
      </div>

      <div className="hero-mid hero-side">
        <p className="hero-tag hero-fade">{profile.tagline}</p>
        <div className="hero-cta hero-fade">
          <Magnetic>
            <a className="btn btn-solid" href="#projects" onClick={go('projects', 'Projects', 3)}>
              See my projects
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn" href="#contact" onClick={go('contact', 'Contact', 5)}>
              Contact me
            </a>
          </Magnetic>
        </div>
      </div>

      <h1 className="hero-name" aria-label={`${profile.first} ${profile.rest}`}>
        <span className="hero-l2 mask" aria-hidden="true">
          <span className="hero-char serif">{profile.rest}</span>
        </span>
        <span className="hero-l1 mask" aria-hidden="true">
          {profile.first.split('').map((c, i) => (
            <span className="hero-char" key={i}>
              {c}
            </span>
          ))}
        </span>
      </h1>

      <div className="hero-scroll hero-side">
        <span className="mono hero-fade">Scroll</span>
        <i className="hero-fade" />
      </div>
    </section>
  )
}
