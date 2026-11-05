import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import portfolioRoutes from './routes/portfolio.js'
import messageRoutes from './routes/messages.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import mediaRoutes from './routes/media.js'

export function createApp() {
  const app = express()
  const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim())

  app.set('trust proxy', 1) // necesario detrás de Render/Railway para el rate limit
  app.use(cors({ origin: origins }))

  // Las imágenes llegan como bytes (express.raw dentro de /api/admin/media); el resto es JSON
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
  })

  app.use('/api/portfolio', portfolioRoutes)
  app.use('/api/messages', messageRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/media', mediaRoutes)

  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'El archivo es demasiado grande (máx. 4 MB para imágenes y 10 MB para PDF).' })
    console.error(err)
    res.status(err.status || 500).json({ error: 'Error interno del servidor' })
  })

  return app
}
