import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Lenis from 'lenis'
import { usePortfolio } from './hooks/usePortfolio'
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/gsap'
import { TransitionProvider } from './components/PageTransition'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Scroll suave (Lenis) sincronizado con GSAP ScrollTrigger
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.lenis
    }
  }, [])
}

export default function App() {
  const { data, source } = usePortfolio()
  const { profile } = data.site
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  useSmoothScroll()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Bloquea el scroll mientras se ve el preloader
  useEffect(() => {
    if (loading) window.lenis?.stop()
    else window.lenis?.start()
  }, [loading])

  // Navegación con atrás/adelante del navegador: volver arriba y recalcular animaciones
  useLayoutEffect(() => {
    window.lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <TransitionProvider>
      {loading && <Preloader name={profile.name} onDone={() => setLoading(false)} />}
      <Cursor />
      <Navbar shortName={profile.shortName || profile.name} />
      {/* key: al llegar los datos de la API se vuelve a montar la página (las animaciones dividen el texto) */}
      <main key={`page-${source}`}>
        <Routes>
          <Route path="/" element={<Home ready={!loading} />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer key={`footer-${source}`} site={data.site} />
      <WhatsAppWidget site={data.site} />
    </TransitionProvider>
  )
}
