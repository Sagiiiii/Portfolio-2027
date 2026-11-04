import { techIcons, socialIcons, serviceIcons, getTechIcon } from '../lib/icons'
import { mediaUrl } from '../lib/links'
import { Card, Grid, Field, Toggle, ListEditor, ButtonsEditor, IconPicker, ImageInput, LINK_HINT } from './ui'

// Cada sección recibe: site (datos actuales) y set(path, value) para modificarlos

// ── Perfil + Hero + const dev ───────────────────────────────
export function HeroSection({ site, set }) {
  const { profile, hero } = site
  return (
    <>
      <Card title="Perfil" description="Datos personales que aparecen en varias partes de la web.">
        <Grid>
          <Field label="Nombre" value={profile.name} onChange={(v) => set(['profile', 'name'], v)} />
          <Field label="Nombre corto (logo en móvil)" value={profile.shortName} onChange={(v) => set(['profile', 'shortName'], v)} />
          <Field label="Email" type="email" value={profile.email} onChange={(v) => set(['profile', 'email'], v)} />
          <Field label="Teléfono" value={profile.phone} onChange={(v) => set(['profile', 'phone'], v)} placeholder="+51 999 999 999" />
          <Field label="Ubicación" value={profile.location} onChange={(v) => set(['profile', 'location'], v)} />
          <Field label="Enlace al CV (PDF)" value={profile.cv} onChange={(v) => set(['profile', 'cv'], v)} placeholder="https://drive.google.com/..." />
        </Grid>
        <Toggle
          label="Disponible para trabajar"
          hint="Se muestra como available: true / false en la tarjeta de código"
          checked={profile.available}
          onChange={(v) => set(['profile', 'available'], v)}
        />
      </Card>

      <Card title="Portada (hero)" description="Lo primero que se ve al entrar en la web.">
        <Grid>
          <Field label="Saludo" value={hero.greeting} onChange={(v) => set(['hero', 'greeting'], v)} placeholder="Hola, soy" />
          <Field label="Rol (para la tarjeta de código)" value={hero.role} onChange={(v) => set(['hero', 'role'], v)} />
        </Grid>
        <Field label="Frase de la portada" textarea rows={2} value={hero.tagline} onChange={(v) => set(['hero', 'tagline'], v)} />
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-body uppercase">Botones</span>
          <ButtonsEditor buttons={hero.buttons} onChange={(v) => set(['hero', 'buttons'], v)} />
          <p className="mt-2 text-xs text-muted">{LINK_HINT}</p>
        </div>
      </Card>

      <Card
        title="Tarjeta de código"
        description="El bloque const dev = {...} y los logos que flotan alrededor (se muestran hasta 10)."
        aside={<CodePreview site={site} />}
      >
        <Field label="Texto de dev.build('…')" value={hero.codeAction} onChange={(v) => set(['hero', 'codeAction'], v)} placeholder="ideas" />
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-body uppercase">Stack (tecnologías)</span>
          <ListEditor
            items={hero.stack}
            onChange={(v) => set(['hero', 'stack'], v)}
            compact
            addLabel="Agregar tecnología"
            newItem={{ name: '', icon: 'react', image: '' }}
            itemTitle={(s) => (
              <span className="flex items-center gap-2">
                <StackPreview item={s} /> {s.name || 'Nueva tecnología'}
              </span>
            )}
            render={(s, update) => (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre" value={s.name} onChange={(v) => update({ name: v })} placeholder="React" />
                <IconPicker
                  label="Icono"
                  value={s.icon}
                  options={techIcons}
                  onChange={(v) => update({ icon: v, name: s.name || techIcons[v]?.label || '' })}
                />
                <div className="md:col-span-2">
                  <ImageInput
                    label="…o sube tu propio logo (tiene prioridad sobre el icono)"
                    value={s.image}
                    onChange={(v) => update({ image: v })}
                    contain
                    previewClass="h-16 w-16"
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Card>
    </>
  )
}

function StackPreview({ item }) {
  if (item.image) return <img src={mediaUrl(item.image)} alt="" className="h-5 w-5 object-contain" />
  const { Icon, color } = getTechIcon(item.icon)
  return <Icon style={{ color }} />
}

function CodePreview({ site }) {
  const { profile, hero } = site
  return (
    <pre className="hidden max-w-sm overflow-hidden rounded-lg border border-line bg-[#1b1c30] p-3 text-[11px] leading-5 text-white/80 lg:block">
      <span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">dev</span> = {'{\n'}
      {'  '}<span className="text-[#f78c6c]">name</span>: <span className="text-[#c3e88d]">'{profile.name}'</span>,{'\n'}
      {'  '}<span className="text-[#f78c6c]">role</span>: <span className="text-[#c3e88d]">'{hero.role}'</span>,{'\n'}
      {'  '}<span className="text-[#f78c6c]">stack</span>: [{hero.stack.map((s) => `'${s.name}'`).join(', ')}],{'\n'}
      {'  '}<span className="text-[#f78c6c]">available</span>: <span className="text-[#ff5370]">{String(profile.available)}</span>,{'\n'}
      {'}\n'}
      <span className="text-[#82aaff]">dev</span>.<span className="text-[#ffcb6b]">build</span>(<span className="text-[#c3e88d]">'{hero.codeAction}'</span>)
    </pre>
  )
}

// ── Redes sociales ──────────────────────────────────────────
export function SocialsSection({ site, set }) {
  return (
    <Card
      title="Redes sociales y enlaces"
      description="Aparecen en la barra lateral de la portada, en Contacto y en el footer."
    >
      <ListEditor
        items={site.socials}
        onChange={(v) => set(['socials'], v)}
        addLabel="Agregar red social"
        newItem={{ name: '', url: 'https://', icon: 'website' }}
        itemTitle={(s) => {
          const Icon = socialIcons[s.icon]?.Icon
          return (
            <span className="flex items-center gap-2">
              {Icon && <Icon />} {s.name || 'Nueva red'}
            </span>
          )
        }}
        render={(s, update) => (
          <div className="grid gap-4 md:grid-cols-[220px_1fr_1.6fr]">
            <IconPicker
              label="Red"
              value={s.icon}
              options={socialIcons}
              onChange={(v) => update({ icon: v, name: s.name || socialIcons[v]?.label || '' })}
            />
            <Field label="Nombre visible" value={s.name} onChange={(v) => update({ name: v })} />
            <Field label="Enlace" value={s.url} onChange={(v) => update({ url: v })} placeholder="https://..." />
          </div>
        )}
      />
      <p className="text-xs text-muted">
        Ejemplos: WhatsApp → https://wa.me/51999999999 · Email → mailto:tu@correo.com · Teléfono → tel:+51999999999
      </p>
    </Card>
  )
}

// ── Sobre mí ────────────────────────────────────────────────
export function AboutSection({ site, set }) {
  const { about, profile } = site
  return (
    <>
      <Card title="Sección «Sobre mí» (inicio)">
        <Grid>
          <Field label="Frase superior" value={about.eyebrow} onChange={(v) => set(['about', 'eyebrow'], v)} placeholder="Permíteme presentarme" />
          <Field label="Título" value={about.title} onChange={(v) => set(['about', 'title'], v)} />
        </Grid>
        <Field label="Texto" textarea rows={5} value={about.text} onChange={(v) => set(['about', 'text'], v)} />
        <ImageInput
          label="Foto (también se usa en la página Sobre mí)"
          value={about.image}
          onChange={(v) => set(['about', 'image'], v)}
          previewClass="aspect-square w-36"
          hint="Se muestra en blanco y negro y se colorea al pasar el ratón."
        />
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-body uppercase">Botones</span>
          <ButtonsEditor buttons={about.buttons} onChange={(v) => set(['about', 'buttons'], v)} />
          <p className="mt-2 text-xs text-muted">{LINK_HINT}</p>
        </div>
      </Card>

      <Card title="Página «Sobre mí»" description="Textos de la página /about.">
        <Field label="Titular" value={profile.headline} onChange={(v) => set(['profile', 'headline'], v)} placeholder="Un desarrollador de Software" />
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-body uppercase">Párrafos de presentación</span>
          <ListEditor
            items={profile.bio}
            onChange={(v) => set(['profile', 'bio'], v)}
            compact
            addLabel="Agregar párrafo"
            newItem=""
            itemTitle={(_, i) => `Párrafo ${i + 1}`}
            render={(p, update) => <Field textarea rows={3} value={p} onChange={update} />}
          />
        </div>
      </Card>
    </>
  )
}

// ── Servicios ───────────────────────────────────────────────
export function ServicesSection({ site, set }) {
  const { services } = site
  return (
    <Card title="Servicios" description="Si borras todos los servicios, la sección se oculta.">
      <Grid>
        <Field label="Frase superior" value={services.eyebrow} onChange={(v) => set(['services', 'eyebrow'], v)} />
        <Field label="Título" value={services.title} onChange={(v) => set(['services', 'title'], v)} />
      </Grid>
      <ListEditor
        items={services.items}
        onChange={(v) => set(['services', 'items'], v)}
        addLabel="Agregar servicio"
        newItem={{ title: 'Nuevo servicio', description: '', icon: 'web', image: '' }}
        itemTitle={(s) => s.title || 'Servicio sin título'}
        render={(s, update) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              <Field label="Título" value={s.title} onChange={(v) => update({ title: v })} />
              <IconPicker label="Icono" value={s.icon} options={serviceIcons} onChange={(v) => update({ icon: v })} />
            </div>
            <Field label="Descripción" textarea rows={3} value={s.description} onChange={(v) => update({ description: v })} />
            <ImageInput
              label="…o sube un icono propio (opcional)"
              value={s.image}
              onChange={(v) => update({ image: v })}
              contain
              previewClass="h-16 w-16"
            />
          </div>
        )}
      />
    </Card>
  )
}

// ── Llamado a la acción ─────────────────────────────────────
export function CtaSection({ site, set }) {
  const { cta } = site
  return (
    <Card title="Bloque «Déjame que te ayude»" description="Aparece al final de Inicio, Sobre mí y Proyectos. Si dejas el título vacío se oculta.">
      <Grid>
        <Field label="Frase superior" value={cta.eyebrow} onChange={(v) => set(['cta', 'eyebrow'], v)} />
        <Field label="Título" value={cta.title} onChange={(v) => set(['cta', 'title'], v)} />
      </Grid>
      <div>
        <span className="mb-2 block text-xs font-medium tracking-wide text-body uppercase">Botones</span>
        <ButtonsEditor buttons={cta.buttons} onChange={(v) => set(['cta', 'buttons'], v)} />
        <p className="mt-2 text-xs text-muted">{LINK_HINT}</p>
      </div>
    </Card>
  )
}

// ── Footer ──────────────────────────────────────────────────
export function FooterSection({ site, set }) {
  const { footer } = site
  return (
    <Card title="Footer" description="El nombre, el contacto y las redes salen de Perfil y Redes sociales.">
      <Field label="Descripción" textarea rows={3} value={footer.description} onChange={(v) => set(['footer', 'description'], v)} />
      <Grid cols={3}>
        <Field label="Título columna enlaces" value={footer.linksTitle} onChange={(v) => set(['footer', 'linksTitle'], v)} />
        <Field label="Título columna contacto" value={footer.contactTitle} onChange={(v) => set(['footer', 'contactTitle'], v)} />
        <Field label="Título columna redes" value={footer.socialsTitle} onChange={(v) => set(['footer', 'socialsTitle'], v)} />
      </Grid>
      <Field
        label="Copyright"
        value={footer.copyright}
        onChange={(v) => set(['footer', 'copyright'], v)}
        hint="{year} se reemplaza por el año actual y {name} por tu nombre."
      />
    </Card>
  )
}
