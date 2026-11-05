import mongoose from 'mongoose'

// En Vercel (serverless) cada función reutiliza la conexión entre visitas:
// se guarda la promesa para no abrir una conexión nueva en cada petición.
let connecting = null

export async function connectDB(uri = process.env.MONGODB_URI, { exitOnFail = true } = {}) {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (connecting) return connecting

  if (!uri) {
    const msg = 'Falta MONGODB_URI. Copia server/.env.example a server/.env (o configúrala en Vercel).'
    if (!exitOnFail) throw new Error(msg)
    console.error('✖ ' + msg)
    process.exit(1)
  }

  connecting = mongoose
    .connect(uri, { dbName: process.env.MONGODB_DB || 'portfolio', serverSelectionTimeoutMS: 10000 })
    .then(() => {
      const { host, name } = mongoose.connection
      console.log(`✔ MongoDB conectado → ${host} / ${name}`)
      return mongoose.connection
    })
    .catch((err) => {
      connecting = null
      console.error('✖ No se pudo conectar a MongoDB:', err.message)
      if (/auth/i.test(err.message)) console.error('  → Revisa usuario y contraseña en MONGODB_URI.')
      if (/ENOTFOUND|querySrv/i.test(err.message)) console.error('  → Revisa el host del cluster en MONGODB_URI.')
      if (/whitelist|IP|timed out|Server selection/i.test(err.message))
        console.error('  → En Atlas: Network Access → añade tu IP (o 0.0.0.0/0 para Vercel).')
      if (exitOnFail) process.exit(1)
      throw err
    })
  return connecting
}
