import ActionButtons from '../ActionButtons'
import Portrait from '../Portrait'

export default function AboutTeaser({ about, name }) {
  return (
    <section className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2">
      <div>
        {about.eyebrow && (
          <p data-anim="fade" className="eyebrow mb-3">
            {about.eyebrow}
          </p>
        )}
        <h2 data-anim="heading" className="title-xl">
          {about.title}
        </h2>
        <p data-anim="lines" className="mt-8 max-w-lg text-lg leading-relaxed whitespace-pre-line text-body">
          {about.text}
        </p>
        <div data-anim="fade" data-delay="0.2">
          <ActionButtons buttons={about.buttons} className="mt-10" />
        </div>
      </div>

      <Portrait src={about.image} name={name} className="aspect-[5/5.3] w-full" />
    </section>
  )
}
