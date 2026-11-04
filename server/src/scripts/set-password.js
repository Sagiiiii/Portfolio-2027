// Define (o cambia) la contraseña del panel de administración.
//   npm run set-password -- MiClaveSegura123
// Guarda el hash en server/.env (ADMIN_PASSWORD_HASH) y crea JWT_SECRET si no existe.
import crypto from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { hashPassword } from '../auth.js'

const password = process.argv[2]
if (!password || password.length < 8) {
  console.error('✖ Uso: npm run set-password -- TuClave   (mínimo 8 caracteres)')
  process.exit(1)
}

const envPath = fileURLToPath(new URL('../../.env', import.meta.url))
let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''

const setVar = (key, value) => {
  const line = `${key}=${value}`
  const re = new RegExp(`^${key}=.*$`, 'm')
  env = re.test(env) ? env.replace(re, line) : `${env.replace(/\s*$/, '')}\n${line}\n`
}

setVar('ADMIN_PASSWORD_HASH', hashPassword(password))
if (!/^JWT_SECRET=.+$/m.test(env)) setVar('JWT_SECRET', crypto.randomBytes(48).toString('hex'))

writeFileSync(envPath, env)
console.log('✔ Contraseña del admin guardada en server/.env')
console.log('  → Reinicia el servidor (Ctrl+C y npm run dev) para aplicarla.')
