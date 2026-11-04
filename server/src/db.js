import mongoose from 'mongoose'

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.error('✖ Falta MONGODB_URI. Copia server/.env.example a server/.env y pega tu cadena de Atlas.')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'portfolio' })
    const { host, name } = mongoose.connection
    console.log(`✔ MongoDB conectado → ${host} / ${name}`)
  } catch (err) {
    console.error('✖ No se pudo conectar a MongoDB:', err.message)
    if (/auth/i.test(err.message)) console.error('  → Revisa usuario y contraseña en MONGODB_URI.')
    if (/ENOTFOUND|querySrv/i.test(err.message)) console.error('  → Revisa el host del cluster en MONGODB_URI.')
    if (/whitelist|IP|timed out|Server selection/i.test(err.message))
      console.error('  → En Atlas: Network Access → añade tu IP actual.')
    process.exit(1)
  }
}
