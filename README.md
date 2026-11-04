# Portfolio 2027

Portafolio personal con estilo IDE (VS Code) + panel de administración para gestionar el contenido sin tocar código.

## Stack

| Capa | Tecnología | Plan gratuito |
|------|-----------|---------------|
| Frontend | React + Vite + Tailwind CSS v4 + GSAP + Lenis | Vercel / Netlify |
| Backend | Node.js + Express | Render / Railway |
| Base de datos | MongoDB Atlas (Mongoose) | Atlas M0 (512 MB) |
| Imágenes | Cloudinary | 25 GB |
| Auth admin | JWT + bcrypt | — |

## Estructura

```
portfolio_2027/
├── client/                    # Web pública (+ panel admin más adelante)
│   └── src/
│       ├── pages/             # Home, About, Projects, Contact (rutas con react-router)
│       ├── components/        # Navbar, Footer, Preloader, Cursor, PageTransition, ProjectCard...
│       │   └── home/          # Hero (+ escena animada), AboutTeaser, Services, ProjectsShowcase
│       ├── hooks/             # usePortfolio (datos API/local), useScrollAnimations (data-anim)
│       ├── data/              # portfolio.js → datos de ejemplo (misma forma que la API)
│       └── lib/               # gsap (plugins), iconos, formateo
└── server/                    # API Express + MongoDB Atlas
```

### Animaciones

GSAP + ScrollTrigger + SplitText + Flip, con scroll suave (Lenis). Cualquier elemento puede animarse
añadiendo `data-anim="heading|lines|fade|stagger|image|scale|parallax"` (ver `hooks/useScrollAnimations.js`).
Se desactivan automáticamente si el sistema tiene "reducir movimiento" activado.

## Desarrollo local

```bash
# 1. Instalar todo (raíz + client + server)
npm run install:all

# 2. Configurar Atlas: copia server/.env.example → server/.env y pega tu MONGODB_URI

# 3. Cargar los datos iniciales en Atlas (solo la primera vez)
npm run seed

# 4. Levantar API + web a la vez
npm run dev
#   web → http://localhost:5173
#   api → http://localhost:4000/api/portfolio
```

| Comando (raíz) | Qué hace |
|---|---|
| `npm run dev` | API (4000) + web (5173) en paralelo |
| `npm run seed` | Carga `client/src/data/portfolio.js` en la BD si está vacía |
| `npm run seed:force` | Borra el contenido y lo recarga (no borra mensajes) |

### API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado de la API y de la BD |
| GET | `/api/portfolio` | Perfil, skills, experiencia, proyectos y educación |
| POST | `/api/messages` | Guarda un mensaje del formulario (máx. 5 / 15 min por IP) |


## Panel de administración

- URL: **http://localhost:5173/admin/sagiii** (la ruta se cambia en `client/.env` → `VITE_ADMIN_PATH`)
- Protegido con contraseña + token JWT (7 días). Cambiar contraseña: `npm run set-password -- NuevaClave` y reiniciar.
- Edita: perfil, portada, tarjeta `const dev` (stack con iconos o logos propios), redes sociales, Sobre mí,
  servicios, proyectos (con imagen), bloque "Déjame ayudarte", footer y lee los mensajes de contacto.
- Las imágenes se comprimen en el navegador (WEBP, máx. 1600px) y se guardan en MongoDB (`/api/media/:id`).

## Hoja de ruta

- [x] **Paso 1** — Plantilla visual estilo IDE con datos locales
- [x] **Paso 2** — API Express + MongoDB Atlas (`GET /api/portfolio`, `POST /api/messages`, seed)
- [x] **Paso 3** — Autenticación del admin (login con JWT)
- [x] **Paso 4** — Panel de administración: perfil, portada, redes, sobre mí, servicios, proyectos, CTA, footer
- [ ] **Paso 4b** — Panel: skills, experiencia y educación (página Sobre mí)
- [x] **Paso 5** — Subida de imágenes (guardadas en MongoDB)
- [ ] **Paso 6** — Aviso por email al recibir mensajes (ya se guardan en la BD)
- [ ] **Paso 7** — Deploy (Vercel + Render + Atlas)
