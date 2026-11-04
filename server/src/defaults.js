// ─────────────────────────────────────────────────────────────
// Contenido por defecto del portafolio.
// - El servidor lo usa para crear la configuración inicial en MongoDB.
// - El cliente tiene una copia (client/src/data/portfolio.js) como respaldo
//   si la API no responde.
// Después de la primera carga, TODO se edita desde el panel /admin.
// ─────────────────────────────────────────────────────────────

const bio = [
  'Soy desarrollador full stack con pasión por crear productos digitales que resuelven problemas reales. Me gusta escribir código limpio, mantenible y con buena experiencia de usuario.',
  'Trabajo principalmente con el ecosistema JavaScript: React en el frontend y Node.js con MongoDB en el backend. Siempre estoy aprendiendo algo nuevo.',
]

export const portfolio = {
  site: {
    profile: {
      name: 'Tu Nombre',
      shortName: 'tunombre',
      headline: 'Un desarrollador de Software',
      bio,
      email: 'tu@email.com',
      phone: '',
      location: 'Ciudad, País',
      available: true,
      cv: '',
    },

    hero: {
      greeting: 'Hola, soy',
      tagline: 'Construyo aplicaciones web rápidas, accesibles y bien diseñadas.',
      role: 'Full Stack Developer',
      codeAction: 'ideas',
      // icon: clave de la lista de tecnologías (react, nodejs...) | image: imagen subida (tiene prioridad)
      stack: [
        { name: 'React', icon: 'react', image: '' },
        { name: 'JavaScript', icon: 'javascript', image: '' },
        { name: 'TypeScript', icon: 'typescript', image: '' },
        { name: 'Node.js', icon: 'nodejs', image: '' },
        { name: 'MongoDB', icon: 'mongodb', image: '' },
        { name: 'Tailwind', icon: 'tailwind', image: '' },
      ],
      buttons: [{ label: 'Ver mis proyectos', url: '/projects', variant: 'primary' }],
    },

    socials: [
      { name: 'GitHub', url: 'https://github.com/', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com/', icon: 'linkedin' },
      { name: 'Email', url: 'mailto:tu@email.com', icon: 'email' },
    ],

    about: {
      eyebrow: 'Permíteme presentarme',
      title: 'Sobre mí',
      text: bio[0],
      image: '',
      buttons: [
        { label: 'Proyectos', url: '/projects', variant: 'primary' },
        { label: 'Leer más', url: '/about', variant: 'outline' },
      ],
    },

    services: {
      eyebrow: 'Lo que haré por ti',
      title: 'Servicios',
      items: [
        { title: 'Desarrollo Web', description: 'Creo sitios y aplicaciones web de alto rendimiento, optimizados y escalables.', icon: 'web', image: '' },
        { title: 'Backend', description: 'Desarrollo APIs robustas y seguras con conexión a bases de datos SQL y NoSQL.', icon: 'backend', image: '' },
        { title: 'Frontend', description: 'Diseño interfaces atractivas e intuitivas para que el usuario interactúe con la información.', icon: 'frontend', image: '' },
      ],
    },

    projects: {
      eyebrow: 'Algunos de mis trabajos recientes',
      title: 'Proyectos',
      viewAllLabel: 'Ver todos los proyectos',
    },

    cta: {
      eyebrow: '¿Tienes un proyecto en mente?',
      title: 'Déjame que te ayude',
      buttons: [{ label: 'Contactar ahora', url: '/contact', variant: 'primary' }],
    },

    footer: {
      description: bio[0],
      linksTitle: 'Enlaces',
      contactTitle: 'Información de contacto',
      socialsTitle: 'Redes sociales',
      copyright: '© {year} - {name}',
    },
  },

  projects: [
    {
      title: 'E-commerce App',
      slug: 'ecommerce-app',
      description: 'Tienda online con carrito, pagos y panel de administración para gestionar productos y pedidos.',
      image: '',
      tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      repo: 'https://github.com/',
      demo: 'https://example.com',
      featured: true,
      published: true,
    },
    {
      title: 'Task Manager',
      slug: 'task-manager',
      description: 'Gestor de tareas con tableros tipo kanban, arrastrar y soltar y sincronización en tiempo real.',
      image: '',
      tags: ['React', 'Express', 'Socket.io'],
      repo: 'https://github.com/',
      demo: '',
      featured: true,
      published: true,
    },
    {
      title: 'Weather Dashboard',
      slug: 'weather-dashboard',
      description: 'Dashboard del clima con gráficos, geolocalización y búsqueda de ciudades.',
      image: '',
      tags: ['JavaScript', 'API', 'Chart.js'],
      repo: 'https://github.com/',
      demo: 'https://example.com',
      featured: false,
      published: true,
    },
    {
      title: 'Blog API',
      slug: 'blog-api',
      description: 'API REST para un blog con autenticación JWT, roles y subida de imágenes.',
      image: '',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      repo: 'https://github.com/',
      demo: '',
      featured: false,
      published: true,
    },
  ],

  skills: [
    {
      category: 'frontend',
      items: [
        { name: 'React', icon: 'react' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Tailwind', icon: 'tailwind' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'HTML', icon: 'html' },
        { name: 'CSS', icon: 'css' },
      ],
    },
    {
      category: 'backend',
      items: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express', icon: 'express' },
        { name: 'Python', icon: 'python' },
      ],
    },
    {
      category: 'database',
      items: [
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'PostgreSQL', icon: 'postgresql' },
      ],
    },
    {
      category: 'tools',
      items: [
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
        { name: 'Docker', icon: 'docker' },
        { name: 'Vite', icon: 'vite' },
        { name: 'Figma', icon: 'figma' },
      ],
    },
  ],

  experience: [
    {
      role: 'Full Stack Developer',
      company: 'Empresa Actual',
      location: 'Remoto',
      start: '2024-01',
      end: null,
      description: [
        'Desarrollo de aplicaciones web con React y Node.js.',
        'Diseño de APIs REST y modelado de datos en MongoDB.',
        'Mejora del rendimiento y la accesibilidad del frontend.',
      ],
      tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    },
    {
      role: 'Frontend Developer',
      company: 'Empresa Anterior',
      location: 'Ciudad, País',
      start: '2022-03',
      end: '2023-12',
      description: [
        'Maquetación de interfaces responsive a partir de diseños en Figma.',
        'Integración con APIs y manejo de estado en React.',
      ],
      tech: ['React', 'JavaScript', 'CSS'],
    },
  ],

  education: [
    {
      title: 'Ingeniería de Sistemas',
      institution: 'Universidad',
      start: '2018',
      end: '2023',
      description: 'Formación en desarrollo de software, bases de datos y redes.',
    },
    {
      title: 'Bootcamp Full Stack',
      institution: 'Academia Online',
      start: '2021',
      end: '2021',
      description: 'Programa intensivo de React, Node.js y MongoDB.',
    },
  ],
}
