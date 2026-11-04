import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PortfolioProvider } from './hooks/usePortfolio'
import App from './App.jsx'
import './index.css'

// El panel se descarga solo cuando se visita (no pesa en la web pública)
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/:key/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <PortfolioProvider>
              <App />
            </PortfolioProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
