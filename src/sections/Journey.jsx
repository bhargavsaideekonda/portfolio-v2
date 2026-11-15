import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHead } from '../components/ui'
import { journey } from '../data'

const N = journey.length
const FLOOR_H = 60
const BASE_Y = 560
// Each floor: [x, width] — offset slabs, so the tower reads as a building section.
const FLOORS = [
  [70, 200],
  [70, 170],
  [100, 170],
  [100, 140],
  [70, 170],
  [120, 150],
  [120, 110],
  [140, 90],
]

// Education + achievements as an architectural elevation: every milestone you
// scroll past adds a floor to the tower.
export default function Journey() {
  const root = useRef(null)
  const [built, setBuilt] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tl-row').forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          onEnter: () => setBuilt((b) => Math.max(b, i + 1)),
          onLeaveBack: () => setBuilt(i),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const level = (i) => `L${String(i + 1).padStart(2, '0')}`

  return (
    <section className="journey light" id="journey" ref={root}>
      <div className="wrap">
        <SectionHead n="04" label="Education & achievements">
          Elevation · scale 1 : 2026
        </SectionHead>

        <div className="journey-grid">
          <aside className="tower" aria-hidden="true">
            <svg viewBox="0 0 340 620" role="presentation">
              {/* dimension line */}
              <line x1="34" y1={BASE_Y} x2="34" y2={BASE_Y - N * FLOOR_H} className="tw-dim" />
              {FLOORS.map((_, i) => (
                <g key={i}>
                  <line x1="28" y1={BASE_Y - i * FLOOR_H} x2="40" y2={BASE_Y - i * FLOOR_H} className="tw-dim" />
                  <text x="22" y={BASE_Y - i * FLOOR_H - FLOOR_H / 2 + 3} className="tw-lv" textAnchor="end">
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              ))}
              <line x1="28" y1={BASE_Y - N * FLOOR_H} x2="40" y2={BASE_Y - N * FLOOR_H} className="tw-dim" />

              {/* floors */}
              {FLOORS.map(([x, w], i) => (
                <g key={i} className={`tw-floor${i < built ? ' is-built' : ''}${i === built - 1 ? ' is-top' : ''}`}>
                  <rect x={x} y={BASE_Y - (i + 1) * FLOOR_H} width={w} height={FLOOR_H} />
                  <text x={x + 10} y={BASE_Y - i * FLOOR_H - FLOOR_H / 2 + 4}>
                    {journey[i].tag}
                  </text>
                </g>
              ))}

              {/* ground */}
              <line x1="10" y1={BASE_Y} x2="330" y2={BASE_Y} className="tw-ground" />
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={i} x1={20 + i * 20} y1={BASE_Y} x2={10 + i * 20} y2={BASE_Y + 12} className="tw-dim" />
              ))}
              <text x="330" y={BASE_Y + 34} textAnchor="end" className="tw-lv">
                {String(built).padStart(2, '0')} / {String(N).padStart(2, '0')} levels built
              </text>
            </svg>
          </aside>

          <ol className="tl">
            {journey.map((j, i) => (
              <li className={`tl-row${i < built ? ' is-built' : ''}`} key={j.title}>
                <span className="tl-level mono">{level(i)}</span>
                <span className="tl-date mono">{j.date}</span>
                <div className="tl-body">
                  <span className="tl-tag mono">{j.tag}</span>
                  <h3>{j.title}</h3>
                  <p>{j.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
