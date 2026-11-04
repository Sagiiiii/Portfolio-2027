import { mediaUrl } from '../lib/links'
// Foto en blanco y negro que se colorea al pasar el ratón. Si no hay foto, muestra las iniciales.
export default function Portrait({ src, name, className = '' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  return (
    <div data-anim="image" className={`group relative overflow-hidden bg-surface ${className}`}>
      {src ? (
        <img
          src={mediaUrl(src)}
          alt={name}
          className="h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
        />
      ) : (
        <div
          data-anim-inner
          className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#1a1a1a)]"
        >
          <span className="font-display text-8xl font-extrabold text-mauve/80">{initials}</span>
        </div>
      )}
    </div>
  )
}
