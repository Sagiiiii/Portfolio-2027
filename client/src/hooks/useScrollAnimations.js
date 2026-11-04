import { gsap, SplitText, useGSAP } from '../lib/gsap'

/**
 * Animaciones declarativas al hacer scroll. Marca elementos con data-anim:
 *
 *  data-anim="heading"  → letras que suben con el scroll (scrub, estilo Apple)
 *  data-anim="lines"    → el párrafo aparece línea por línea con máscara
 *  data-anim="fade"     → aparece desde abajo
 *  data-anim="stagger"  → sus hijos aparecen en cascada
 *  data-anim="image"    → revelado con clip-path + parallax de la imagen interna
 *  data-anim="scale"    → crece desde 0.85 mientras entra en pantalla (scrub)
 *  data-anim="parallax" → se desplaza a distinta velocidad (data-speed, ej: 0.2)
 */
export function useScrollAnimations(scope, deps = []) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const q = (sel) => Array.from(root.querySelectorAll(sel))
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('[data-anim="heading"]').forEach((el) => {
          SplitText.create(el, {
            type: 'words,chars',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 110,
                rotate: 8,
                stagger: 0.035,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: 0.8 },
              }),
          })
        })

        q('[data-anim="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 1.1,
                stagger: 0.09,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })

        q('[data-anim="fade"]').forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        q('[data-anim="stagger"]').forEach((el) => {
          gsap.from(el.children, {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        q('[data-anim="image"]').forEach((el) => {
          const img = el.querySelector('img, [data-anim-inner]')
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.4,
              ease: 'expo.inOut',
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            },
          )
          if (img) {
            gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
            gsap.fromTo(
              img,
              { yPercent: -6 },
              { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          }
        })

        q('[data-anim="scale"]').forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.85, borderRadius: '48px', autoAlpha: 0.3 },
            {
              scale: 1,
              borderRadius: '16px',
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
            },
          )
        })

        q('[data-anim="parallax"]').forEach((el) => {
          const speed = Number(el.dataset.speed || 0.2)
          gsap.to(el, {
            yPercent: -100 * speed,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
