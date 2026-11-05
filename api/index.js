// Función de Vercel: sirve toda la API de Express en /api/*
// (en local se sigue usando server/src/index.js con "npm run dev")
import { connectDB } from '../server/src/db.js'
import { createApp } from '../server/src/app.js'

const app = createApp()

export default async function handler(req, res) {
  try {
    await connectDB(process.env.MONGODB_URI, { exitOnFail: false })
  } catch {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'No se pudo conectar a la base de datos' }))
    return
  }
  // Recupera la ruta original (/api/portfolio...) si Vercel la entrega reescrita como /api?__path=...
  const url = new URL(req.url, 'http://localhost')
  const path = url.searchParams.get('__path')
  if (path !== null) {
    url.searchParams.delete('__path')
    if (!url.pathname.startsWith('/api/')) url.pathname = `/api/${path}`
    req.url = url.pathname + url.search
  }
  return app(req, res)
}
