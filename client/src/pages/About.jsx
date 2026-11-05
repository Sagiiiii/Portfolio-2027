import { useRef } from 'react'
import { TbMapPin, TbWifi, TbStack2, TbBriefcase, TbSchool, TbLanguage, TbLayoutKanban, TbCertificate } from 'react-icons/tb'
import { usePortfolio } from '../hooks/usePortfolio'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { getEducationIcon } from '../lib/icons'
import { formatPeriod } from '../lib/format'
import { getAboutPage } from '../lib/aboutPage'
import Portrait from '../components/Portrait'
import CvButton from '../components/CvButton'
import ActionButtons from '../components/ActionButtons'
import StackIcon from '../components/StackIcon'
import Magnetic from '../components/Magnetic'
import CallToAction from '../components/CallToAction'
import CertificatesGallery from '../components/CertificatesGallery'
import { TLink } from '../components/PageTransition'

// ── Utilidades ──────────────────────────────────────────────
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// "Ene 2024 – Actualidad" · "2023 – 2025" · "2024" · o el texto personalizado
function periodText({ start, end, periodLabel }, { current = false } = {}) {
  if (periodLabel) return periodLabel
  if (!start && !end) return current ? 'Actualidad' : ''
  const a = cap(formatPeriod(start))
  if (!end) return current ? `${a} – Actualidad` : a
  const b = cap(formatPeriod(end))
  return a === b ? a : `${a} – ${b}`
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-3xl font-bold text-mauve sm:text-4xl">
      <Icon className="shrink-0 text-2xl text-mauve/70 sm:text-3xl" />
      <span data-anim="heading">{children}</span>
    </h2>
  )
}

const Badge = ({ children }) => (
  <span className="inline-block rounded-md border border-mauve/40 px-2.5 py-1 font-mono text-xs whitespace-nowrap text-mauve">
    {children}
  </span>
)

