import mongoose from 'mongoose'

const { Schema, model } = mongoose

const opts = { timestamps: true, toJSON: { versionKey: false } }

// ── Validadores ─────────────────────────────────────────────
// Enlaces: rutas internas (/projects), anclas (#), http(s), mailto:, tel:. Bloquea "javascript:" etc.
const LINK_RE = /^(https?:\/\/|mailto:|tel:|\/|#)/i
const link = {
  type: String,
  trim: true,
  default: '',
  validate: { validator: (v) => !v || LINK_RE.test(v), message: (p) => `Enlace no válido: "${p.value}"` },
}
// Imágenes: subidas a la API (/api/media/...) o URL externa http(s)
const IMG_RE = /^(https?:\/\/|\/api\/media\/)/i
const image = {
  type: String,
  trim: true,
  default: '',
  validate: { validator: (v) => !v || IMG_RE.test(v), message: (p) => `Imagen no válida: "${p.value}"` },
}
const text = (max = 2000) => ({ type: String, trim: true, default: '', maxlength: max })

const buttonSchema = new Schema(
  {
    label: text(60),
    url: link,
    variant: { type: String, enum: ['primary', 'outline'], default: 'primary' },
    icon: text(40), // opcional: clave de red social (github, linkedin...) para mostrar su logo
  },
  { _id: false },
)

// ── Configuración del sitio (un único documento) ────────────
const siteSchema = new Schema(
  {
    profile: {
      name: { ...text(80), required: true },
      shortName: text(40),
      headline: text(120),
      bio: [text(2000)],
      email: text(200),
      phone: text(40),
      location: text(120),
      available: { type: Boolean, default: true },
      cv: link,
    },
    hero: {
      greeting: text(60),
      tagline: text(300),
      role: text(80),
      codeAction: text(40),
      // Botón "Descargar CV" en la portada (usa profile.cv)
      cvButton: {
        show: { type: Boolean, default: true },
        label: { ...text(40), default: 'Descargar CV' },
      },
      stack: [new Schema({ name: text(40), icon: text(40), image }, { _id: false })],
      buttons: [buttonSchema],
    },
    socials: [new Schema({ name: text(40), url: link, icon: text(40) }, { _id: false })],
    about: {
      eyebrow: text(80),
      title: text(80),
      text: text(3000),
      image,
      buttons: [buttonSchema],
    },
    // Botones de la página /about (debajo de la presentación)
    aboutPage: {
      showCv: { type: Boolean, default: true },
      buttons: [buttonSchema],
    },
    services: {
      eyebrow: text(80),
      title: text(80),
      items: [new Schema({ title: text(80), description: text(600), icon: text(40), image }, { _id: false })],
    },
    projects: {
      eyebrow: text(80),
      title: text(80),
      viewAllLabel: text(60),
    },
    cta: {
      eyebrow: text(120),
      title: text(120),
      buttons: [buttonSchema],
    },
    // ── Trayectoria (página Sobre mí) ──
    resumeTitles: {
      skills: { ...text(60), default: 'Stack tecnológico' },
      experience: { ...text(60), default: 'Experiencia profesional' },
      education: { ...text(60), default: 'Formación académica' },
      languages: { ...text(60), default: 'Idiomas' },
      methodologies: { ...text(60), default: 'Metodologías' },
      certifications: { ...text(60), default: 'Certificaciones' },
      certificates: { ...text(60), default: 'Mis certificados' },
    },
    skills: [
      new Schema(
        {
          category: text(60),
          items: [new Schema({ name: text(40), icon: text(40), image }, { _id: false })],
        },
        { _id: false },
      ),
    ],
    experience: [
      new Schema(
        {
          role: text(100),
          company: text(100),
          location: text(80),
          mode: { type: String, enum: ['', 'Presencial', 'Remoto', 'Híbrido'], default: '' },
          start: text(7), // 'YYYY-MM'
          end: text(7), // vacío = actualidad
          periodLabel: text(40), // opcional: reemplaza las fechas (ej: "Ago & Nov 2024")
          description: text(1500),
        },
        { _id: false },
      ),
    ],
    education: [
      new Schema(
        {
          title: text(120),
          institution: text(120),
          location: text(80),
          details: text(300),
          start: text(7),
          end: text(7),
          periodLabel: text(40),
          icon: text(40),
        },
        { _id: false },
      ),
    ],
    languages: [
      new Schema(
        { name: text(40), level: text(60), percent: { type: Number, min: 0, max: 100, default: 50 } },
        { _id: false },
      ),
    ],
    methodologies: [text(40)],
    certifications: [new Schema({ name: text(120), issuer: text(120), date: text(30) }, { _id: false })],
    // Galería "Mis certificados": imagen (subida o URL) y/o enlace (PDF subido, Canva, Credly…)
    certificates: [
      new Schema({ title: text(120), issuer: text(120), date: text(30), image, url: link }, { _id: false }),
    ],

    whatsapp: {
      enabled: { type: Boolean, default: true },
      phone: text(30), // vacío = usa profile.phone
      title: { ...text(60), default: 'Escríbeme por WhatsApp' },
      status: { ...text(80), default: 'Normalmente respondo en pocas horas' },
      greeting: { ...text(400), default: '¡Hola! 👋 Gracias por visitar mi portafolio. ¿En qué puedo ayudarte?' },
      placeholder: { ...text(80), default: 'Escribe tu mensaje…' },
      prefix: { ...text(200), default: 'Hola, te escribo desde tu portafolio:' },
    },
    footer: {
      description: text(600),
      linksTitle: text(60),
      contactTitle: text(60),
      socialsTitle: text(60),
      copyright: text(120),
      // Botones "Descargar en Android / iPhone" (instalan la web como app)
      install: {
        show: { type: Boolean, default: true },
        title: { ...text(80), default: 'Lleva mi portafolio en tu celular' },
        androidLabel: { ...text(30), default: 'Android' },
        iosLabel: { ...text(30), default: 'iPhone' },
      },
    },
  },
  opts,
)

// ── Skills agrupadas por categoría ──────────────────────────
const skillGroupSchema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    items: [{ _id: false, name: { type: String, required: true }, icon: String }],
  },
  opts,
)

// ── Experiencia laboral ─────────────────────────────────────
const experienceSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: String,
    start: { type: String, required: true },
    end: { type: String, default: null },
    description: [String],
    tech: [String],
    order: { type: Number, default: 0 },
  },
  opts,
)

// ── Proyectos ───────────────────────────────────────────────
const projectSchema = new Schema(
  {
    title: { ...text(100), required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: text(1500),
    image,
    tags: [text(40)],
    repo: link,
    demo: link,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts,
)

// ── Educación ───────────────────────────────────────────────
const educationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    start: String,
    end: String,
    description: String,
    order: { type: Number, default: 0 },
  },
  opts,
)

// ── Mensajes del formulario de contacto ─────────────────────
const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
  },
  opts,
)

// ── Imágenes subidas desde el panel ─────────────────────────
const mediaSchema = new Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: '' }, // nombre original (para descargas, ej: CV.pdf)
    size: Number,
  },
  { timestamps: true },
)

export const Site = model('Site', siteSchema)
export const SkillGroup = model('SkillGroup', skillGroupSchema)
export const Experience = model('Experience', experienceSchema)
export const Project = model('Project', projectSchema)
export const Education = model('Education', educationSchema)
export const Message = model('Message', messageSchema)
export const Media = model('Media', mediaSchema)
