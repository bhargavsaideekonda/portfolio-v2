import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { S } from '../lib/store'
import { projects } from '../data'

const N = projects.length

// Desktop: the section pins and vertical scroll drives a horizontal gallery.
// Every panel reshapes the chrome sculpture behind it. Phones get a vertical stack.
export default function Projects() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const count = useRef(null)
  const bar = useRef(null)

  useLayoutEffect(() => {
    const setIndex = (f) => {
      S.projectIndex = f
      const i = Math.round(gsap.utils.clamp(0, N - 1, f))
      if (count.current) count.current.textContent = String(i + 1).padStart(2, '0')
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        refreshPriority: -1, // measure after the pin below has added its spacing
        onToggle: (s) => s.isActive && (S.stage = 'projects'),
      })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 0.6,
            start: 'top top',
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              S.projects = s.progress
              setIndex(s.progress * N - 1)
              if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`
            },
          },
        })
        // Titles drift against the track for layered depth.
        gsap.utils.toArray('.proj-title').forEach((t) => {
          gsap.fromTo(
            t,
            { xPercent: 9 },
            {
              xPercent: -9,
              ease: 'none',
              scrollTrigger: {
                trigger: t.closest('.proj-panel'),
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
        gsap.utils.toArray('.proj-index').forEach((t) => {
          gsap.fromTo(
            t,
            { xPercent: -30 },
            {
              xPercent: 30,
              ease: 'none',
              scrollTrigger: {
                trigger: t.closest('.proj-panel'),
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
      })

      mm.add('(max-width: 899px)', () => {
        S.projects = 0.5
        ScrollTrigger.create({
          trigger: '.proj-intro',
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (s) => s.isActive && setIndex(-1),
        })
        gsap.utils.toArray('.proj-panel:not(.proj-intro)').forEach((p, i) => {
          ScrollTrigger.create({
            trigger: p,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (s) => s.isActive && setIndex(i),
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="projects" id="projects" ref={root} data-3d>
      <div className="proj-pin" ref={pin}>
        <div className="proj-track" ref={track}>
          <div className="proj-panel proj-intro">
            <p className="mono">03 — Projects</p>
            <h2 className="proj-title proj-title-xl">
              <span>Selected</span>
              <span>
                <em className="serif">work</em>
                <sup className="mono">({String(N).padStart(2, '0')})</sup>
              </span>
            </h2>
            <p className="proj-lede">
              Five small tools, each built to learn one thing properly. Scroll: the sculpture
              reshapes itself for every project.
            </p>
          </div>

          {projects.map((p, i) => (
            <article className={`proj-panel${i % 2 ? ' is-offset' : ''}`} key={p.n}>
              <div className="proj-index" aria-hidden="true">
                {p.n}
              </div>
              <h3 className="proj-title">
                {p.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </h3>
              <div className="proj-meta">
                <p>{p.desc}</p>
                <div>
                  <ul className="tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {p.link ? (
                    <a
                      className="link-u"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Open"
                    >
                      View on GitHub ↗
                    </a>
                  ) : (
                    <span className="mono proj-note">{p.note}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="proj-hud mono" aria-hidden="true">
          <span>
            <b ref={count}>01</b> / {String(N).padStart(2, '0')}
          </span>
          <div className="proj-bar">
            <i ref={bar} />
          </div>
          <span>Scroll →</span>
        </div>
      </div>
    </section>
  )
}
