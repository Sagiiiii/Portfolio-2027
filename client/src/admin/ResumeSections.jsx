import { techIcons, educationIcons, getTechIcon } from '../lib/icons'
import { mediaUrl } from '../lib/links'
import { portfolio } from '../data/portfolio'
import { Card, Grid, Field, Select, ListEditor, IconPicker, ImageInput, TagInput, PdfInput } from './ui'

// Pestañas del panel para la página «Sobre mí»: stack, experiencia, formación, idiomas...

const titles = (site) => ({ ...portfolio.site.resumeTitles, ...site.resumeTitles })

function TitleField({ site, set, k, label }) {
  const t = titles(site)
  return <Field label={label} value={t[k]} onChange={(v) => set(['resumeTitles'], { ...t, [k]: v })} />
}

const DATE_HINT = 'Formato AAAA-MM (2024-03) o solo el año (2024).'

function SkillPreview({ item }) {
  if (item.image) return <img src={mediaUrl(item.image)} alt="" className="h-4 w-4 object-contain" />
  const { Icon, color } = getTechIcon(item.icon)
  return <Icon style={{ color }} />
}

// ── Stack tecnológico ───────────────────────────────────────
export function SkillsSection({ site, set }) {
  return (
    <>
      <Card title="Título de la sección">
        <TitleField site={site} set={set} k="skills" label="Título" />
      </Card>
      <Card title="Categorías y tecnologías" description="Cada categoría es un bloque (Lenguajes, Front-end, Data Science…).">
        <ListEditor
          items={site.skills ?? []}
          onChange={(v) => set(['skills'], v)}
          addLabel="Agregar categoría"
          newItem={{ category: 'Nueva categoría', items: [] }}
          itemTitle={(g) => `${g.category || 'Sin nombre'} · ${g.items?.length ?? 0} tecnologías`}
          render={(g, update) => (
            <div className="space-y-4">
              <Field label="Nombre de la categoría" value={g.category} onChange={(v) => update({ category: v })} />
              <ListEditor
                items={g.items ?? []}
                onChange={(items) => update({ items })}
                compact
                addLabel="Agregar tecnología"
                newItem={{ name: '', icon: '', image: '' }}
                itemTitle={(s) => (
                  <span className="flex items-center gap-2">
                    <SkillPreview item={s} /> {s.name || 'Nueva tecnología'}
                  </span>
                )}
                render={(s, upd) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nombre" value={s.name} onChange={(v) => upd({ name: v })} />
                    <IconPicker
                      label="Logo"
                      value={s.icon}
                      options={techIcons}
                      onChange={(v) => upd({ icon: v, name: s.name || techIcons[v]?.label || '' })}
                    />
                    <div className="md:col-span-2">
                      <ImageInput
                        label="…o sube un logo propio (si no está en la lista)"
                        value={s.image}
                        onChange={(v) => upd({ image: v })}
                        contain
                        previewClass="h-14 w-14"
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        />
      </Card>
    </>
  )
}

// ── Experiencia profesional ─────────────────────────────────
export function ExperienceSection({ site, set }) {
  return (
    <>
      <Card title="Título de la sección">
        <TitleField site={site} set={set} k="experience" label="Título" />
      </Card>
      <Card title="Experiencias" description="Se muestran en este orden (usa las flechas para reordenar).">
        <ListEditor
          items={site.experience ?? []}
          onChange={(v) => set(['experience'], v)}
          addLabel="Agregar experiencia"
          newItem={{ role: '', company: '', location: '', mode: 'Presencial', start: '', end: '', periodLabel: '', description: '' }}
          itemTitle={(e) => [e.role, e.company].filter(Boolean).join(' · ') || 'Nueva experiencia'}
          render={(e, update) => (
            <div className="space-y-4">
              <Grid>
                <Field label="Cargo" value={e.role} onChange={(v) => update({ role: v })} />
                <Field label="Empresa" value={e.company} onChange={(v) => update({ company: v })} />
                <Field label="Lugar" value={e.location} onChange={(v) => update({ location: v })} placeholder="Huancayo, Perú" />
                <Select
                  label="Modalidad"
                  value={e.mode}
                  onChange={(v) => update({ mode: v })}
                  options={[
                    { value: '', label: '—' },
                    { value: 'Presencial', label: 'Presencial' },
                    { value: 'Remoto', label: 'Remoto' },
                    { value: 'Híbrido', label: 'Híbrido' },
                  ]}
                />
              </Grid>
              <Grid cols={3}>
                <Field label="Inicio" value={e.start} onChange={(v) => update({ start: v })} placeholder="2024-03" hint={DATE_HINT} />
                <Field label="Fin" value={e.end} onChange={(v) => update({ end: v })} placeholder="vacío = Actualidad" />
                <Field
                  label="Texto de fechas (opcional)"
                  value={e.periodLabel}
                  onChange={(v) => update({ periodLabel: v })}
                  placeholder="Ago & Nov 2024"
                  hint="Si lo rellenas, reemplaza a las fechas."
                />
              </Grid>
              <Field label="Descripción" textarea rows={3} value={e.description} onChange={(v) => update({ description: v })} />
            </div>
          )}
        />
      </Card>
    </>
  )
}

// ── Formación académica ─────────────────────────────────────
export function EducationSection({ site, set }) {
  return (
    <>
      <Card title="Título de la sección">
        <TitleField site={site} set={set} k="education" label="Título" />
      </Card>
      <Card title="Estudios" description="Títulos, carreras, certificados académicos y colegio.">
        <ListEditor
          items={site.education ?? []}
          onChange={(v) => set(['education'], v)}
          addLabel="Agregar estudio"
          newItem={{ title: '', institution: '', location: '', details: '', start: '', end: '', periodLabel: '', icon: 'degree' }}
          itemTitle={(e) => e.title || 'Nuevo estudio'}
          render={(e, update) => (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_220px]">
                <Field label="Título / carrera" value={e.title} onChange={(v) => update({ title: v })} />
                <Field label="Institución" value={e.institution} onChange={(v) => update({ institution: v })} />
                <IconPicker label="Icono" value={e.icon} options={educationIcons} onChange={(v) => update({ icon: v })} />
              </div>
              <Grid>
                <Field label="Lugar" value={e.location} onChange={(v) => update({ location: v })} placeholder="Lima, Perú" />
                <Field label="Detalles" value={e.details} onChange={(v) => update({ details: v })} placeholder="Nota: 17 · Título Técnico Superior" />
              </Grid>
              <Grid cols={3}>
                <Field label="Inicio" value={e.start} onChange={(v) => update({ start: v })} placeholder="2023" hint={DATE_HINT} />
                <Field label="Fin" value={e.end} onChange={(v) => update({ end: v })} placeholder="2025" />
                <Field label="Texto de fechas (opcional)" value={e.periodLabel} onChange={(v) => update({ periodLabel: v })} placeholder="En curso" />
              </Grid>
            </div>
          )}
        />
      </Card>
    </>
  )
}

// ── Idiomas, metodologías y certificaciones ─────────────────
export function ExtrasSection({ site, set }) {
  return (
    <>
      <Card title="Idiomas">
        <TitleField site={site} set={set} k="languages" label="Título" />
        <ListEditor
          items={site.languages ?? []}
          onChange={(v) => set(['languages'], v)}
          compact
          addLabel="Agregar idioma"
          newItem={{ name: '', level: '', percent: 50 }}
          itemTitle={(l) => (l.name ? `${l.name} · ${l.percent ?? 0}%` : 'Nuevo idioma')}
          render={(l, update) => (
            <div className="grid items-end gap-3 md:grid-cols-[1fr_1.4fr_200px]">
              <Field label="Idioma" value={l.name} onChange={(v) => update({ name: v })} />
              <Field label="Nivel" value={l.level} onChange={(v) => update({ level: v })} placeholder="Intermedio (Duolingo Cert.)" />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium tracking-wide text-body uppercase">Barra: {l.percent ?? 0}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={l.percent ?? 0}
                  onChange={(ev) => update({ percent: Number(ev.target.value) })}
                  className="w-full accent-[#c4b6ba]"
                />
              </label>
            </div>
          )}
        />
      </Card>

      <Card title="Metodologías" description="Escribe y pulsa Enter para agregar cada una.">
        <TitleField site={site} set={set} k="methodologies" label="Título" />
        <TagInput label="Metodologías y modalidades" value={site.methodologies ?? []} onChange={(v) => set(['methodologies'], v)} placeholder="Scrum, XP…" />
      </Card>

      <Card title="Certificaciones">
        <TitleField site={site} set={set} k="certifications" label="Título" />
        <ListEditor
          items={site.certifications ?? []}
          onChange={(v) => set(['certifications'], v)}
          compact
          addLabel="Agregar certificación"
          newItem={{ name: '', issuer: '', date: '' }}
          itemTitle={(c) => c.name || 'Nueva certificación'}
          render={(c, update) => (
            <div className="grid gap-3 md:grid-cols-[1.4fr_1.4fr_140px]">
              <Field label="Nombre" value={c.name} onChange={(v) => update({ name: v })} />
              <Field label="Entidad" value={c.issuer} onChange={(v) => update({ issuer: v })} />
              <Field label="Fecha" value={c.date} onChange={(v) => update({ date: v })} placeholder="2024" />
            </div>
          )}
        />
      </Card>
    </>
  )
}

// ── Mis certificados (galería) ──────────────────────────────
export function CertificatesSection({ site, set }) {
  return (
    <>
      <Card title="Título de la sección">
        <TitleField site={site} set={set} k="certificates" label="Título" />
      </Card>
      <Card
        title="Certificados"
        description="Se muestran como galería al final de la página Sobre mí. Con imagen, al hacer clic se ve en grande; sin imagen, se abre el enlace."
      >
        <ListEditor
          items={site.certificates ?? []}
          onChange={(v) => set(['certificates'], v)}
          addLabel="Agregar certificado"
          newItem={{ title: '', issuer: '', date: '', image: '', url: '' }}
          itemTitle={(c) => (
            <span className="flex items-center gap-2">
              {c.image && <img src={mediaUrl(c.image)} alt="" className="h-6 w-8 rounded object-cover" />}
              {c.title || 'Nuevo certificado'}
            </span>
          )}
          render={(c, update) => (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1.4fr_1.2fr_140px]">
                <Field label="Nombre del certificado" value={c.title} onChange={(v) => update({ title: v })} />
                <Field label="Entidad" value={c.issuer} onChange={(v) => update({ issuer: v })} placeholder="Platzi, Coursera, PMI…" />
                <Field label="Fecha" value={c.date} onChange={(v) => update({ date: v })} placeholder="2024" />
              </div>
              <ImageInput
                label="Imagen del certificado (subir o pegar URL de la imagen)"
                value={c.image}
                onChange={(v) => update({ image: v })}
                previewClass="aspect-[4/3] w-40"
                hint="Consejo: en Canva usa Compartir → Descargar → PNG, y sube esa imagen aquí."
              />
              <PdfInput
                label="Enlace o PDF del certificado (opcional)"
                value={c.url}
                onChange={(v) => update({ url: v })}
                texts={{ uploaded: 'PDF subido', linked: 'Enlace guardado', empty: 'Sin enlace ni PDF' }}
                placeholder="…o pega el enlace de Canva, Credly, Coursera…"
                hint="Se abre con el botón «Ver original»; si no hay imagen, al hacer clic en la tarjeta."
              />
            </div>
          )}
        />
      </Card>
    </>
  )
}
