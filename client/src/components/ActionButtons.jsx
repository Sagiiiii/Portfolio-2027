import Magnetic from './Magnetic'
import SmartLink from './SmartLink'
import { getSocialIcon } from '../lib/icons'

// Botones configurables desde el panel: [{ label, url, variant: 'primary' | 'outline', icon? }]
// children: botones extra al principio (ej: "Descargar CV")
export default function ActionButtons({ buttons = [], className = '', children, childrenFirst = false }) {
  const list = buttons.filter((b) => b.label)
  if (!list.length && !children) return null
  return (
    <div className={`flex flex-wrap items-center gap-5 ${className}`}>
      {childrenFirst && children}
      {list.map((b, i) => {
        const Icon = b.icon ? getSocialIcon(b.icon) : null
        return (
          <Magnetic key={`${b.label}-${i}`}>
            <SmartLink url={b.url} className={b.variant === 'outline' ? 'btn-outline' : 'btn-primary'}>
              {Icon && <Icon />} {b.label}
            </SmartLink>
          </Magnetic>
        )
      })}
      {!childrenFirst && children}
    </div>
  )
}
