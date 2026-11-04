import { useEffect, useRef, useState } from 'react'
import { TbArrowUp, TbArrowDown, TbTrash, TbPlus, TbChevronDown, TbPhoto, TbUpload, TbX, TbSearch } from 'react-icons/tb'
import { uploadImage } from './api'
import { mediaUrl } from '../lib/links'

export const inputCls =
  'w-full rounded-md border border-line bg-deep px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-mauve focus:outline-none'

// ── Contenedores ────────────────────────────────────────────
export function Card({ title, description, children, aside }) {
  return (
    <section className="rounded-xl border border-line/70 bg-surface p-5 sm:p-6">
      {(title || aside) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-xl font-bold text-mauve">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {aside}
        </header>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export const Grid = ({ children, cols = 2 }) => (
  <div className={`grid gap-5 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>{children}</div>
)

// ── Campos ──────────────────────────────────────────────────
export function Field({ label, hint, value, onChange, textarea, rows = 3, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">{label}</span>}
      <Tag
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? rows : undefined}
        className={`${inputCls} ${textarea ? 'resize-y leading-relaxed' : ''}`}
        {...props}
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-mauve' : 'bg-line'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-deep transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
      <span className="text-sm text-ink">
        {label}
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// ── Botones pequeños ────────────────────────────────────────
export function IconBtn({ children, danger, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-md p-1.5 text-lg text-muted transition-colors hover:bg-line/60 disabled:opacity-30 ${danger ? 'hover:text-[#ff7b7b]' : 'hover:text-ink'}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function AddButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-3 text-sm text-body transition-colors hover:border-mauve hover:text-mauve"
    >
      <TbPlus /> {children}
    </button>
  )
}

// ── Lista editable (agregar, quitar, reordenar) ─────────────
export function ListEditor({ items = [], onChange, newItem, render, itemTitle, addLabel = 'Agregar', compact }) {
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const copy = [...items]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }
  const remove = (i) => onChange(items.filter((_, k) => k !== i))
  const update = (i, patch) =>
    onChange(items.map((it, k) => (k === i ? (it && typeof it === 'object' && typeof patch === 'object' ? { ...it, ...patch } : patch) : it)))
  const add = () => onChange([...items, typeof newItem === 'function' ? newItem() : structuredClone(newItem)])

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className={`rounded-lg border border-line bg-deep/50 ${compact ? 'p-3' : 'p-4'}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="truncate text-sm font-medium text-mauve">{itemTitle ? itemTitle(item, i) : `#${i + 1}`}</span>
            <div className="flex shrink-0">
              <IconBtn title="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
                <TbArrowUp />
              </IconBtn>
              <IconBtn title="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                <TbArrowDown />
              </IconBtn>
              <IconBtn title="Eliminar" danger onClick={() => remove(i)}>
                <TbTrash />
              </IconBtn>
            </div>
          </div>
          {render(item, (patch) => update(i, patch), i)}
        </div>
      ))}
      <AddButton onClick={add}>{addLabel}</AddButton>
    </div>
  )
}

// ── Botones de la web (texto + enlace + estilo) ─────────────
export function ButtonsEditor({ buttons, onChange }) {
  return (
    <ListEditor
      items={buttons}
      onChange={onChange}
      compact
      addLabel="Agregar botón"
      newItem={{ label: 'Nuevo botón', url: '/contact', variant: 'primary' }}
      itemTitle={(b) => b.label || 'Botón sin texto'}
      render={(b, update) => (
        <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_160px]">
          <Field label="Texto" value={b.label} onChange={(v) => update({ label: v })} />
          <Field
            label="Enlace"
            value={b.url}
            onChange={(v) => update({ url: v })}
            placeholder="/projects · https://... · mailto:..."
          />
          <Select
            label="Estilo"
            value={b.variant}
            onChange={(v) => update({ variant: v })}
            options={[
              { value: 'primary', label: 'Relleno' },
              { value: 'outline', label: 'Contorno' },
            ]}
          />
        </div>
      )}
    />
  )
}

export const LINK_HINT = 'Rutas de la web: / · /about · /projects · /contact — o externas: https://... · mailto:correo · tel:+51...'

