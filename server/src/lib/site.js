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

// Devuelve la configuración del sitio; la crea la primera vez.
export async function getSite() {
  const existing = await Site.findOne().lean()
  if (existing) return existing
  const data = await migrateLegacy(portfolio.site)
  const created = await Site.create(data)
  console.log('✔ Configuración del sitio creada en la base de datos')
  return created.toObject()
}
