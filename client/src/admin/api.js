import { API_URL } from '../lib/links'

const KEY = 'portfolio_admin_token'

export const getToken = () => localStorage.getItem(KEY)
export const setToken = (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY))

// Llamada a la API con el token del admin
export async function api(path, { method = 'GET', body, contentType, headers: extra } = {}) {
  const headers = { ...extra }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const isRaw = body instanceof Blob
  if (body !== undefined) headers['Content-Type'] = isRaw ? contentType || body.type : 'application/json'

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isRaw ? body : JSON.stringify(body),
  }).catch(() => {
    throw new Error('No hay conexión con el servidor. ¿Está corriendo "npm run dev"?')
  })
  const json = await res.json().catch(() => ({}))

  if (res.status === 401 && path !== '/auth/login') {
    setToken(null)
    window.dispatchEvent(new Event('admin:logout'))
  }
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`)
  return json
}

// Reduce la imagen en el navegador (máx. 1600px, WEBP) antes de subirla
async function compressImage(file, maxSize = 1600) {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) return file // SVG y GIF se suben tal cual
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.85))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

// Sube una imagen y devuelve su URL ("/api/media/<id>")
export async function uploadImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen')
  const blob = await compressImage(file)
  if (blob.size > 4 * 1024 * 1024) throw new Error('La imagen supera 4 MB incluso comprimida')
  const { url } = await api('/admin/media', { method: 'POST', body: blob, contentType: blob.type || file.type })
  return url
}

// Sube el CV en PDF (máx. 4 MB) y devuelve su URL ("/api/media/<id>")
export async function uploadPdf(file) {
  if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) throw new Error('El archivo debe ser un PDF')
  if (file.size > 4 * 1024 * 1024) throw new Error('El PDF supera 4 MB. Comprímelo en ilovepdf.com o smallpdf.com')
  const { url } = await api('/admin/media', {
    method: 'POST',
    body: file,
    contentType: 'application/pdf',
    headers: { 'X-Filename': encodeURIComponent(file.name) },
  })
  return url
}

// Actualiza un valor anidado sin mutar: setIn(obj, ['hero', 'tagline'], 'Hola')
export function setIn(obj, path, value) {
  if (!path.length) return value
  const [k, ...rest] = path
  const copy = Array.isArray(obj) ? [...obj] : { ...obj }
  copy[k] = setIn(obj?.[k] ?? {}, rest, value)
  return copy
}
