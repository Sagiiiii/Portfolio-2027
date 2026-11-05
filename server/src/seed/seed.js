// Carga el contenido inicial (src/defaults.js) en MongoDB.
//   npm run seed        → rellena SOLO lo que está vacío (no pisa lo que ya editaste)
//   npm run seed:force  → BORRA el contenido y lo vuelve a cargar todo (no toca mensajes ni imágenes)
import mongoose from 'mongoose'
import { connectDB } from '../db.js'
import { Site, Project } from '../models/index.js'
import { getSite } from '../lib/site.js'
import { portfolio } from '../defaults.js'

const force = process.argv.includes('--force')
const withOrder = (arr = []) => arr.map((item, i) => ({ ...item, order: i }))

await connectDB()

if (force) await Site.deleteMany({})
await getSite() // crea la configuración (migrando datos antiguos si existen)
console.log('✔ configuración del sitio lista')

const collections = [{ label: 'proyectos', Model: Project, docs: withOrder(portfolio.projects) }]

for (const { label, Model, docs } of collections) {
  if (force) await Model.deleteMany({})
  const count = await Model.countDocuments()
  if (count > 0) {
    console.log(`ℹ ${label}: ya tiene ${count} documento(s), se mantiene`)
    continue
  }
  await Model.insertMany(docs)
  console.log(`✔ ${label}: ${docs.length} insertado(s)`)
}

await mongoose.disconnect()
