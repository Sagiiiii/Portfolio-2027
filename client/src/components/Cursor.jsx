import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// Cursor personalizado (solo con ratón): punto + aro que crece sobre enlaces y botones
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useGSAP(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.1 })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' })

    let visible = false
    const move = (e) => {
      if (!visible) {
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
        visible = true
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }
    const over = (e) => {
      const hit = e.target.closest('a, button, input, textarea, [data-cursor]')
      gsap.to(ring.current, { scale: hit ? 1.8 : 1, backgroundColor: hit ? 'rgba(196,182,186,0.15)' : 'rgba(0,0,0,0)', duration: 0.3 })
      gsap.to(dot.current, { scale: hit ? 0 : 1, duration: 0.3 })
    }
    const leave = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
      visible = false
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  })

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[100] hidden h-9 w-9 rounded-full border border-mauve/70 [@media(pointer:fine)]:block" />
      <div ref={dot} className="pointer-events-none fixed top-0 left-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-mauve [@media(pointer:fine)]:block" />
    </>
  )
}
