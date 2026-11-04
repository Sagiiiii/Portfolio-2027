import { useRef, useState } from 'react'
import { TbDownload, TbChevronDown } from 'react-icons/tb'
import { usePortfolio } from '../hooks/usePortfolio'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { getTechIcon } from '../lib/icons'
import { formatPeriod } from '../lib/format'
import Portrait from '../components/Portrait'
import Magnetic from '../components/Magnetic'
import CallToAction from '../components/CallToAction'
import { TLink } from '../components/PageTransition'

function Block({ title, children }) {
  return (
    <section className="container-x py-14 sm:py-20">
      <h2 data-anim="heading" className="font-display text-4xl font-bold text-mauve uppercase sm:text-5xl">
        {title}
      </h2>
      <div data-anim="stagger" className="mt-10 space-y-5">
        {children}
      </div>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-8">
      <h3 className="text-2xl font-semibold text-mauve">{label}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function ExperienceRow({ job }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line/60 pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid w-full gap-3 text-left sm:grid-cols-[220px_1fr_auto] sm:items-center sm:gap-8"
        aria-expanded={open}
      >
        <span className="font-display text-2xl font-semibold text-mauve">{job.company}</span>
        <span className="flex flex-wrap items-center gap-3">
          <span className="chip">{job.role}</span>
          <span className="text-sm text-muted">
            {formatPeriod(job.start)} — {formatPeriod(job.end)}
          </span>
        </span>
        <TbChevronDown className={`hidden text-2xl text-body transition-transform duration-500 sm:block ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <ul className="space-y-2 pt-5 sm:pl-[252px]">
            {job.description?.map((d, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-body">
                <span className="text-mauve">—</span>
                {d}
              </li>
            ))}
          </ul>
          {job.tech?.length > 0 && <p className="pt-3 text-sm text-muted sm:pl-[252px]">{job.tech.join(' · ')}</p>}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const { data } = usePortfolio()
  const { education, skills, experience } = data
  const { profile, about } = data.site
  const root = useRef(null)
  useScrollAnimations(root, [data])

  return (
    <div ref={root} className="pt-32">
      <section className="container-x grid items-center gap-14 pb-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p data-anim="fade" className="flex flex-wrap items-center gap-3 text-xl text-body sm:text-2xl">
            Hola, soy <span className="chip text-xl text-ink sm:text-2xl">{profile.name}</span>
          </p>
          <h1 data-anim="heading" className="mt-6 font-display text-4xl leading-tight font-bold text-mauve sm:text-5xl">
            {profile.headline}
          </h1>
          {profile.bio?.map((p, i) => (
            <p key={i} data-anim="lines" className="mt-6 text-lg leading-relaxed text-body">
              {p}
            </p>
          ))}
          <div data-anim="fade" className="mt-10">
            <Magnetic>
              {profile.cv ? (
                <a href={profile.cv} target="_blank" rel="noreferrer" className="btn-primary">
                  <TbDownload /> Descargar CV
                </a>
              ) : (
                <TLink to="/contact" className="btn-primary">
                  Contáctame
                </TLink>
              )}
            </Magnetic>
          </div>
        </div>
        <Portrait src={about.image} name={profile.name} className="aspect-[4/5] w-full border-2 border-ink/80" />
      </section>

      {education?.length > 0 && (
        <Block title="Educación">
          {education.map((ed) => (
            <Row key={`${ed.institution}-${ed.title}`} label={ed.institution}>
              <span className="chip">{ed.title}</span>
              <span className="text-sm text-muted">
                {formatPeriod(ed.start)} — {formatPeriod(ed.end)}
              </span>
            </Row>
          ))}
        </Block>
      )}

      {skills?.length > 0 && (
        <Block title="Mis habilidades">
          {skills.map((g) => (
            <Row key={g.category} label={g.category.charAt(0).toUpperCase() + g.category.slice(1)}>
              {g.items.map((s) => {
                const { Icon, color } = getTechIcon(s.icon)
                return (
                  <span key={s.name} className="chip group transition-transform duration-300 hover:-translate-y-1">
                    <Icon className="text-muted transition-colors duration-300 group-hover:text-[var(--c)]" style={{ '--c': color }} />
                    {s.name}
                  </span>
                )
              })}
            </Row>
          ))}
        </Block>
      )}

      {experience?.length > 0 && (
        <Block title="Experiencias">
          {experience.map((job) => (
            <ExperienceRow key={`${job.company}-${job.start}`} job={job} />
          ))}
        </Block>
      )}

      <CallToAction />
    </div>
  )
}
