import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { TbMenu2, TbX } from 'react-icons/tb'
import { TLink } from './PageTransition'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

export const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/about', label: 'Sobre mí' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/contact', label: 'Contacto' },
]

export default function Navbar({ shortName }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const bar = useRef(null)
  const menu = useRef(null)
  const menuTl = useRef(null)

  // Se oculta al bajar y reaparece al subir
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setScrolled(self.scroll() > 40)
        const hide = self.direction === 1 && self.scroll() > 200
        gsap.to(bar.current, { yPercent: hide ? -110 : 0, duration: 0.45, ease: 'power3.out', overwrite: true })
      },
    })
    return () => st.kill()
  })

  // Menú móvil a pantalla completa
  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { display: 'flex' })
        .fromTo(menu.current, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'expo.inOut' })
        .from('.m-link', { yPercent: 120, stagger: 0.07, duration: 0.7, ease: 'power4.out' }, '-=0.35')
    },
    { scope: menu },
  )

  useEffect(() => {
    if (!menuTl.current) return
    if (open) {
      window.lenis?.stop()
      menuTl.current.timeScale(1).play()
    } else {
      window.lenis?.start()
      menuTl.current.timeScale(1.6).reverse()
    }
  }, [open])

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled ? 'bg-canvas/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="container-x flex h-20 items-center justify-between md:justify-center">
          <TLink to="/" className="font-display text-lg font-extrabold text-mauve md:hidden">
            {shortName}
            <span className="text-ink">.</span>
          </TLink>

          <ul className="hidden items-center gap-2 md:flex">
            {NAV.map(({ to, label }) => {
              const active = pathname === to
              return (
                <li key={to}>
                  <TLink
                    to={to}
                    className={`group relative block rounded-md px-5 py-2.5 text-lg transition-colors ${
                      active ? 'bg-surface font-medium text-ink' : 'text-body hover:text-ink'
                    }`}
                  >
                    {label}
                    <span className="absolute inset-x-5 bottom-1.5 h-px origin-right scale-x-0 bg-mauve transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </TLink>
                </li>
              )
            })}
          </ul>

          <button onClick={() => setOpen(true)} className="text-3xl text-ink md:hidden" aria-label="Abrir menú">
            <TbMenu2 />
          </button>
        </nav>
      </header>

      <div ref={menu} className="fixed inset-0 z-[60] hidden flex-col justify-between bg-deep px-8 py-6 md:hidden">
        <div className="flex justify-end">
          <button onClick={() => setOpen(false)} className="text-4xl text-ink" aria-label="Cerrar menú">
            <TbX />
          </button>
        </div>
        <ul className="space-y-4">
          {NAV.map(({ to, label }, i) => (
            <li key={to} className="overflow-hidden">
              <TLink
                to={to}
                onClick={() => setOpen(false)}
                className={`m-link flex items-baseline gap-4 font-display text-5xl font-extrabold uppercase ${
                  pathname === to ? 'text-mauve' : 'text-ink'
                }`}
              >
                <span className="font-mono text-sm font-normal text-muted">0{i + 1}</span>
                {label}
              </TLink>
            </li>
          ))}
        </ul>
        <p className="font-mono text-sm text-muted">© {new Date().getFullYear()}</p>
      </div>
    </>
  )
}
