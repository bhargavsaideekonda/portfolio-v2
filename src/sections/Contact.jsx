import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { S } from '../lib/store'
import { Magnetic } from '../components/ui'
import { profile } from '../data'

export default function Contact() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (s) => (S.contact = s.progress),
        onToggle: (s) => s.isActive && (S.stage = 'contact'),
        onLeave: () => (S.stage = 'contact'),
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={root} data-3d>
      <div className="wrap contact-inner">
        <p className="mono" data-reveal>
          05 — Contact
        </p>

        <h2 className="contact-title" data-lines>
          <span className="mask">
            <span>Let’s build</span>
          </span>
          <span className="mask">
            <span>something</span>
          </span>
          <span className="mask">
            <span>
              <em className="serif">together.</em>
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <p className="contact-note" data-reveal>
            I’m open to internships, projects and learning together. The fastest way to reach me
            is email.
          </p>
          <div className="contact-links" data-reveal>
            <a className="contact-mail" href={`mailto:${profile.email}`} data-cursor="Write">
              {profile.email}
            </a>
            <div className="hero-cta">
              <Magnetic>
                <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </Magnetic>
              {profile.linkedin && (
                <Magnetic>
                  <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                </Magnetic>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer mono">
        <span>© 2026 {profile.first} {profile.rest}</span>
        <span>Built with the help of Claude (AI) · Published on GitHub Pages</span>
      </footer>
    </section>
  )
}
