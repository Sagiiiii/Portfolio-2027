import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { isAdminConfigured, requireAdmin, signToken, verifyPassword } from '../auth.js'

const router = Router()

// Máximo 10 intentos de login cada 15 minutos por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' },
})

// POST /api/auth/login { password } → { token }
router.post('/login', loginLimiter, (req, res) => {
  if (!isAdminConfigured()) {
    return res.status(503).json({ error: 'Admin no configurado. Ejecuta "npm run set-password -- TuClave" en /server.' })
  }
  if (!verifyPassword(req.body?.password, process.env.ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }
  res.json({ token: signToken() })
})

// GET /api/auth/me → comprueba si el token sigue siendo válido
router.get('/me', requireAdmin, (_req, res) => res.json({ ok: true }))

export default router
