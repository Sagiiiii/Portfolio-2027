import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaAndroid, FaApple } from 'react-icons/fa6'
import { TbX, TbShare2, TbSquarePlus, TbDotsVertical, TbDownload, TbCircleCheck } from 'react-icons/tb'
import { canPromptInstall, isAndroid, isIOS, isStandalone, promptInstall, subscribeInstall } from '../lib/install'

// Pasos para instalar a mano (cuando el navegador no permite hacerlo desde un botón)
const GUIDES = {
  ios: {
    title: 'Instalar en iPhone / iPad',
    intro: 'Apple no permite instalar desde un botón, pero son solo 2 pasos:',
    steps: [
      { Icon: TbShare2, text: 'Toca el botón Compartir (el cuadrado con la flecha hacia arriba) en la barra de Safari.' },
      { Icon: TbSquarePlus, text: 'Elige «Agregar a pantalla de inicio» y pulsa «Agregar».' },
    ],
    note: 'Si no ves la opción, abre esta página en Safari.',
  },
  android: {
    title: 'Instalar en Android',
    intro: 'Tu navegador no mostró la instalación automática. Hazlo así:',
    steps: [
      { Icon: TbDotsVertical, text: 'Toca el menú ⋮ (arriba a la derecha) de Chrome.' },
      { Icon: TbDownload, text: 'Elige «Instalar aplicación» o «Agregar a pantalla principal».' },
    ],
    note: 'Funciona en Chrome, Edge y Samsung Internet.',
  },
}

function GuideModal({ type, onClose }) {
  const g = GUIDES[type]
  useEffect(() => {
    window.lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Portal al <body>: el footer tiene transformaciones (animaciones) que romperían el "fixed"
  return createPortal(
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div role="dialog" aria-label={g.title} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
            <h3 className="font-display text-xl font-bold text-ink">{g.title}</h3>
          </div>
          <button onClick={onClose} className="text-2xl text-muted hover:text-ink" aria-label="Cerrar">
            <TbX />
          </button>
        </div>
        <p className="mt-4 text-sm text-body">{g.intro}</p>
        <ol className="mt-5 space-y-4">
          {g.steps.map(({ Icon, text }, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mauve/15 text-xl text-mauve">
                <Icon />
              </span>
              <p className="pt-2 text-sm leading-relaxed text-ink">
                <span className="mr-1 font-bold text-mauve">{i + 1}.</span> {text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-muted">{g.note}</p>
        <button onClick={onClose} className="btn-primary mt-6 w-full !py-3 !text-sm">
          Entendido
        </button>
      </div>
    </div>,
    document.body,
  )
}

// Botones "Descargar en Android" y "Descargar en iPhone" (instalan la web como app)
export default function InstallButtons({ title, androidLabel, iosLabel }) {
  const [, force] = useState(0)
  const [guide, setGuide] = useState(null) // 'ios' | 'android' | null
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setInstalled(isStandalone())
    return subscribeInstall(() => force((n) => n + 1))
  }, [])

  // Si ya la abrieron como app, no tiene sentido mostrar los botones
  if (installed) {
    return (
      <p className="flex items-center gap-2 text-sm text-mauve">
        <TbCircleCheck /> App instalada
      </p>
    )
  }

  const onAndroid = async () => {
    if (canPromptInstall()) {
      const result = await promptInstall()
      if (result === 'accepted') setInstalled(true)
      if (result !== 'unavailable') return
    }
    setGuide(isIOS() ? 'ios' : 'android')
  }

  const onIOS = () => {
    // En Android/escritorio con instalación disponible, el botón de iPhone también la ofrece
    if (!isIOS() && isAndroid() && canPromptInstall()) return onAndroid()
    setGuide('ios')
  }

  const btn =
    'flex items-center gap-2 rounded-lg border-2 border-body/70 px-3 py-1.5 text-left text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-deep'

  return (
    <div>
      {title && <p className="mb-3 text-sm text-muted">{title}</p>}
      {/* Lado a lado */}
      <div className="flex gap-2">
        <button type="button" onClick={onAndroid} className={btn}>
          <FaAndroid className="shrink-0 text-xl text-[#3DDC84]" />
          <span className="leading-tight">
            <span className="block text-[9px] tracking-wider whitespace-nowrap uppercase opacity-70">Descargar en</span>
            <span className="block font-display text-sm font-semibold whitespace-nowrap">{androidLabel || 'Android'}</span>
          </span>
        </button>
        <button type="button" onClick={onIOS} className={btn}>
          <FaApple className="shrink-0 text-xl" />
          <span className="leading-tight">
            <span className="block text-[9px] tracking-wider whitespace-nowrap uppercase opacity-70">Descargar en</span>
            <span className="block font-display text-sm font-semibold whitespace-nowrap">{iosLabel || 'iPhone'}</span>
          </span>
        </button>
      </div>
      {guide && <GuideModal type={guide} onClose={() => setGuide(null)} />}
    </div>
  )
}
