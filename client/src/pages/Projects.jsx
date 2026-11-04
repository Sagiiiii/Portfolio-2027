import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { usePortfolio } from '../hooks/usePortfolio'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { gsap, Flip } from '../lib/gsap'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import CallToAction from '../components/CallToAction'

const normalize = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Projects() {
  const { data } = usePortfolio()
  const root = useRef(null)
  const grid = useRef(null)
  const flipState = useRef(null)
  const [query, setQuery] = useState('')
  useScrollAnimations(root, [data])

  const projects = useMemo(
    () => [...data.projects].sort((a, b) => Number(b.featured) - Number(a.featured)),
    [data.projects],
  )
  const matches = (p) => {
    const q = normalize(query.trim())
    return !q || normalize([p.title, p.description, ...(p.tags ?? [])].join(' ')).includes(q)
  }
  const visibleCount = projects.filter(matches).length

  const onSearch = (e) => {
    // Guardamos posiciones ANTES del cambio para animar el reordenamiento (FLIP)
    flipState.current = Flip.getState(grid.current.querySelectorAll('.pj-item'))
    setQuery(e.target.value)
  }

  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.6,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.4 }),
    })
    flipState.current = null
  }, [query])

  return (
    <div ref={root} className="pt-32">
      <section className="container-x pb-10">
        <SectionHeading eyebrow={data.site.projects.eyebrow} title={data.site.projects.title} />

        <div data-anim="fade" className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <label className="flex w-full max-w-sm items-center gap-3 rounded-md bg-ink px-4 py-3 text-deep">
            <input
              value={query}
              onChange={onSearch}
              placeholder="Nombre del proyecto"
              className="w-full bg-transparent font-mono text-lg placeholder:text-deep/50 focus:outline-none"
            />
            <TbSearch className="shrink-0 text-xl" />
          </label>
          <span className="font-mono text-sm text-muted">
            {visibleCount} de {projects.length} proyectos
          </span>
        </div>

        <div ref={grid} data-anim="stagger" className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.slug} className={`pj-item ${matches(p) ? '' : 'hidden'}`}>
              <ProjectCard project={p} className="h-full" />
            </div>
          ))}
        </div>

        {visibleCount === 0 && (
          <p className="mt-10 text-center font-mono text-muted">No hay proyectos que coincidan con “{query}”.</p>
        )}
      </section>

      <CallToAction />
    </div>
  )
}
