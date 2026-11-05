import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TbAward, TbExternalLink, TbX, TbChevronLeft, TbChevronRight, TbZoomIn } from 'react-icons/tb'
import { mediaUrl } from '../lib/links'

// Enlace del certificado (PDF subido → URL completa de la API)
const linkOf = (c) => mediaUrl(c.url)

// Margen lateral que alinea el carrusel con el resto de la página (igual que .container-x)
const SIDE = 'px-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]'
const SNAP_MARGIN = 'scroll-ml-6 sm:scroll-ml-10 lg:scroll-ml-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]'

// "Mis certificados": carrusel horizontal (flechas, arrastre, táctil) + visor a pantalla completa
export default function CertificatesGallery({ title, items = [], titleIcon: TitleIcon = TbAward }) {
  const list = items.filter((c) => c.title || c.image || c.url)
  const [open, setOpen] = useState(null) // índice del certificado abierto en el visor
  const [edges, setEdges] = useState({ prev: false, next: false })
  const [dragging, setDragging] = useState(false)
  const track = useRef(null)
  const drag = useRef(null)
  const withImage = list.map((c, i) => ({ ...c, i })).filter((c) => c.image)

  // ¿Se puede ir a la izquierda / derecha?
  const updateEdges = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdges({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [list.length, updateEdges])

  useEffect(() => {
    if (open === null) return
    window.lenis?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  })

  if (!list.length) return null

  // Desplaza el carrusel lo que se ve en pantalla (todas las tarjetas visibles)
  const slide = (dir) => {
    const el = track.current
    const card = el.querySelector('[data-card]')
    const step = (card?.offsetWidth ?? 300) + 24
    const perView = Math.max(1, Math.floor((el.clientWidth - 80) / step))
    el.scrollBy({ left: dir * perView * step, behavior: 'smooth' })
  }

  // Arrastrar con el ratón (en táctil ya funciona el deslizamiento nativo)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true
      setDragging(true)
    }
    if (d.moved) track.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    if (drag.current?.moved) setTimeout(() => setDragging(false), 0)
    drag.current = null
  }

  // Navega solo entre certificados que tienen imagen
  const step = (d) => {
    const pos = withImage.findIndex((c) => c.i === open)
    const next = withImage[(pos + d + withImage.length) % withImage.length]
    if (next) setOpen(next.i)
  }

  const onCardClick = (c, i) => {
    if (dragging) return // fue un arrastre, no un clic
    if (c.image) setOpen(i)
    else if (c.url) window.open(linkOf(c), '_blank', 'noopener,noreferrer')
  }

  const current = open !== null ? list[open] : null
  const arrowCls =
    'flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface text-2xl text-ink transition-colors hover:border-mauve hover:text-mauve disabled:cursor-default disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink'

  return (
    <section className="py-16 sm:py-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-mauve sm:text-4xl">
          <TitleIcon className="shrink-0 text-2xl text-mauve/70 sm:text-3xl" />
          <span data-anim="heading">{title}</span>
          <span className="font-mono text-sm font-normal text-muted">({list.length})</span>
        </h2>
        {(edges.prev || edges.next) && (
          <div className="flex gap-2">
            <button type="button" onClick={() => slide(-1)} disabled={!edges.prev} className={arrowCls} aria-label="Anteriores">
              <TbChevronLeft />
            </button>
            <button type="button" onClick={() => slide(1)} disabled={!edges.next} className={arrowCls} aria-label="Siguientes">
              <TbChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Carrusel: alineado con la página, se desborda hacia la derecha */}
      <div className="relative mt-8">
        <div
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          data-anim="stagger"
          className={`flex gap-6 overflow-x-auto pt-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${SIDE} ${
            dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory lg:cursor-grab'
          }`}
        >
          {list.map((c, i) => (
            // El contenedor recibe la animación de entrada (GSAP); la tarjeta, el efecto hover (CSS)
            <div key={`${c.title}-${i}`} data-card className={`flex w-[78vw] shrink-0 snap-start sm:w-[300px] lg:w-[320px] ${SNAP_MARGIN}`}>
              <button
                type="button"
                onClick={() => onCardClick(c, i)}
                disabled={!c.image && !c.url}
                draggable={false}
                className="group flex w-full flex-col overflow-hidden rounded-xl border border-line/70 bg-surface/60 text-left transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-mauve/50 disabled:cursor-default"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-deep">
                  {c.image ? (
                    <img
                      src={mediaUrl(c.image)}
                      alt={c.title}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#1a1a1a)] text-mauve">
                      <TbAward className="text-6xl opacity-70" />
                      {c.url && <span className="font-mono text-xs text-muted">Ver certificado</span>}
                    </div>
                  )}
                  {(c.image || c.url) && (
                    <span className="absolute inset-0 flex items-center justify-center bg-deep/60 text-3xl text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {c.image ? <TbZoomIn /> : <TbExternalLink />}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base leading-snug font-semibold text-ink">{c.title}</h3>
                    {c.date && (
                      <span className="rounded-md border border-mauve/40 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-mauve">
                        {c.date}
                      </span>
                    )}
                  </div>
                  {c.issuer && <p className="text-sm text-mauve">{c.issuer}</p>}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Bordes difuminados que indican que hay más tarjetas */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-canvas to-transparent transition-opacity duration-300 sm:w-16 ${
            edges.prev ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-canvas to-transparent transition-opacity duration-300 sm:w-16 ${
            edges.next ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Visor a pantalla completa */}
      {current &&
        createPortal(
        <div
          className="fixed inset-0 z-[85] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-label={current.title}
        >
          <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-4xl text-white/80 hover:text-white" aria-label="Cerrar">
            <TbX />
          </button>
          {withImage.length > 1 && (
            <>
              <button
                onClick={(e) => (e.stopPropagation(), step(-1))}
                className="absolute left-2 rounded-full bg-white/10 p-2 text-3xl text-white hover:bg-white/20 sm:left-6"
                aria-label="Anterior"
              >
                <TbChevronLeft />
              </button>
              <button
                onClick={(e) => (e.stopPropagation(), step(1))}
                className="absolute right-2 rounded-full bg-white/10 p-2 text-3xl text-white hover:bg-white/20 sm:right-6"
                aria-label="Siguiente"
              >
                <TbChevronRight />
              </button>
            </>
          )}
          <img
            src={mediaUrl(current.image)}
            alt={current.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-display text-lg font-semibold text-white">{current.title}</p>
              <p className="text-sm text-white/60">{[current.issuer, current.date].filter(Boolean).join(' · ')}</p>
            </div>
            {current.url && (
              <a href={linkOf(current)} target="_blank" rel="noreferrer" className="btn-outline !px-4 !py-2 !text-sm">
                <TbExternalLink /> Ver original
              </a>
            )}
          </div>
        </div>,
          document.body,
        )}
    </section>
  )
}
