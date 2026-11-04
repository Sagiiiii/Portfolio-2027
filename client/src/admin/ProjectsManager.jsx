import { useEffect, useState } from 'react'
import { TbArrowUp, TbArrowDown, TbTrash, TbPencil, TbEyeOff, TbStarFilled } from 'react-icons/tb'
import { api } from './api'
import { mediaUrl } from '../lib/links'
import { Card, Grid, Field, Toggle, ImageInput, TagInput, IconBtn, AddButton } from './ui'

const EMPTY = { title: '', description: '', image: '', tags: [], repo: '', demo: '', featured: false, published: true }

// Formulario de un proyecto (crear o editar)
function ProjectForm({ initial, onCancel, onSaved, notify }) {
  const [p, setP] = useState(initial)
  const [saving, setSaving] = useState(false)
  const set = (patch) => setP((prev) => ({ ...prev, ...patch }))
  const isNew = !initial._id

  const save = async (e) => {
    e.preventDefault()
    if (!p.title.trim()) return notify('El proyecto necesita un título', 'error')
    setSaving(true)
    try {
      const saved = isNew
        ? await api('/admin/projects', { method: 'POST', body: p })
        : await api(`/admin/projects/${p._id}`, { method: 'PUT', body: p })
      notify(isNew ? 'Proyecto creado' : 'Proyecto actualizado')
      onSaved(saved)
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save}>
      <Card title={isNew ? 'Nuevo proyecto' : `Editar: ${initial.title}`}>
        <Field label="Título" value={p.title} onChange={(v) => set({ title: v })} required />
        <Field label="Descripción" textarea rows={4} value={p.description} onChange={(v) => set({ description: v })} />
        <ImageInput
          label="Imagen / captura del proyecto"
          value={p.image}
          onChange={(v) => set({ image: v })}
          previewClass="aspect-[4/3.6] w-44"
          hint="Recomendado: captura vertical u horizontal de al menos 1000px de ancho."
        />
        <TagInput label="Tecnologías (etiquetas)" value={p.tags} onChange={(v) => set({ tags: v })} placeholder="React, Node.js…" />
        <Grid>
          <Field label="Enlace al código" value={p.repo} onChange={(v) => set({ repo: v })} placeholder="https://github.com/..." />
          <Field label="Enlace a la demo" value={p.demo} onChange={(v) => set({ demo: v })} placeholder="https://..." />
        </Grid>
        <div className="flex flex-wrap gap-8">
          <Toggle label="Publicado" hint="Si lo apagas, no se muestra en la web" checked={p.published} onChange={(v) => set({ published: v })} />
          <Toggle label="Destacado" hint="Aparece primero y con la etiqueta ★" checked={p.featured} onChange={(v) => set({ featured: v })} />
        </div>
        <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
          <button type="button" onClick={onCancel} className="rounded-md border border-line px-5 py-2.5 text-sm text-body hover:text-ink">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="rounded-md bg-mauve px-5 py-2.5 text-sm font-medium text-deep hover:bg-ink disabled:opacity-60">
            {saving ? 'Guardando…' : isNew ? 'Crear proyecto' : 'Guardar proyecto'}
          </button>
        </div>
      </Card>
    </form>
  )
}

export default function ProjectsManager({ site, set, notify }) {
  const [projects, setProjects] = useState(null)
  const [editing, setEditing] = useState(null) // null | proyecto

  useEffect(() => {
    api('/admin/projects')
      .then(setProjects)
      .catch((err) => notify(err.message, 'error'))
  }, [notify])

  const move = async (i, d) => {
    const j = i + d
    if (j < 0 || j >= projects.length) return
    const copy = [...projects]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    setProjects(copy)
    try {
      await api('/admin/projects/reorder', { method: 'PUT', body: { ids: copy.map((p) => p._id) } })
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const remove = async (p) => {
    if (!confirm(`¿Eliminar el proyecto "${p.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api(`/admin/projects/${p._id}`, { method: 'DELETE' })
      setProjects((list) => list.filter((x) => x._id !== p._id))
      notify('Proyecto eliminado')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const onSaved = (saved) => {
    setProjects((list) => (list.some((x) => x._id === saved._id) ? list.map((x) => (x._id === saved._id ? saved : x)) : [...list, saved]))
    setEditing(null)
  }

  if (editing) {
    return <ProjectForm initial={editing} onCancel={() => setEditing(null)} onSaved={onSaved} notify={notify} />
  }

  return (
    <>
      <Card title="Textos de la sección" description="Se guardan con el botón «Guardar cambios» de abajo.">
        <Grid cols={3}>
          <Field label="Frase superior" value={site.projects.eyebrow} onChange={(v) => set(['projects', 'eyebrow'], v)} />
          <Field label="Título" value={site.projects.title} onChange={(v) => set(['projects', 'title'], v)} />
          <Field label="Texto «Ver todos»" value={site.projects.viewAllLabel} onChange={(v) => set(['projects', 'viewAllLabel'], v)} />
        </Grid>
      </Card>

      <Card title="Proyectos" description="Cada proyecto se guarda al instante con su propio botón. El orden aquí es el orden en la web (los destacados van primero).">
        {!projects && <p className="text-sm text-muted">Cargando…</p>}
        {projects?.map((p, i) => (
          <div key={p._id} className="flex items-center gap-4 rounded-lg border border-line bg-deep/50 p-3">
            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-night-2">
              {p.image ? (
                <img src={mediaUrl(p.image)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-white/50">sin imagen</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-medium text-ink">
                {p.title}
                {p.featured && <TbStarFilled className="shrink-0 text-mauve" title="Destacado" />}
                {!p.published && <TbEyeOff className="shrink-0 text-muted" title="Oculto" />}
              </p>
              <p className="truncate text-xs text-muted">{p.description || 'Sin descripción'}</p>
            </div>
            <div className="flex shrink-0">
              <IconBtn title="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
                <TbArrowUp />
              </IconBtn>
              <IconBtn title="Bajar" disabled={i === projects.length - 1} onClick={() => move(i, 1)}>
                <TbArrowDown />
              </IconBtn>
              <IconBtn title="Editar" onClick={() => setEditing({ ...EMPTY, ...p })}>
                <TbPencil />
              </IconBtn>
              <IconBtn title="Eliminar" danger onClick={() => remove(p)}>
                <TbTrash />
              </IconBtn>
            </div>
          </div>
        ))}
        {projects && <AddButton onClick={() => setEditing({ ...EMPTY })}>Nuevo proyecto</AddButton>}
      </Card>
    </>
  )
}
