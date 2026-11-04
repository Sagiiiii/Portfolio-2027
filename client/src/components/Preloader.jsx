import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Pantalla de carga inicial: nombre letra a letra + contador 0→100 + salida tipo telón
export default function Preloader({ name, onDone }) {
  const root = useRef(null)
  const count = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        onDone()
        return
      }
      const counter = { v: 0 }
      gsap
        .timeline({ onComplete: onDone })
        .from('.pl-char', { yPercent: 120, stagger: 0.04, duration: 0.8, ease: 'power4.out' })
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: 'power2.inOut',
            onUpdate: () => (count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')),
          },
          0,
        )
        .to('.pl-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
        .to('.pl-char', { yPercent: -120, stagger: 0.02, duration: 0.5, ease: 'power3.in' }, '+=0.15')
        .to('.pl-meta', { autoAlpha: 0, duration: 0.3 }, '<')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.15')
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-deep">
      <h1 className="flex overflow-hidden font-display text-4xl font-extrabold tracking-tight text-mauve sm:text-7xl">
        {name.split('').map((c, i) => (
          <span key={i} className="pl-char inline-block whitespace-pre">
            {c}
          </span>
        ))}
      </h1>
      <div className="pl-meta mt-8 flex w-56 items-center gap-4 sm:w-72">
        <div className="h-px flex-1 bg-line">
          <div className="pl-bar h-px origin-left scale-x-0 bg-mauve" />
        </div>
        <span ref={count} className="font-mono text-sm text-muted tabular-nums">
          000
        </span>
      </div>
    </div>
  )
}
