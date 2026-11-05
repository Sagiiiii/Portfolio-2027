import { useEffect, useRef } from 'react'
import { TbArrowDown } from 'react-icons/tb'
import { gsap, SplitText, useGSAP } from '../../lib/gsap'
import { getSocialIcon } from '../../lib/icons'
import ActionButtons from '../ActionButtons'
import CvButton from '../CvButton'
import HeroScene from './HeroScene'

export default function Hero({ site, play }) {
  const { profile, hero, socials } = site
  const root = useRef(null)
  const intro = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ── Intro (se reproduce cuando termina el preloader) ──
        const split = SplitText.create('.hero-name', { type: 'words,chars', mask: 'words' })
        intro.current = gsap
          .timeline({ paused: true, defaults: { ease: 'power4.out' } })
          .from('.hero-hello', { y: 30, autoAlpha: 0, duration: 0.8 })
          .from(split.chars, { yPercent: 110, rotate: 10, stagger: 0.035, duration: 1.1 }, '-=0.5')
          .fromTo(
            '.hero-frame',
            { clipPath: 'inset(50% 50% 50% 50%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
            '-=0.9',
          )
          .from('.scene-moon', { scale: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' }, '-=0.6')
          .from('.scene-light', { scaleY: 0, autoAlpha: 0, duration: 1 }, '<')
          .from('.scene-editor', { y: 80, autoAlpha: 0, duration: 1 }, '<0.1')
          .fromTo(
            '.code-line',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.45, stagger: 0.12, ease: 'steps(14)' },
            '-=0.4',
          )
          .from('.scene-chip', { scale: 0, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)' }, '<')
          .from('.hero-copy > *', { y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.8 }, '-=1.2')
          .from('.hero-side', { autoAlpha: 0, x: -20, duration: 0.8 }, '<')

        // ── Logos flotando (bucle infinito) ──
        gsap.utils.toArray('.float').forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 14 : -14, rotate: i % 2 ? 4 : -4, duration: 2.6 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        })
        gsap.to('.scene-light', { opacity: 0.75, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 3.5, ease: 'none' })

        // ── Scroll: la escena hace zoom y el nombre sube (estilo Apple) ──
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
        })
        scrollTl
          .to('.hero-name', { yPercent: -60, autoAlpha: 0, ease: 'none' }, 0)
          .to('.hero-hello', { y: -60, autoAlpha: 0, ease: 'none' }, 0)
          .to('.hero-frame', { scale: 0.9, ease: 'none' }, 0)
          .to('.hero-scene-inner', { scale: 1.25, yPercent: 10, ease: 'none' }, 0)
          .to('.hero-copy', { y: -40, autoAlpha: 0, ease: 'none' }, 0)
      })

      // ── Parallax con el ratón ──
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const layers = gsap.utils.toArray('[data-depth]').map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
          depth: Number(el.dataset.depth),
        }))
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          layers.forEach((l) => {
            l.x(nx * 40 * l.depth)
            l.y(ny * 30 * l.depth)
          })
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  useEffect(() => {
    if (play) intro.current?.play()
  }, [play])

  return (
    <section ref={root} className="relative overflow-hidden pt-28 pb-16 sm:pt-32">
      <div className="container-x text-center">
        <p className="hero-hello eyebrow font-medium">{hero.greeting}</p>
        <h1 className="hero-name relative z-10 mt-1 font-display text-[clamp(2.6rem,8.5vw,7rem)] leading-[1.05] font-bold tracking-tight text-ink">
          {profile.name}
        </h1>

        <div className="hero-frame relative z-0 mx-auto -mt-[clamp(1.4rem,4vw,3.6rem)] max-w-5xl overflow-hidden border-2 border-ink/80 bg-[#15162a] sm:aspect-[16/10.5]">
          {/* Móvil: escena arriba y texto debajo. Escritorio: texto encima de la escena */}
          <div className="relative h-[310px] overflow-hidden sm:absolute sm:inset-0 sm:h-auto">
            <div className="hero-scene-inner absolute inset-0">
              <HeroScene site={site} />
            </div>
          </div>

          <div className="hero-copy relative flex flex-col items-center gap-6 px-6 pt-6 pb-8 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-linear-to-t sm:from-[#15162a] sm:via-[#15162a]/80 sm:to-transparent sm:pt-16 sm:pb-12">
            <p className="max-w-xl text-sm leading-relaxed text-ink/90 sm:text-lg">{hero.tagline}</p>
            <ActionButtons buttons={hero.buttons} className="justify-center">
              <CvButton profile={profile} config={hero.cvButton} />
            </ActionButtons>
          </div>
        </div>
      </div>

      {/* Lateral "Sígueme" */}
      <div className="hero-side absolute bottom-16 left-8 hidden flex-col items-center gap-5 xl:flex">
        <span className="font-mono text-xs tracking-[0.4em] text-body uppercase [writing-mode:vertical-rl]">Sígueme</span>
        <span className="h-16 w-px bg-body" />
        {socials.map(({ name, url, icon }, i) => {
          const Icon = getSocialIcon(icon)
          return (
            <a key={`${name}-${i}`} href={url} target="_blank" rel="noreferrer" aria-label={name} title={name} className="text-xl text-body transition-colors hover:text-mauve">
              <Icon />
            </a>
          )
        })}
      </div>

      {/* Indicador de scroll */}
      <div className="hero-side absolute right-10 bottom-36 hidden flex-col items-center gap-3 xl:flex">
        <span className="font-mono text-xs tracking-[0.4em] text-body uppercase [writing-mode:vertical-rl]">Scroll</span>
        <TbArrowDown className="animate-bounce text-xl text-body" />
      </div>
    </section>
  )
}
