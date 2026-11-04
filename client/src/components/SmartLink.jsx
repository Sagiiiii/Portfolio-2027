import { TLink } from './PageTransition'
import { isExternal, isInternal } from '../lib/links'

// Enlace que decide solo: ruta interna (con transición), externa (nueva pestaña) o mailto/tel/#
export default function SmartLink({ url = '#', children, ...props }) {
  if (isInternal(url)) {
    return (
      <TLink to={url} {...props}>
        {children}
      </TLink>
    )
  }
  return (
    <a href={url || '#'} {...(isExternal(url) && { target: '_blank', rel: 'noreferrer' })} {...props}>
      {children}
    </a>
  )
}
