import express, { Router } from 'express'
import mongoose from 'mongoose'
import { requireAdmin } from '../auth.js'
import { Site, Project, Media, Message } from '../models/index.js'
import { getSite } from '../lib/site.js'

const router = Router()
router.use(requireAdmin) // ← todo lo de aquí abajo exige sesión de admin

// Quita campos que el cliente no debe tocar
const clean = ({ _id, __v, createdAt, updatedAt, ...rest } = {}) => rest

// Convierte errores de validación de Mongoose en un 400 legible
function handle(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res)
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(' · ') })
      }
      if (err?.code === 11000) return res.status(400).json({ error: 'Ya existe un proyecto con ese slug.' })
      next(err)
    }
  }
}

// ── Configuración del sitio ─────────────────────────────────
router.get('/site', handle(async (_req, res) => res.json(await getSite())))

router.put(
  '/site',
  handle(async (req, res) => {
    await getSite() // asegura que exista
    const site = await Site.findOne()
    site.set(clean(req.body))
    await site.save()
    res.json(site.toObject())
  }),
)

// ── Proyectos ───────────────────────────────────────────────
const slugify = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'proyecto'

async function uniqueSlug(base, ignoreId) {
  let slug = slugify(base)
  for (let i = 2; await Project.exists({ slug, ...(ignoreId && { _id: { $ne: ignoreId } }) }); i++) {
    slug = `${slugify(base)}-${i}`
  }
  return slug
}

router.get('/projects', handle(async (_req, res) => res.json(await Project.find().sort({ order: 1, createdAt: -1 }).lean())))

router.post(
  '/projects',
  handle(async (req, res) => {
    const data = clean(req.body)
    data.slug = await uniqueSlug(data.slug || data.title)
    const last = await Project.findOne().sort({ order: -1 }).select('order').lean()
    data.order = (last?.order ?? -1) + 1
    res.status(201).json(await Project.create(data))
  }),
)

// Reordenar: { ids: [id1, id2, ...] } en el orden deseado
router.put(
  '/projects/reorder',
  handle(async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((id) => mongoose.isValidObjectId(id)) : []
    await Project.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { order } } })))
    res.json({ ok: true })
  }),
)

router.put(
  '/projects/:id',
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'No encontrado' })
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'No encontrado' })
    const data = clean(req.body)
    data.slug = await uniqueSlug(data.slug || data.title, project._id)
    project.set(data)
    await project.save()
    res.json(project)
  }),
)

router.delete(
  '/projects/:id',
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'No encontrado' })
    await Project.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  }),
)

// ── Imágenes ────────────────────────────────────────────────
// POST /api/admin/media  (cuerpo = bytes de la imagen, Content-Type: image/...)
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
router.post(
  '/media',
  express.raw({ type: ALLOWED, limit: '4mb' }),
  handle(async (req, res) => {
    const type = req.headers['content-type']
    if (!ALLOWED.includes(type) || !Buffer.isBuffer(req.body) || !req.body.length) {
      return res.status(400).json({ error: 'Formato no permitido. Usa JPG, PNG, WEBP, GIF, AVIF o SVG.' })
    }
    const media = await Media.create({ data: req.body, contentType: type, size: req.body.length })
    res.status(201).json({ url: `/api/media/${media._id}` })
  }),
)

// ── Mensajes de contacto (solo lectura por ahora) ───────────
router.get('/messages', handle(async (_req, res) => res.json(await Message.find().sort({ createdAt: -1 }).limit(200).lean())))

export default router
