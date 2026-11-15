import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { reduced } from '../lib/scroll'
import { SectionHead } from '../components/ui'
import { skillGroups } from '../data'

const RADII = [120, 205, 292] // px inside a 820px stage
const SPEEDS = ['70s', '110s', '150s']
const STAGE = 820
const total = skillGroups.reduce((n, g) => n + g.items.length, 0)

// An orbital map of skills: three tilted rings, one per group. Labels always
// face the viewer; the list beside it and the rings highlight each other.
export default function Skills() {
  const [active, setActive] = useState(null) // { g, name }
  const stage = useRef(null)
  const scaler = useRef(null)
  const tiltEl = useRef(null)

  useEffect(() => {
    const fit = () => {
      const w = stage.current.clientWidth
      scaler.current.style.transform = `scale(${w / STAGE})`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const rx = gsap.quickTo(tiltEl.current, 'rotationX', { duration: 0.9, ease: 'power3.out' })
    const ry = gsap.quickTo(tiltEl.current, 'rotationY', { duration: 0.9, ease: 'power3.out' })
    const el = stage.current
    const move = (e) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 16)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  const activeGroup = active ? skillGroups[active.g] : null

  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <SectionHead n="02" label="Skills">
          Hover a skill
        </SectionHead>

        <div className="skills-grid">
          <div className="skills-lists">
            <h2 className="display-m" data-lines>
              <span className="mask">
                <span>What I</span>
              </span>
              <span className="mask">
                <span>
                  work <em className="serif">with</em>
                </span>
              </span>
            </h2>
            {skillGroups.map((g, gi) => (
              <div
                className={`skill-group${active && active.g === gi ? ' is-active' : ''}`}
                key={g.key}
                data-reveal
              >
                <h3 className="mono">
                  <i>0{gi + 1}</i>
                  {g.title}
                </h3>
                <ul>
                  {g.items.map((name) => (
                    <li key={name}>
                      <button
                        className={active?.name === name ? 'is-active' : ''}
                        onPointerEnter={() => setActive({ g: gi, name })}
                        onPointerLeave={() => setActive(null)}
                        onFocus={() => setActive({ g: gi, name })}
                        onBlur={() => setActive(null)}
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`orbit${active ? ' is-paused' : ''}`} ref={stage} aria-hidden="true">
            <div className="orbit-scaler" ref={scaler}>
              <div className="orbit-tilt" ref={tiltEl}>
                <div className="orbit-system">
                  <div className="orbit-core" />
                  {skillGroups.map((g, gi) => (
                    <div
                      className={`orbit-ring${active && active.g === gi ? ' is-active' : ''}`}
                      key={g.key}
                      style={{
                        '--r': `${RADII[gi]}px`,
                        '--d': SPEEDS[gi],
                        '--dir': gi % 2 ? 'reverse' : 'normal',
                      }}
                    >
                      {g.items.map((name, i) => (
                        <div
                          className="orbit-item"
                          key={name}
                          style={{ '--a': `${(i / g.items.length) * 360 + gi * 24}deg` }}
                        >
                          <div
                            className={`orbit-label${active?.name === name ? ' is-active' : ''}`}
                            onPointerEnter={() => setActive({ g: gi, name })}
                            onPointerLeave={() => setActive(null)}
                          >
                            <i />
                            <span>{name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="orbit-readout">
              <span className="mono">{activeGroup ? activeGroup.title : 'Total'}</span>
              <strong className="serif">{active ? active.name : `${total} skills`}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
