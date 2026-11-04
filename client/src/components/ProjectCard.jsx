import { mediaUrl } from '../lib/links'
import { useRef } from 'react'
import { TbBrandGithub, TbExternalLink } from 'react-icons/tb'
import { gsap } from '../lib/gsap'

// Botón con borde blanco (mismo estilo que "Leer más", en tamaño pequeño)
const linkBtn =
  'inline-flex items-center gap-2 rounded-md border-2 border-body px-4 py-2 font-mono text-sm text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-deep'

// Tarjeta de proyecto: captura arriba + caja de texto abajo. Inclinación 3D al pasar el ratón.
export default function ProjectCard({ project, className = '' }) {
  const card = useRef(null)

  const onMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const r = card.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(card.current, { rotateY: x * 8, rotateX: -y * 8, duration: 0.5, ease: 'power2.out', transformPerspective: 900 })
  }
  const onLeave = () => gsap.to(card.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })

  return (
    <article
      ref={card}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group flex flex-col gap-4 will-change-transform ${className}`}
    >
      <div className="relative aspect-[4/3.6] overflow-hidden rounded-xl border-4 border-surface bg-surface">
        {project.image ? (
          <img
            src={mediaUrl(project.image)}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col bg-linear-to-br from-night-1 to-night-2 transition-transform duration-[1.2s] ease-out group-hover:scale-105">
            <div className="flex gap-1.5 p-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex flex-1 items-center justify-center px-6 text-center font-mono text-lg text-ink/80">
              &lt;{project.title.replace(/\s+/g, '')} /&gt;
            </div>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 rounded bg-deep/80 px-2 py-1 font-mono text-xs text-mauve backdrop-blur">
            ★ destacado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col rounded-xl bg-surface p-5">
        <h3 className="font-display text-2xl font-semibold text-mauve">{project.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-body">{project.description}</p>
        {project.tags?.length > 0 && (
          <p className="mt-3 text-xs text-muted">{project.tags.join(' · ')}</p>
        )}
        {(project.repo || project.demo) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className={linkBtn}>
                <TbBrandGithub className="text-base" /> Código
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className={linkBtn}>
                <TbExternalLink className="text-base" /> Demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
