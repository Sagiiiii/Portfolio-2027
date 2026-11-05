import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa6'
import {
  TbUser, TbShare, TbId, TbTools, TbFolders, TbSpeakerphone, TbLayoutBottombar, TbMail,
  TbExternalLink, TbLogout, TbLock, TbDeviceFloppy, TbMenu2, TbX, TbStack2, TbBriefcase, TbSchool, TbCertificate, TbAward,
} from 'react-icons/tb'
import { api, getToken, setToken, setIn } from './api'
import { HeroSection, SocialsSection, AboutSection, ServicesSection, CtaSection, FooterSection, WhatsAppSection } from './SiteSections'
import ProjectsManager from './ProjectsManager'
import { SkillsSection, ExperienceSection, EducationSection, ExtrasSection, CertificatesSection } from './ResumeSections'
import { Card, Field, Toast } from './ui'

// Ruta secreta del panel: /admin/<ADMIN_PATH>  (cámbiala en client/.env → VITE_ADMIN_PATH)
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'sagiii'

const TABS = [
  { id: 'hero', label: 'Perfil y portada', Icon: TbUser, Comp: HeroSection },
  { id: 'socials', label: 'Redes sociales', Icon: TbShare, Comp: SocialsSection },
  { id: 'about', label: 'Sobre mí', Icon: TbId, Comp: AboutSection },
  { id: 'skills', label: 'Stack tecnológico', Icon: TbStack2, Comp: SkillsSection },
  { id: 'experience', label: 'Experiencia', Icon: TbBriefcase, Comp: ExperienceSection },
  { id: 'education', label: 'Formación', Icon: TbSchool, Comp: EducationSection },
  { id: 'extras', label: 'Idiomas y certificaciones', Icon: TbCertificate, Comp: ExtrasSection },
  { id: 'certificates', label: 'Mis certificados', Icon: TbAward, Comp: CertificatesSection },
  { id: 'services', label: 'Servicios', Icon: TbTools, Comp: ServicesSection },
  { id: 'projects', label: 'Proyectos', Icon: TbFolders, Comp: ProjectsManager },
  { id: 'cta', label: 'Déjame ayudarte', Icon: TbSpeakerphone, Comp: CtaSection },
  { id: 'footer', label: 'Footer', Icon: TbLayoutBottombar, Comp: FooterSection },
  { id: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp, Comp: WhatsAppSection },
  { id: 'messages', label: 'Mensajes', Icon: TbMail, Comp: Messages },
]

// ── Login ───────────────────────────────────────────────────
function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await api('/auth/login', { method: 'POST', body: { password } })
      setToken(token)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-line bg-surface p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mauve/15 text-2xl text-mauve">
          <TbLock />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Panel de administración</h1>
          <p className="mt-1 text-sm text-muted">Introduce tu contraseña para continuar.</p>
        </div>
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoFocus autoComplete="current-password" />
        {error && <p className="text-sm text-[#ff7b7b]">✖ {error}</p>}
        <button disabled={busy || !password} className="w-full rounded-md bg-mauve py-3 font-medium text-deep hover:bg-ink disabled:opacity-60">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

// ── Mensajes recibidos ──────────────────────────────────────
function Messages({ notify }) {
  const [list, setList] = useState(null)
  useEffect(() => {
    api('/admin/messages')
      .then(setList)
      .catch((err) => notify(err.message, 'error'))
  }, [notify])

  return (
    <Card title="Mensajes del formulario de contacto" description="Los últimos 200 mensajes recibidos desde la página Contacto.">
      {!list && <p className="text-sm text-muted">Cargando…</p>}
      {list?.length === 0 && <p className="text-sm text-muted">Todavía no hay mensajes.</p>}
      {list?.map((m) => (
        <article key={m._id} className="rounded-lg border border-line bg-deep/50 p-4">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-ink">
              {m.name}{' '}
              <a href={`mailto:${m.email}`} className="text-sm font-normal text-link hover:underline">
                {m.email}
              </a>
            </p>
            <time className="text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</time>
          </header>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-body">{m.message}</p>
        </article>
      ))}
    </Card>
  )
}

