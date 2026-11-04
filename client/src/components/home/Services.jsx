import SectionHeading from '../SectionHeading'
import { getServiceIcon } from '../../lib/icons'
import { mediaUrl } from '../../lib/links'

export default function Services({ section }) {
  const items = section?.items ?? []
  if (!items.length) return null
  const cols = items.length === 1 ? '' : items.length === 2 || items.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} />
      <div data-anim="stagger" className={`mt-20 grid gap-x-14 gap-y-20 text-center ${cols}`}>
        {items.map((s, i) => {
          const Icon = getServiceIcon(s.icon)
          return (
            <div key={`${s.title}-${i}`} className="group relative px-2">
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-8xl font-extrabold text-ink/[0.03] transition-colors duration-500 group-hover:text-mauve/10">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.image ? (
                <img
                  src={mediaUrl(s.image)}
                  alt=""
                  className="relative mx-auto h-10 w-10 object-contain transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110"
                />
              ) : (
                <Icon className="relative mx-auto text-4xl text-body transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-mauve" />
              )}
              <h3 className="relative mt-4 text-3xl font-semibold text-mauve">{s.title}</h3>
              <p className="relative mt-5 leading-relaxed text-body">{s.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
