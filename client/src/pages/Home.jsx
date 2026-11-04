import { useRef } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import Hero from '../components/home/Hero'
import AboutTeaser from '../components/home/AboutTeaser'
import Services from '../components/home/Services'
import ProjectsShowcase from '../components/home/ProjectsShowcase'
import CallToAction from '../components/CallToAction'

export default function Home({ ready }) {
  const { data } = usePortfolio()
  const root = useRef(null)
  useScrollAnimations(root, [data])

  return (
    <div ref={root}>
      <Hero site={data.site} play={ready} />
      <AboutTeaser about={data.site.about} name={data.site.profile.name} />
      <Services section={data.site.services} />
      <ProjectsShowcase section={data.site.projects} projects={data.projects} />
      <CallToAction />
    </div>
  )
}
