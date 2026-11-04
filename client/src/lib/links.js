export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Las imágenes subidas se guardan como "/api/media/<id>" → hay que anteponer la URL de la API
export const mediaUrl = (src) => (src && src.startsWith('/api/') ? `${API_URL}${src}` : src || '')

// Enlace interno de la web (/about, /projects...) → navegación con transición
export const isInternal = (url = '') => url.startsWith('/') && !url.startsWith('//')

// Enlaces externos se abren en otra pestaña (excepto mailto:, tel: y #)
export const isExternal = (url = '') => /^https?:\/\//i.test(url)

// Reemplaza {year} y {name} en textos como el copyright
export const fillTemplate = (text = '', vars = {}) =>
  text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
