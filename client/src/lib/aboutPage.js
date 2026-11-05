// Configuración de los botones de la página /about.
// Si la base de datos aún no la tiene, se crea una por defecto con tu GitHub (de Redes sociales).
export function getAboutPage(site) {
  if (site.aboutPage) return { showCv: true, buttons: [], ...site.aboutPage }
  const github = site.socials?.find((s) => s.icon === 'github')
  return {
    showCv: true,
    buttons: github ? [{ label: 'GitHub', url: github.url, variant: 'outline', icon: 'github' }] : [],
  }
}
