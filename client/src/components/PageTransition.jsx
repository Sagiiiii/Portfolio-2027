import { createContext, useCallback, useContext, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

// Cortina animada entre páginas: cubre → cambia de ruta → descubre
const TransitionContext = createContext(() => {})

const LABELS = { '/': 'Inicio', '/about': 'Sobre mí', '/projects': 'Proyectos', '/contact': 'Contacto' }

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const curtain = useRef(null)
  const label = useRef(null)
  const busy = useRef(false)

  const go = useCallback(
    (to) => {
      if (to === pathname) {
        window.lenis ? window.lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (busy.current) return
      if (prefersReducedMotion()) {
        navigate(to)
        return
      }
      busy.current = true
      label.current.textContent = LABELS[to] ?? ''

      gsap
        .timeline({ onComplete: () => (busy.current = false) })
        .set(curtain.current, { display: 'flex', yPercent: 100 })
        .to(curtain.current, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
        .fromTo(label.current, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4 }, '-=0.25')
        .add(() => {
          navigate(to)
          window.lenis?.scrollTo(0, { immediate: true, force: true })
          window.scrollTo(0, 0)
        })
        .add(() => ScrollTrigger.refresh(), '+=0.1')
        .to(label.current, { yPercent: -100, autoAlpha: 0, duration: 0.3 }, '+=0.1')
        .to(curtain.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '-=0.1')
        .set(curtain.current, { display: 'none' })
    },
    [navigate, pathname],
  )

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={curtain}
        className="fixed inset-0 z-[90] hidden items-center justify-center overflow-hidden bg-deep"
        aria-hidden="true"
      >
        <span ref={label} className="font-display text-4xl font-extrabold tracking-tight text-mauve uppercase sm:text-6xl" />
      </div>
    </TransitionContext.Provider>
  )
}

export const useTransitionNavigate = () => useContext(TransitionContext)

// <TLink to="/about"> → enlace interno con transición
export function TLink({ to, children, onClick, ...props }) {
  const go = useTransitionNavigate()
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.(e)
        go(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
