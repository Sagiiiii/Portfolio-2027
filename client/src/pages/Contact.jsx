import { useRef, useState } from 'react'
import { TbPhone, TbMail, TbCopy, TbCheck } from 'react-icons/tb'
import { usePortfolio } from '../hooks/usePortfolio'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { getSocialIcon } from '../lib/icons'
import { isExternal, API_URL } from '../lib/links'
import SectionHeading from '../components/SectionHeading'
import Magnetic from '../components/Magnetic'

const initial = { name: '', email: '', message: '' }

const inputCls =
  'w-full rounded-md border border-line bg-surface px-4 py-3.5 font-mono text-ink placeholder:text-muted/70 transition-colors focus:border-mauve focus:outline-none'

function InfoCard({ icon: Icon, label, value, href }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="group flex items-center gap-5 rounded-xl bg-surface p-5 sm:p-6">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-line/60 text-2xl text-ink transition-transform duration-500 group-hover:rotate-12">
        <Icon />
      </span>
      <a href={href} className="min-w-0 flex-1 truncate text-lg text-ink hover:text-mauve" aria-label={label}>
        {value}
      </a>
      <button onClick={copy} className="text-xl text-muted hover:text-ink" aria-label={`Copiar ${label}`}>
        {copied ? <TbCheck className="text-mauve" /> : <TbCopy />}
      </button>
    </div>
  )
}

export default function Contact() {
  const { data } = usePortfolio()
  const { profile, socials } = data.site
  const root = useRef(null)
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState(null) // null | 'sending' | 'ok' | 'error'
  const [error, setError] = useState('')
  useScrollAnimations(root, [data])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: e.target.website.value }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'No se pudo enviar el mensaje.')
      setStatus('ok')
      setForm(initial)
    } catch (err) {
      setStatus('error')
      setError(err.message === 'Failed to fetch' ? 'No hay conexión con el servidor.' : err.message)
    }
  }

  return (
    <div ref={root} className="pt-32">
      <section className="container-x pb-10">
        <SectionHeading eyebrow="Ponte en contacto" title="Contacto" />

        <div data-anim="stagger" className="mt-16 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          {profile.phone ? (
            <InfoCard icon={TbPhone} label="teléfono" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, '')}`} />
          ) : (
            <div />
          )}
          <span className="mx-auto hidden h-16 w-px bg-body md:block" />
          <InfoCard icon={TbMail} label="email" value={profile.email} href={`mailto:${profile.email}`} />
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 data-anim="heading" className="font-display text-4xl font-bold text-mauve sm:text-5xl">
              Escríbeme
            </h2>
            <p data-anim="lines" className="mt-6 text-lg leading-relaxed text-body">
              ¿Tienes una idea, un proyecto o una oportunidad? Déjame un mensaje y te responderé lo antes posible.
            </p>
            <div data-anim="fade" className="mt-8 flex gap-3">
              {socials.map(({ name, url, icon }, i) => {
                const Icon = getSocialIcon(icon)
                return (
                  <Magnetic key={`${name}-${i}`}>
                    <a
                      href={url}
                      {...(isExternal(url) && { target: '_blank', rel: 'noreferrer' })}
                      aria-label={name}
                      title={name}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xl text-body transition-colors hover:bg-mauve hover:text-deep"
                    >
                      <Icon />
                    </a>
                  </Magnetic>
                )
              })}
            </div>
          </div>

          <form data-anim="stagger" onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input name="name" required value={form.name} onChange={onChange} placeholder="Tu nombre" className={inputCls} />
              <input name="email" type="email" required value={form.email} onChange={onChange} placeholder="tu@email.com" className={inputCls} />
            </div>
            <textarea
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={onChange}
              placeholder="Hola, me gustaría..."
              className={`${inputCls} resize-none`}
            />
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:cursor-wait disabled:opacity-60">
                {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              {status === 'ok' && <p className="text-mauve">✔ ¡Mensaje enviado! Te responderé pronto.</p>}
              {status === 'error' && <p className="text-[#ff7b7b]">✖ {error}</p>}
            </div>
          </form>
        </div>
      </section>
      <div className="h-16" />
    </div>
  )
}
