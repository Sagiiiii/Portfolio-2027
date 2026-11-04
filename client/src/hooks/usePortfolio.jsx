import { createContext, useContext, useEffect, useState } from 'react'
import { portfolio as localData } from '../data/portfolio'
import { API_URL } from '../lib/links'

// Datos del portafolio compartidos por todas las páginas.
// Se muestran los datos locales al instante y se reemplazan por los de la API (MongoDB) al llegar.
const PortfolioContext = createContext({ data: localData, source: 'local' })

export function PortfolioProvider({ children }) {
  const [state, setState] = useState({ data: localData, source: 'local' })

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/api/portfolio`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        if (!cancelled && json?.site) setState({ data: { ...localData, ...json }, source: 'api' })
      })
      .catch(() => console.warn('[portfolio] API no disponible, usando datos locales'))
    return () => {
      cancelled = true
    }
  }, [])

  return <PortfolioContext.Provider value={state}>{children}</PortfolioContext.Provider>
}

export const usePortfolio = () => useContext(PortfolioContext)
