import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

// Contraseña del admin guardada como hash scrypt en .env (ADMIN_PASSWORD_HASH)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored || '').split(':')
  if (alg !== 'scrypt' || !salt || !hash || typeof password !== 'string') return false
  const expected = Buffer.from(hash, 'hex')
  const actual = crypto.scryptSync(password, salt, 64)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.JWT_SECRET)

export const signToken = () => jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })

// Middleware: exige "Authorization: Bearer <token>" válido
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token || !isAdminConfigured()) return res.status(401).json({ error: 'No autorizado' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.role !== 'admin') throw new Error('rol')
    next()
  } catch {
    res.status(401).json({ error: 'Sesión expirada. Vuelve a iniciar sesión.' })
  }
}
