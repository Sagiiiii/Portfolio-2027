import { connectDB } from './db.js'
import { createApp } from './app.js'

const PORT = process.env.PORT || 4000

await connectDB()

createApp().listen(PORT, () => {
  console.log(`✔ API escuchando en http://localhost:${PORT}`)
  console.log(`  → prueba: http://localhost:${PORT}/api/portfolio`)
})
