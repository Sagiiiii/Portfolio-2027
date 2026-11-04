import { useRef } from 'react'
import { TbArrowRight } from 'react-icons/tb'
import { gsap, useGSAP } from '../../lib/gsap'
import { TLink } from '../PageTransition'
import SectionHeading from '../SectionHeading'
import ProjectCard from '../ProjectCard'

// Proyectos recientes. En escritorio la sección se queda fija y las tarjetas
// avanzan en horizontal con el scroll. En móvil es un carrusel deslizable.
export default function ProjectsShowcase({ section, projects }) {
  const root = useRef(null)
  const wrap = useRef(null)
  const track = useRef(null)
  const list = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(wrap.current, { overflow: 'visible' })
        const distance = () => track.current.scrollWidth - window.innerWidth

        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.sc-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })

        // Cada tarjeta se "asienta" al entrar desde la derecha
        gsap.utils.toArray('.sc-card').forEach((card) => {
          gsap.from(card, {
            rotateY: -25,
            scale: 0.88,
            autoAlpha: 0.4,
            transformPerspective: 1200,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 100%',
              end: 'left 60%',
              scrub: true,
            },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [list.length] },
  )

  return (
    <section ref={root} className="flex flex-col justify-center overflow-hidden py-24 lg:min-h-svh lg:py-10">
      <div className="container-x">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} />
      </div>

      <div ref={wrap} className="mt-14 snap-x snap-mandatory overflow-x-auto pb-6 [scrollbar-width:none] lg:mt-12">
        <div
          ref={track}
          className="flex w-max gap-8 px-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
        >
          {list.map((p) => (
            <div key={p.slug} className="sc-card w-[78vw] shrink-0 snap-center sm:w-[340px] lg:w-[clamp(280px,30vh+90px,390px)]">
              <ProjectCard project={p} className="h-full" />
            </div>
          ))}

          <TLink
            to="/projects"
            className="sc-card group flex w-[78vw] shrink-0 snap-center flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-line text-center transition-colors hover:border-mauve sm:w-[340px] lg:w-[clamp(280px,30vh+90px,390px)]"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-3xl text-mauve transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-45">
              <TbArrowRight />
            </span>
            <span className="font-display text-2xl font-semibold text-mauve">{section.viewAllLabel || 'Ver todos los proyectos'}</span>
            <span className="text-sm text-muted">{projects.length} en total</span>
          </TLink>
        </div>
      </div>

      <div className="container-x mt-6 hidden lg:block">
        <div className="h-px w-full bg-line">
          <div className="sc-progress h-px origin-left scale-x-0 bg-mauve" />
        </div>
      </div>
    </section>
  )
}