// ── Selector de icono con buscador ──────────────────────────
export function IconPicker({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const current = options[value]
  const term = q.trim().toLowerCase()
  const list = Object.entries(options).filter(([k, o]) => !term || k.includes(term) || o.label.toLowerCase().includes(term))

  return (
    <div ref={ref} className="relative">
      {label && <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">{label}</span>}
      <button type="button" onClick={() => setOpen((v) => !v)} className={`${inputCls} flex items-center gap-2 text-left`}>
        {current ? <current.Icon className="shrink-0 text-lg" style={{ color: current.color }} /> : null}
        <span className="flex-1 truncate">{current?.label || 'Elegir icono'}</span>
        <TbChevronDown className="text-muted" />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 w-80 max-w-[85vw] rounded-lg border border-line bg-surface p-3 shadow-2xl shadow-black/60">
          <label className="flex items-center gap-2 rounded-md border border-line bg-deep px-2">
            <TbSearch className="text-muted" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="w-full bg-transparent py-2 text-sm text-ink focus:outline-none" />
          </label>
          <div className="mt-3 grid max-h-64 grid-cols-4 gap-1.5 overflow-y-auto">
            {list.map(([k, o]) => (
              <button
                key={k}
                type="button"
                title={o.label}
                onClick={() => {
                  onChange(k)
                  setOpen(false)
                  setQ('')
                }}
                className={`flex flex-col items-center gap-1 rounded-md p-2 transition-colors hover:bg-line/60 ${k === value ? 'bg-line/80 ring-1 ring-mauve' : ''}`}
              >
                <o.Icon className="text-xl" style={{ color: o.color }} />
                <span className="w-full truncate text-center text-[10px] text-body">{o.label}</span>
              </button>
            ))}
            {!list.length && <p className="col-span-4 py-4 text-center text-xs text-muted">Sin resultados</p>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Imagen: subir archivo o pegar URL ───────────────────────
export function ImageInput({ label, value, onChange, hint, contain, previewClass = 'aspect-video w-36' }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">{label}</span>}
      <div className="flex flex-wrap items-start gap-4">
        <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-deep ${previewClass}`}>
          {value ? (
            <img src={mediaUrl(value)} alt="" className={`h-full w-full ${contain ? 'object-contain p-2' : 'object-cover'}`} />
          ) : (
            <TbPhoto className="text-3xl text-muted/50" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 rounded-md bg-mauve px-3 py-2 text-sm text-deep transition-colors hover:bg-ink disabled:opacity-60"
            >
              <TbUpload /> {busy ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="flex items-center gap-1 rounded-md border border-line px-3 py-2 text-sm text-body hover:text-ink">
                <TbX /> Quitar
              </button>
            )}
          </div>
          <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="…o pega una URL https://" className={`${inputCls} text-xs`} />
          {hint && <span className="text-xs text-muted">{hint}</span>}
          {error && <span className="text-xs text-[#ff7b7b]">✖ {error}</span>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  )
}

// ── Etiquetas (Enter o coma para agregar) ───────────────────
export function TagInput({ label, value = [], onChange, placeholder = 'Escribe y pulsa Enter' }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))])
    setDraft('')
  }
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">{label}</span>}
      <div className={`${inputCls} flex flex-wrap items-center gap-2`}>
        {value.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded bg-line/70 px-2 py-0.5 text-xs text-ink">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-muted hover:text-ink" aria-label={`Quitar ${t}`}>
              <TbX />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add()
            } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
          }}
          onBlur={add}
          placeholder={value.length ? '' : placeholder}
          className="min-w-24 flex-1 bg-transparent focus:outline-none"
        />
      </div>
    </label>
  )
}

// ── Avisos ──────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={`fixed right-5 bottom-5 z-[80] max-w-sm rounded-lg px-4 py-3 text-sm shadow-2xl ${
        toast.type === 'error' ? 'bg-[#4a1f24] text-[#ffb4b4]' : 'bg-mauve text-deep'
      }`}
    >
      {toast.type === 'error' ? '✖ ' : '✔ '}
      {toast.text}
    </div>
  )
}
