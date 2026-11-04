import { useRef } from 'react'
import { TLink } from './PageTransition'
import { NAV } from './Navbar'
import { gsap, useGSAP } from '../lib/gsap'
import { fillTemplate, isExternal } from '../lib/links'

export default function Footer({ site }) {
  const ref = useRef(null)
  const { profile, footer, socials } = site

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.ft-col', {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <footer ref={ref} className="bg-surface">
      <div className="container-x grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1.3fr_0.8fr]">
        <div className="ft-col">
          <h3 className="font-display text-3xl font-bold text-mauve">{profile.name}</h3>
          <p className="mt-4 leading-relaxed whitespace-pre-line text-body">{footer.description}</p>
        </div>

        <div className="ft-col">
          <h4 className="text-2xl font-semibold text-mauve">{footer.linksTitle}</h4>
          <ul className="mt-5 space-y-3">
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <TLink to={to} className="text-body transition-colors hover:text-ink">
                  {label}
                </TLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-col">
          <h4 className="text-2xl font-semibold text-mauve">{footer.contactTitle}</h4>
          <ul className="mt-5 space-y-3 [overflow-wrap:anywhere] lg:[overflow-wrap:normal]">
            {profile.phone && (
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="text-body hover:text-ink">
                  {profile.phone}
                </a>
              </li>
            )}
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="text-body hover:text-ink">
                  {profile.email}
                </a>
              </li>
            )}
            {profile.location && <li className="text-muted">{profile.location}</li>}
          </ul>
        </div>

        <div className="ft-col">
          <h4 className="text-2xl font-semibold text-mauve">{footer.socialsTitle}</h4>
          <ul className="mt-5 space-y-3">
            {socials.map((s, i) => (
              <li key={`${s.name}-${i}`}>
                <a href={s.url} {...(isExternal(s.url) && { target: '_blank', rel: 'noreferrer' })} className="text-body hover:text-ink">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-deep">
        <p className="container-x py-5 text-sm text-muted">
          {fillTemplate(footer.copyright, { year: new Date().getFullYear(), name: profile.name })}
        </p>
      </div>
    </footer>
  )
}
