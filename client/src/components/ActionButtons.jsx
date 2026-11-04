import Magnetic from './Magnetic'
import SmartLink from './SmartLink'

// Botones configurables desde el panel: [{ label, url, variant: 'primary' | 'outline' }]
export default function ActionButtons({ buttons = [], className = '' }) {
  const list = buttons.filter((b) => b.label)
  if (!list.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-5 ${className}`}>
      {list.map((b, i) => (
        <Magnetic key={`${b.label}-${i}`}>
          <SmartLink url={b.url} className={b.variant === 'outline' ? 'btn-outline' : 'btn-primary'}>
            {b.label}
          </SmartLink>
        </Magnetic>
      ))}
    </div>
  )
}
