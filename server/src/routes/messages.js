import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { Message } from '../models/index.js'

const router = Router()

// Máximo 5 mensajes cada 15 min por IP (anti-spam básico)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados mensajes. Intenta más tarde.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/messages → guarda un mensaje del formulario de contacto
router.post('/', limiter, async (req, res, next) => {
  try {
    const { name, email, message, website } = req.body ?? {}

    // Honeypot: los bots rellenan el campo oculto "website"
    if (website) return res.status(201).json({ ok: true })

    if (typeof name !== 'string' || !name.trim() || name.length > 100)
      return res.status(400).json({ error: 'Nombre inválido.' })
    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200)
      return res.status(400).json({ error: 'Email inválido.' })
    if (typeof message !== 'string' || message.trim().length < 5 || message.length > 5000)
      return res.status(400).json({ error: 'El mensaje debe tener entre 5 y 5000 caracteres.' })

    await Message.create({ name, email, message })
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