// ── Panel ───────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('hero')
  const [site, setSite] = useState(null)
  const [saved, setSaved] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const toastTimer = useRef(null)

  const notify = useCallback((text, type = 'ok') => {
    clearTimeout(toastTimer.current)
    setToast({ text, type })
    toastTimer.current = setTimeout(() => setToast(null), type === 'error' ? 6000 : 2500)
  }, [])

  useEffect(() => {
    api('/admin/site')
      .then((s) => {
        setSite(s)
        setSaved(s)
      })
      .catch((err) => notify(err.message, 'error'))
  }, [notify])

  const dirty = useMemo(() => site && saved && JSON.stringify(site) !== JSON.stringify(saved), [site, saved])

  // Aviso al cerrar la pestaña con cambios sin guardar
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = useCallback((path, value) => setSite((s) => setIn(s, path, value)), [])

  const save = async () => {
    setSaving(true)
    try {
      const s = await api('/admin/site', { method: 'PUT', body: site })
      setSite(s)
      setSaved(s)
      notify('Cambios guardados. Recarga la web para verlos.')
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Ctrl + S para guardar
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (dirty && !saving) save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const current = TABS.find((t) => t.id === tab)
  const Comp = current.Comp

  return (
    <div className="min-h-svh lg:pl-64">
      {/* Menú lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-deep transition-transform lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div>
            <p className="font-display text-lg font-bold text-mauve">Panel</p>
            <p className="text-xs text-muted">{site?.profile?.name}</p>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-2xl text-muted lg:hidden" aria-label="Cerrar menú">
            <TbX />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id)
                setMenuOpen(false)
                window.scrollTo(0, 0)
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                tab === id ? 'bg-surface text-ink' : 'text-body hover:bg-surface/60 hover:text-ink'
              }`}
            >
              <Icon className={`text-lg ${tab === id ? 'text-mauve' : ''}`} /> {label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-body hover:bg-surface/60 hover:text-ink">
            <TbExternalLink className="text-lg" /> Ver la web
          </a>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-body hover:bg-surface/60 hover:text-ink">
            <TbLogout className="text-lg" /> Cerrar sesión
          </button>
        </div>
      </aside>
      {menuOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Contenido */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/90 px-5 py-4 backdrop-blur sm:px-8">
        <button onClick={() => setMenuOpen(true)} className="text-2xl text-ink lg:hidden" aria-label="Abrir menú">
          <TbMenu2 />
        </button>
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <current.Icon className="text-mauve" /> {current.label}
        </h1>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 pb-32 sm:px-8">
        {site ? <Comp site={site} set={set} notify={notify} /> : <p className="text-sm text-muted">Cargando…</p>}
      </main>

      {/* Barra de guardado */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-40 border-t border-line bg-surface/95 backdrop-blur transition-transform duration-300 lg:left-64 ${
          dirty ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <p className="text-sm text-body">Tienes cambios sin guardar</p>
          <div className="flex gap-3">
            <button onClick={() => setSite(saved)} className="rounded-md border border-line px-4 py-2.5 text-sm text-body hover:text-ink">
              Descartar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-mauve px-5 py-2.5 text-sm font-medium text-deep hover:bg-ink disabled:opacity-60"
            >
              <TbDeviceFloppy /> {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  )
}

export default function AdminApp() {
  const { key } = useParams()
  const [authed, setAuthed] = useState(() => (getToken() ? null : false)) // null = comprobando

  useEffect(() => {
    document.title = 'Panel · Portfolio'
    if (authed === null) {
      api('/auth/me')
        .then(() => setAuthed(true))
        .catch(() => setAuthed(false))
    }
    const onLogout = () => setAuthed(false)
    window.addEventListener('admin:logout', onLogout)
    return () => window.removeEventListener('admin:logout', onLogout)
  }, [authed])

  // Ruta incorrecta → como si no existiera
  if (key !== ADMIN_PATH) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="title-xl mt-3">Página no encontrada</h1>
        <a href="/" className="btn-primary mt-10">
          Volver al inicio
        </a>
      </div>
    )
  }

  if (authed === null) return <p className="p-10 text-sm text-muted">Comprobando sesión…</p>
  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  return (
    <Dashboard
      onLogout={() => {
        setToken(null)
        setAuthed(false)
      }}
    />
  )
}
