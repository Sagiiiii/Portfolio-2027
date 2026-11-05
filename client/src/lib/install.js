// Instalación de la web como app (PWA)
// - Android / Chrome / Edge: el navegador emite "beforeinstallprompt" → se puede abrir su
//   ventana oficial de instalación desde un botón.
// - iPhone / iPad: Apple no permite instalar desde un botón; hay que usar
//   Compartir → "Agregar a pantalla de inicio" (mostramos una guía).

let deferredPrompt = null
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn())

export function initInstall() {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // guardamos el evento para lanzarlo desde nuestro botón
    deferredPrompt = e
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })

  // Service worker: necesario para que la web sea instalable
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('[pwa] service worker:', err))
    })
  }
}

export const subscribeInstall = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const canPromptInstall = () => Boolean(deferredPrompt)

// Abre la ventana oficial de instalación (Android/Chrome). Devuelve 'accepted' | 'dismissed' | 'unavailable'
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable'
  const e = deferredPrompt
  try {
    await e.prompt()
  } catch (err) {
    // El navegador rechazó abrir la ventana → se mostrará la guía manual
    console.warn('[pwa] no se pudo abrir la instalación:', err.message)
    return 'unavailable'
  }
  deferredPrompt = null // el evento solo se puede usar una vez
  const { outcome } = await e.userChoice
  notify()
  return outcome
}

// ¿Ya se está usando como app instalada?
export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const isAndroid = () => /android/i.test(navigator.userAgent)
