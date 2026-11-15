import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from '../lib/scroll'
import { SectionHead } from '../components/ui'
import { about } from '../data'

export default function About() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Words darken as you read down the page.
      gsap.fromTo(
        '.about-word',
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about-statement', start: 'top 82%', end: 'bottom 48%', scrub: true },
        },
      )
      gsap.utils.toArray('.stat-num b').forEach((el) => {
        const end = Number(el.dataset.value)
        const o = { v: 0 }
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(o.v)),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about light" id="about" ref={root}>
      <div className="wrap">
        <SectionHead n="01" label="About me" />

        <p className="about-statement">
          {about.statement.split(' ').map((w, i) => (
            <span className="about-word" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>

        <div className="stats">
          {about.stats.map((s, i) => (
            <div className="stat" key={i} data-reveal>
              <div className="stat-num">
                {s.prefix}
                <b data-value={s.value}>{s.value}</b>
                {s.suffix && <small>{s.suffix}</small>}
              </div>
              <p className="mono">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="about-cols">
          <div data-reveal>
            <h3 className="mono">Interests</h3>
            <ul className="plain-list">
              {about.interests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h3 className="mono">Goals</h3>
            <p className="about-goals">{about.goals}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
