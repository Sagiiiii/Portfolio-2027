import { Router } from 'express'
import mongoose from 'mongoose'
import { Media } from '../models/index.js'

const router = Router()

// GET /api/media/:id → sirve un archivo guardado en MongoDB
// GET /api/media/:id?download=1&name=CV-Nombre.pdf → fuerza la descarga con ese nombre
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end()
    const media = await Media.findById(req.params.id).lean()
    if (!media) return res.status(404).end()
    res.set({
      'Content-Type': media.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // el id cambia si se sube otro archivo
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    })
    // Evita que un SVG ejecute scripts si se abre directamente (el visor de PDF necesita otra política)
    if (media.contentType !== 'application/pdf') {
      res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:")
    }
    if (req.query.download) {
      const name = String(req.query.name || media.filename || 'archivo').replace(/[\r\n"\\/]/g, '').slice(0, 120)
      const ascii = name.normalize('NFD').replace(/[^\x20-\x7e]/g, '') || 'archivo'
      res.set('Content-Disposition', `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`)
    }
    res.send(media.data.buffer ? Buffer.from(media.data.buffer) : media.data)
  } catch (err) {
    next(err)
  }
})

export default router
