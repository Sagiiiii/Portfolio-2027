import mongoose from 'mongoose'
import { Site } from '../models/index.js'
import { portfolio } from '../defaults.js'

const SOCIAL_NAMES = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', twitter: 'X', x: 'X', instagram: 'Instagram', youtube: 'YouTube' }

// Si existían las colecciones antiguas (profiles / services), copia sus datos
// a la nueva configuración para no perder lo que ya editaste en Atlas.
async function migrateLegacy(base) {
  const db = mongoose.connection.db
  const site = structuredClone(base)

  const profile = await db.collection('profiles').findOne()
  if (profile) {
    Object.assign(site.profile, {
      name: profile.name || site.profile.name,
      shortName: profile.shortName || site.profile.shortName,
      headline: profile.headline || site.profile.headline,
      bio: profile.about?.length ? profile.about : site.profile.bio,
      email: profile.email || site.profile.email,
      phone: profile.phone || '',
      location: profile.location || site.profile.location,
      available: profile.available ?? true,
      cv: profile.cv || '',
    })
    if (profile.tagline) site.hero.tagline = profile.tagline
    if (profile.roles?.[0]) site.hero.role = profile.roles[0]
    if (profile.about?.[0]) {
      site.about.text = profile.about[0]
      site.footer.description = profile.about[0]
    }
    if (profile.avatar) site.about.image = profile.avatar
    if (profile.socials?.length) {
      site.socials = profile.socials.map((s) => ({ name: SOCIAL_NAMES[s.name] ?? s.name, url: s.url, icon: s.name }))
    }
  }

  const services = await db.collection('services').find().sort({ order: 1 }).toArray()
  if (services.length) {
    site.services.items = services.map((s) => ({ title: s.title, description: s.description, icon: s.icon, image: '' }))
  }
  return site
}

// Trayectoria (skills, experiencia, educación) desde las colecciones antiguas
const toMonth = (v) => (v ? String(v).slice(0, 7) : '')
async function legacyResume() {
  const db = mongoose.connection.db
  const [skills, experience, education] = await Promise.all([
    db.collection('skillgroups').find().sort({ order: 1 }).toArray(),
    db.collection('experiences').find().sort({ order: 1 }).toArray(),
    db.collection('educations').find().sort({ order: 1 }).toArray(),
  ])
  const d = portfolio.site
  return {
    resumeTitles: d.resumeTitles,
    skills: skills.length
      ? skills.map((g) => ({
          category: g.category.charAt(0).toUpperCase() + g.category.slice(1),
          items: (g.items ?? []).map((i) => ({ name: i.name, icon: i.icon ?? '', image: '' })),
        }))
      : d.skills,
    experience: experience.length
      ? experience.map((e) => ({
          role: e.role,
          company: e.company,
          location: e.location ?? '',
          mode: '',
          start: toMonth(e.start),
          end: toMonth(e.end),
          periodLabel: '',
          description: Array.isArray(e.description) ? e.description.join(' ') : e.description ?? '',
        }))
      : d.experience,
    education: education.length
      ? education.map((e) => ({
          title: e.title,
          institution: e.institution,
          location: '',
          details: e.description ?? '',
          start: toMonth(e.start),
          end: toMonth(e.end),
          periodLabel: '',
          icon: 'university',
        }))
      : d.education,
    languages: d.languages,
    methodologies: d.methodologies,
    certifications: d.certifications,
  }
}

// Devuelve la configuración del sitio; la crea la primera vez.
export async function getSite() {
  const existing = await Site.findOne().lean()
  if (existing && existing.skills !== undefined) return existing
  if (existing) {
    // Sitio creado antes de añadir la trayectoria → se completa una sola vez
    await Site.updateOne({ _id: existing._id }, { $set: await legacyResume() })
    console.log('✔ Trayectoria (skills, experiencia, educación) añadida a la configuración del sitio')
    return Site.findById(existing._id).lean()
  }
  const data = { ...(await migrateLegacy(portfolio.site)), ...(await legacyResume()) }
  const created = await Site.create(data)
  console.log('✔ Configuración del sitio creada en la base de datos')
  return created.toObject()
}
