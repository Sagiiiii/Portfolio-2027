import { usePortfolio } from '../hooks/usePortfolio'
import ActionButtons from './ActionButtons'

// Bloque "Déjame que te ayude" (textos y botones editables desde el panel)
export default function CallToAction() {
  const { cta } = usePortfolio().data.site
  if (!cta?.title) return null

  return (
    <section className="container-x py-24 sm:py-32">
      <div data-anim="scale" className="relative overflow-hidden rounded-2xl bg-surface px-6 py-16 text-center sm:py-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-mauve/10 blur-3xl" />
        {cta.eyebrow && (
          <p data-anim="fade" className="eyebrow">
            {cta.eyebrow}
          </p>
        )}
        <h2 data-anim="heading" className="mt-2 font-display text-4xl font-bold text-mauve sm:text-6xl">
          {cta.title}
        </h2>
        <div data-anim="fade" data-delay="0.2">
          <ActionButtons buttons={cta.buttons} className="mt-10 justify-center" />
        </div>
      </div>
    </section>
  )
}
