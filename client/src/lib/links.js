// En local la API está en otro puerto; publicada en Vercel está en el mismo dominio (/api)
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '')

// Las imágenes subidas se guardan como "/api/media/<id>" → hay que anteponer la URL de la API
export const mediaUrl = (src) => (src && src.startsWith('/api/') ? `${API_URL}${src}` : src || '')

// Enlace de descarga del CV. Si está subido al panel, fuerza la descarga con un nombre bonito.
export function cvDownloadUrl(cv, personName = '') {
  if (!cv) return ''
  if (!cv.startsWith('/api/media/')) return cv // enlace externo (Drive, Dropbox...)
  const slug = personName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${API_URL}${cv}?download=1&name=${encodeURIComponent(`CV-${slug || 'portfolio'}.pdf`)}`
}

// Enlace interno de la web (/about, /projects...) → navegación con transición
export const isInternal = (url = '') => url.startsWith('/') && !url.startsWith('//')

// Enlaces externos se abren en otra pestaña (excepto mailto:, tel: y #)
export const isExternal = (url = '') => /^https?:\/\//i.test(url)

// Reemplaza {year} y {name} en textos como el copyright
export const fillTemplate = (text = '', vars = {}) =>
  text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
