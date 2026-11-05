import { TbDownload } from 'react-icons/tb'
import Magnetic from './Magnetic'
import { cvDownloadUrl, isExternal } from '../lib/links'

// Botón "Descargar CV". No se muestra si no hay CV subido o si está desactivado en el panel.
export default function CvButton({ profile, config, variant = 'outline' }) {
  const href = cvDownloadUrl(profile?.cv, profile?.name)
  if (!href || config?.show === false) return null
  return (
    <Magnetic>
      <a
        href={href}
        download
        {...(isExternal(profile.cv) && { target: '_blank', rel: 'noreferrer' })}
        className={variant === 'primary' ? 'btn-primary' : 'btn-outline'}
      >
        <TbDownload /> {config?.label || 'Descargar CV'}
      </a>
    </Magnetic>
  )
}
