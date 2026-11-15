import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { bus } from '../lib/store'
import { goTo, jumpTo, lockScroll, reduced } from '../lib/scroll'
import { profile, sections } from '../data'

const EASE = [0.22, 1, 0.36, 1]

/* ---------- Magnetic wrapper: the child leans toward the pointer ---------- */
export function Magnetic({ children, strength = 0.32 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 170, damping: 13, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 170, damping: 13, mass: 0.4 })
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.span>
  )
}

/* ---------- Custom cursor (mouse devices only) ---------- */
export function Cursor() {
  const [enabled] = useState(
    () => !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [shown, setShown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setShown(true)
    }
    const over = (e) => {
      const t = e.target.closest?.('a, button, [data-cursor]')
      setHover(!!t)
      setLabel(t?.dataset.cursor || '')
    }
    const out = () => setShown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', out)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', out)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const cls = `${hover ? ' is-hover' : ''}${label ? ' has-label' : ''}${shown ? ' is-shown' : ''}`
  return (
    <>
      <motion.div className={`cursor-dot${cls}`} style={{ x, y }} />
      <motion.div className={`cursor-ring${cls}`} style={{ x: rx, y: ry }}>
        <span>{label}</span>
      </motion.div>
    </>
  )
}

/* ---------- Preloader: counts up, then lifts like a curtain ---------- */
export function Preloader({ onDone }) {
  const [n, setN] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    lockScroll(true)
    const o = { v: 0 }
    const tw = gsap.to(o, {
      v: 100,
      duration: reduced ? 0.3 : 1.9,
      ease: 'power2.inOut',
      onUpdate: () => setN(Math.round(o.v)),
      onComplete: () => {
        setShow(false)
        lockScroll(false)
        onDone()
      },
    })
    return () => tw.kill()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pre-top mono">
            <span>
              {profile.first} {profile.rest}
            </span>
            <span>Portfolio · 2026</span>
          </div>
          <div className="pre-count">{String(n).padStart(3, '0')}</div>
          <div className="pre-bar">
            <i style={{ transform: `scaleX(${n / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Curtain: the page transition between sections ---------- */
export function Curtain() {
  const el = useRef(null)
  const text = useRef(null)
  const num = useRef(null)

  useEffect(() => {
    let tl
    const run = (e) => {
      const { id, label, index } = e.detail
      if (reduced) return jumpTo(id)
      tl?.kill()
      text.current.textContent = label
      num.current.textContent = String(index).padStart(2, '0')
      tl = gsap
        .timeline()
        .set(el.current, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' })
        .set([text.current, num.current], { yPercent: 110 })
        .to(el.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: 'power4.inOut' })
        .to([text.current, num.current], { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, '-=0.25')
        .add(() => jumpTo(id))
        .to([text.current, num.current], { yPercent: -110, duration: 0.45, ease: 'power3.in' }, '+=0.12')
        .to(el.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power4.inOut' }, '-=0.15')
        .set(el.current, { display: 'none' })
    }
    bus.addEventListener('goto', run)
    return () => bus.removeEventListener('goto', run)
  }, [])

  return (
    <div className="curtain" ref={el} aria-hidden="true">
      <span className="mask mono">
        <span ref={num}>00</span>
      </span>
      <span className="mask curtain-label">
        <span ref={text}>Section</span>
      </span>
    </div>
  )
}

/* ---------- Navigation ---------- */
export function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const bar = useRef(null)

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 240)
      last = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lockScroll(open)
  }, [open])

  const go = (s, i) => (e) => {
    e.preventDefault()
    setOpen(false)
    goTo(s.id, s.label, i)
  }

  return (
    <>
      <motion.header
        className="nav"
        animate={{ y: hidden && !open ? '-120%' : '0%' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <a className="nav-logo" href="#top" onClick={go(sections[0], 0)} aria-label="Home">
          BSD<i>.</i>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {sections.slice(1).map((s, i) => (
            <a key={s.id} href={`#${s.id}`} onClick={go(s, i + 1)} className="nav-link">
              <sup>0{i + 1}</sup>
              <span data-text={s.label}>{s.label}</span>
            </a>
          ))}
        </nav>
        <button
          className={`nav-toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          <i />
        </button>
      </motion.header>

      <div className="nav-progress" aria-hidden="true">
        <i ref={bar} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Menu">
              {sections.map((s, i) => (
                <div className="mask" key={s.id}>
                  <motion.a
                    href={`#${s.id}`}
                    onClick={go(s, i)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.06 }}
                  >
                    <sup>0{i}</sup>
                    {s.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <p className="mono menu-foot">{profile.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------- Section heading ---------- */
export function SectionHead({ n, label, children }) {
  return (
    <header className="sec-head" data-reveal>
      <span className="mono">
        {n} — {label}
      </span>
      {children && <span className="mono sec-head-note">{children}</span>}
    </header>
  )
}
