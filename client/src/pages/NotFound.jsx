import { TLink } from '../components/PageTransition'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-svh flex-col items-center justify-center text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="title-xl mt-3">Página no encontrada</h1>
      <TLink to="/" className="btn-primary mt-10">
        Volver al inicio
      </TLink>
    </section>
  )
}
