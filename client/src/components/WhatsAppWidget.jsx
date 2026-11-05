import { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { TbSend2, TbX } from 'react-icons/tb'
import { portfolio } from '../data/portfolio'
import { mediaUrl } from '../lib/links'

// Número en formato wa.me: solo dígitos con código de país (51985000716)
export const waNumber = (phone = '') => phone.replace(/\D/g, '')

// Botón flotante de WhatsApp con mini chat. El mensaje se abre en WhatsApp ya escrito.
export default function WhatsAppWidget({ site }) {
  const wa = { ...portfolio.site.whatsapp, ...site.whatsapp }
  const number = waNumber(wa.phone || site.profile.phone)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const panel = useRef(null)
  const input = useRef(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => input.current?.focus(), 250)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!wa.enabled || number.length < 8) return null

  const send = (e) => {
    e?.preventDefault()
    const body = message.trim()
    const text = [wa.prefix, body].filter(Boolean).join('\n\n')
    window.open(`https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`, '_blank', 'noopener,noreferrer')
    setMessage('')
    setOpen(false)
  }

  const avatar = site.about?.image
  const initials = site.profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <div className="fixed right-5 bottom-5 z-[55] flex flex-col items-end gap-4 sm:right-8 sm:bottom-8">
      {/* Ventana de chat */}
      <div
        ref={panel}
        role="dialog"
        aria-label={wa.title}
        aria-hidden={!open}
        className={`w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right overflow-hidden rounded-2xl bg-[#0b141a] shadow-2xl shadow-black/60 transition-all duration-300 ease-out ${
          open ? 'visible scale-100 opacity-100' : 'invisible translate-y-4 scale-90 opacity-0'
        }`}
      >
        <header className="flex items-center gap-3 bg-[#075e54] px-4 py-3">
          <div className="relative">
            {avatar ? (
              <img src={mediaUrl(avatar)} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366]/20 font-display font-bold text-white">
                {initials}
              </span>
            )}
            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#075e54] bg-[#25d366]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display font-semibold text-white">{wa.title}</p>
            <p className="truncate text-xs text-white/70">{wa.status}</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-2xl text-white/80 hover:text-white" aria-label="Cerrar">
            <TbX />
          </button>
        </header>

        <div className="bg-[#0b141a] bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] px-4 py-5">
          <div className="relative max-w-[85%] rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2 text-sm leading-relaxed text-[#e9edef] shadow">
            <p className="mb-1 text-xs font-semibold text-[#25d366]">{site.profile.name}</p>
            <p className="whitespace-pre-line">{wa.greeting}</p>
          </div>
        </div>

        <form onSubmit={send} className="flex items-end gap-2 bg-[#202c33] p-3">
          <textarea
            ref={input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) send(e)
            }}
            rows={1}
            maxLength={1000}
            placeholder={wa.placeholder}
            data-lenis-prevent
            className="max-h-32 min-h-11 flex-1 resize-none rounded-lg bg-[#2a3942] px-3 py-2.5 font-sans text-sm text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-xl text-[#0b141a] transition-transform hover:scale-105"
            aria-label="Enviar por WhatsApp"
          >
            <TbSend2 />
          </button>
        </form>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-3xl text-white shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-30 [animation-duration:2.5s]" />}
        <span className={`relative transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>{open ? <TbX /> : <FaWhatsapp />}</span>
        {!open && (
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-md bg-ink px-3 py-1.5 font-mono text-xs whitespace-nowrap text-deep opacity-0 shadow transition-opacity group-hover:opacity-100 sm:block">
            ¿Hablamos?
          </span>
        )}
      </button>
    </div>
  )
}
