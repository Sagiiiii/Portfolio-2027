import { Router } from 'express'
import mongoose from 'mongoose'
import { Media } from '../models/index.js'

const router = Router()

// GET /api/media/:id → sirve una imagen guardada en MongoDB
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end()
    const media = await Media.findById(req.params.id).lean()
    if (!media) return res.status(404).end()
    res.set({
      'Content-Type': media.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // el id cambia si se sube otra imagen
      'X-Content-Type-Options': 'nosniff',
      // Evita que un SVG ejecute scripts si se abre directamente
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
      'Cross-Origin-Resource-Policy': 'cross-origin',
    })
    res.send(media.data.buffer ? Buffer.from(media.data.buffer) : media.data)
  } catch (err) {
    next(err)
  }
})

export default router
