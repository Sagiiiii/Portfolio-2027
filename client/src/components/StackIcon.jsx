import { getTechIcon } from '../lib/icons'
import { mediaUrl } from '../lib/links'

// Icono de una tecnología: imagen subida (si existe) o icono de la lista
export default function StackIcon({ item, className = 'text-2xl', imgClassName = 'h-7 w-7' }) {
  if (item?.image) {
    return <img src={mediaUrl(item.image)} alt={item.name} className={`object-contain ${imgClassName}`} loading="lazy" />
  }
  const { Icon, color } = getTechIcon(item?.icon)
  return <Icon className={className} style={{ color }} aria-label={item?.name} />
}
