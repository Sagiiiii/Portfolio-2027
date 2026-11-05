import { Router } from 'express'
import { Project } from '../models/index.js'
import { getSite } from '../lib/site.js'

const router = Router()

// GET /api/portfolio → todo el contenido de la web pública en una sola llamada
router.get('/', async (_req, res, next) => {
  try {
    const [site, projects] = await Promise.all([
      getSite(),
      Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).select('-__v').lean(),
    ])
    res.set('Cache-Control', 'no-store')
    res.json({ site, projects })
  } catch (err) {
    next(err)
  }
})

export default router
