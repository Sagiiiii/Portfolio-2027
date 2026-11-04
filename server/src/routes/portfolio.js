import { Router } from 'express'
import { SkillGroup, Experience, Project, Education } from '../models/index.js'
import { getSite } from '../lib/site.js'

const router = Router()

// GET /api/portfolio → todo el contenido de la web pública en una sola llamada
router.get('/', async (_req, res, next) => {
  try {
    const [site, skills, experience, projects, education] = await Promise.all([
      getSite(),
      SkillGroup.find().sort({ order: 1 }).select('-__v').lean(),
      Experience.find().sort({ order: 1, start: -1 }).select('-__v').lean(),
      Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).select('-__v').lean(),
      Education.find().sort({ order: 1, start: -1 }).select('-__v').lean(),
    ])
    res.set('Cache-Control', 'no-store')
    res.json({ site, skills, experience, projects, education })
  } catch (err) {
    next(err)
  }
})

export default router