const Panel = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-line/70 bg-surface/60 p-6 sm:p-7 ${className}`}>{children}</div>
)

// ── Secciones ───────────────────────────────────────────────
function Skills({ title, groups }) {
  if (!groups?.length) return null
  return (
    <section className="container-x py-16 sm:py-20">
      <SectionTitle icon={TbStack2}>{title}</SectionTitle>
      <div data-anim="stagger" className="mt-10 grid gap-5 md:grid-cols-2">
        {groups.map((g, i) => (
          <Panel key={`${g.category}-${i}`}>
            <h3 className="font-mono text-xs font-medium tracking-[0.2em] text-muted uppercase">{g.category}</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {g.items.map((s, j) => (
                <span
                  key={`${s.name}-${j}`}
                  className="group inline-flex items-center gap-2 rounded-md border border-line bg-deep/60 px-3 py-1.5 text-sm text-body transition-all duration-300 hover:-translate-y-0.5 hover:border-mauve/50 hover:text-ink"
                >
                  <StackIcon item={s} className="text-base" imgClassName="h-4 w-4" />
                  {s.name}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  )
}

function Experience({ title, items }) {
  if (!items?.length) return null
  return (
    <div>
      <SectionTitle icon={TbBriefcase}>{title}</SectionTitle>
      <ol data-anim="stagger" className="relative mt-10 ml-2 border-l border-line">
        {items.map((job, i) => {
          const current = !job.end && !job.periodLabel
          return (
            <li key={`${job.company}-${job.role}-${i}`} className="relative pb-10 pl-8 last:pb-0">
              <span
                className={`absolute top-1.5 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-canvas ${
                  current ? 'bg-mauve shadow-[0_0_0_4px_rgba(196,182,186,0.2)]' : 'bg-mauve/60'
                }`}
              />
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-xl font-semibold text-ink">{job.role}</h3>
                {periodText(job, { current: true }) && <Badge>{periodText(job, { current: true })}</Badge>}
              </div>
              <p className="mt-1 font-medium text-mauve">{job.company}</p>
              {(job.location || job.mode) && (
                <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
                  {job.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <TbMapPin /> {job.location}
                    </span>
                  )}
                  {job.mode && (
                    <span className="inline-flex items-center gap-1.5">
                      <TbWifi /> {job.mode}
                    </span>
                  )}
                </p>
              )}
              {job.description && <p className="mt-3 leading-relaxed whitespace-pre-line text-body">{job.description}</p>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Languages({ title, items }) {
  if (!items?.length) return null
  return (
    <Panel>
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-mauve">
        <TbLanguage /> {title}
      </h3>
      <ul className="mt-5 space-y-5">
        {items.map((l, i) => (
          <li key={`${l.name}-${i}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-ink">{l.name}</span>
              <span className="text-right text-mauve">{l.level}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div data-anim="bar" className="h-full origin-left rounded-full bg-mauve" style={{ width: `${Math.min(100, Math.max(0, l.percent ?? 0))}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Methodologies({ title, items }) {
  const list = (items ?? []).filter(Boolean)
  if (!list.length) return null
  return (
    <Panel>
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-mauve">
        <TbLayoutKanban /> {title}
      </h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {list.map((m, i) => (
          <Badge key={`${m}-${i}`}>{m}</Badge>
        ))}
      </div>
    </Panel>
  )
}

function Certifications({ title, items }) {
  if (!items?.length) return null
  return (
    <Panel>
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-mauve">
        <TbCertificate /> {title}
      </h3>
      <ul className="mt-3 divide-y divide-line/60">
        {items.map((c, i) => (
          <li key={`${c.name}-${i}`} className="flex items-start justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="font-medium text-ink">{c.name}</p>
              {c.issuer && <p className="text-sm text-muted">{c.issuer}</p>}
            </div>
            {c.date && <Badge>{c.date}</Badge>}
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Education({ title, items }) {
  if (!items?.length) return null
  return (
    <section className="container-x py-16 sm:py-20">
      <SectionTitle icon={TbSchool}>{title}</SectionTitle>
      <div data-anim="stagger" className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {items.map((ed, i) => {
          const Icon = getEducationIcon(ed.icon)
          const period = periodText(ed)
          return (
            <div key={`${ed.institution}-${ed.title}-${i}`} className="group flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-mauve/40 text-2xl text-mauve transition-colors duration-300 group-hover:bg-mauve group-hover:text-deep">
                <Icon />
              </span>
              <div className="min-w-0">
                {period && <Badge>{period}</Badge>}
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{ed.title}</h3>
                <p className="font-medium text-mauve">{ed.institution}</p>
                {(ed.location || ed.details) && (
                  <p className="mt-1 text-sm text-muted">{[ed.location, ed.details].filter(Boolean).join(' — ')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Página ──────────────────────────────────────────────────
export default function About() {
  const { data } = usePortfolio()
  const site = data.site
  const { profile, about, hero } = site
  const titles = { ...data.site.resumeTitles }
  const aboutPage = getAboutPage(site)
  const root = useRef(null)
  useScrollAnimations(root, [data])

  // Titular largo → letra más pequeña para que no ocupe media pantalla
  const headline = profile.headline || ''
  const headlineSize =
    headline.length > 70
      ? 'text-2xl sm:text-3xl lg:text-[2rem]'
      : headline.length > 40
        ? 'text-3xl sm:text-4xl'
        : 'text-4xl sm:text-5xl'
  const showCv = aboutPage.showCv && profile.cv
  const hasButtons = showCv || aboutPage.buttons.some((b) => b.label)
  const hasSide = site.languages?.length || site.methodologies?.length || site.certifications?.length

  return (
    <div ref={root} className="pt-32">
      {/* Presentación */}
      <section className="container-x grid items-start gap-12 pb-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p data-anim="fade" className="flex flex-wrap items-center gap-3 text-xl text-body sm:text-2xl">
            Hola, soy <span className="chip text-xl text-ink sm:text-2xl">{profile.name}</span>
          </p>
          {headline && (
            <h1 data-anim="heading" className={`mt-6 font-display leading-[1.15] font-bold text-balance text-mauve ${headlineSize}`}>
              {headline}
            </h1>
          )}
          <div className="mt-8 h-px w-24 bg-mauve/40" />
          {profile.bio?.map((p, i) => (
            <p key={i} data-anim="lines" className="mt-6 max-w-2xl text-base leading-8 text-body sm:text-lg">
              {p}
            </p>
          ))}
          <div data-anim="fade" className="mt-10">
            {hasButtons ? (
              <ActionButtons buttons={aboutPage.buttons} childrenFirst>
                {showCv && <CvButton profile={profile} config={{ label: hero.cvButton?.label }} variant="primary" />}
              </ActionButtons>
            ) : (
              <Magnetic>
                <TLink to="/contact" className="btn-primary">
                  Contáctame
                </TLink>
              </Magnetic>
            )}
          </div>
        </div>

        {/* La foto acompaña al texto mientras se hace scroll */}
        <div className="order-1 lg:sticky lg:top-28 lg:order-2">
          <Portrait
            src={about.image}
            name={profile.name}
            className="mx-auto aspect-[4/5] w-full max-w-md border-2 border-ink/80 lg:max-w-none"
          />
        </div>
      </section>

      <Skills title={titles.skills || 'Stack tecnológico'} groups={site.skills} />

      {/* Experiencia + columna lateral (idiomas, metodologías, certificaciones) */}
      {(site.experience?.length > 0 || hasSide) && (
        <section className={`container-x grid items-start gap-12 py-16 sm:py-20 ${hasSide ? 'lg:grid-cols-[1.7fr_1fr]' : ''}`}>
          <Experience title={titles.experience || 'Experiencia profesional'} items={site.experience} />
          {hasSide ? (
            <aside data-anim="stagger" className="space-y-6 lg:sticky lg:top-28">
              <Languages title={titles.languages || 'Idiomas'} items={site.languages} />
              <Methodologies title={titles.methodologies || 'Metodologías'} items={site.methodologies} />
              <Certifications title={titles.certifications || 'Certificaciones'} items={site.certifications} />
            </aside>
          ) : null}
        </section>
      )}

      <Education title={titles.education || 'Formación académica'} items={site.education} />

      <CertificatesGallery title={titles.certificates || 'Mis certificados'} items={site.certificates ?? []} />

      <CallToAction />
    </div>
  )
}
