import { useState } from 'react'
import { Logo } from './components/Logo'
import { Dashboard } from './sections/Dashboard'
import { AdLibrary } from './sections/AdLibrary'
import { Calculator } from './sections/Calculator'
import { LandingPage } from './sections/LandingPage'
import { BrandKit } from './sections/BrandKit'
import { BRAND } from './data/campaign'

type Route = 'dashboard' | 'ads' | 'calculator' | 'landing' | 'brand'

interface NavDef {
  key: Route
  label: string
  icon: string
  title: string
  subtitle: string
}

const NAV: NavDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', title: 'Dashboard de Campana', subtitle: 'Presupuesto, KPIs objetivo y arquitectura del funnel' },
  { key: 'ads', label: 'Anuncios', icon: '✍️', title: 'Biblioteca de Anuncios', subtitle: 'Creativos listos para pegar en Meta Ads Manager' },
  { key: 'calculator', label: 'Calculadora', icon: '🧮', title: 'Calculadora de Ahorro Solar', subtitle: 'Estima sistema, cuota mensual y ahorro segun la factura' },
  { key: 'landing', label: 'Landing', icon: '🌞', title: 'Landing de Captacion', subtitle: 'Pagina de destino del anuncio + gestion de leads' },
  { key: 'brand', label: 'Brand Kit', icon: '🎨', title: 'Brand Kit', subtitle: 'Marca, financiamiento, CTAs y posicionamiento' },
]

export default function App() {
  const [route, setRoute] = useState<Route>('dashboard')
  const current = NAV.find((n) => n.key === route)!

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <Logo />
          <div>
            <div className="brand-name">
              LUMINA<span>PR</span>
            </div>
            <div className="brand-sub">Campaign Studio</div>
          </div>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${route === n.key ? 'active' : ''}`}
              onClick={() => setRoute(n.key)}
            >
              <span className="nav-ico">{n.icon}</span>
              <span className="label">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {BRAND.company}
          <br />
          {BRAND.group} · Marketing interno
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
          </div>
          <div className="topbar-badge">Fase Validacion · Mes 1</div>
        </header>
        <main className="content">
          {route === 'dashboard' && <Dashboard onNavigateAds={() => setRoute('ads')} />}
          {route === 'ads' && <AdLibrary />}
          {route === 'calculator' && <Calculator />}
          {route === 'landing' && <LandingPage />}
          {route === 'brand' && <BrandKit />}
        </main>
      </div>
    </div>
  )
}
