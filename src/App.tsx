import { useState } from 'react'
import { Logo } from './components/Logo'
import { PasswordGate } from './components/PasswordGate'
import { Dashboard } from './sections/Dashboard'
import { AdLibrary } from './sections/AdLibrary'
import { ImagePrompts } from './sections/ImagePrompts'
import { ContentCalendar } from './sections/ContentCalendar'
import { Calculator } from './sections/Calculator'
import { LandingPage } from './sections/LandingPage'
import { CampaignConfig } from './sections/CampaignConfig'
import { BrandKit } from './sections/BrandKit'
import { BRAND } from './data/campaign'

type Route = 'dashboard' | 'ads' | 'prompts' | 'content' | 'calculator' | 'landing' | 'config' | 'brand'

interface NavDef {
  key: Route
  label: string
  icon: string
  title: string
  subtitle: string
  locked?: boolean
}

// Contrasena de acceso a las secciones restringidas (solo Santiago Tavera).
const ACCESS_PASSWORD = 'Lumina2026'
const UNLOCK_KEY = 'lumina_unlocked_v1'

const NAV: NavDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', title: 'Dashboard de Campana', subtitle: 'Presupuesto, KPIs objetivo y arquitectura del funnel', locked: true },
  { key: 'ads', label: 'Anuncios', icon: '✍️', title: 'Biblioteca de Anuncios', subtitle: 'Creativos listos para pegar en Meta Ads Manager' },
  { key: 'prompts', label: 'Prompts de Imagenes', icon: '🎨', title: 'Prompts de Imagenes', subtitle: 'Prompts para Nano Banana / Gemini y otras apps de imagen', locked: true },
  { key: 'content', label: 'Parrilla de Contenido', icon: '📅', title: 'Parrilla de Contenido', subtitle: 'Calendario de publicaciones organicas para Facebook e Instagram' },
  { key: 'calculator', label: 'Calculadora', icon: '🧮', title: 'Calculadora de Ahorro Solar', subtitle: 'Estima sistema, cuota mensual y ahorro segun la factura' },
  { key: 'landing', label: 'Landing', icon: '🌞', title: 'Landing de Captacion', subtitle: 'Pagina de destino del anuncio + gestion de leads' },
  { key: 'config', label: 'Configuracion Meta', icon: '⚙️', title: 'Configuracion de la Campana', subtitle: 'Guia paso a paso para montar la campana en Meta', locked: true },
  { key: 'brand', label: 'Brand Kit', icon: '🎨', title: 'Brand Kit', subtitle: 'Marca, financiamiento, CTAs y posicionamiento' },
]

export default function App() {
  const [route, setRoute] = useState<Route>('ads')
  const [unlocked, setUnlocked] = useState<boolean>(
    () => sessionStorage.getItem(UNLOCK_KEY) === 'true',
  )
  const current = NAV.find((n) => n.key === route)!

  const tryUnlock = (pw: string): boolean => {
    if (pw === ACCESS_PASSWORD) {
      setUnlocked(true)
      sessionStorage.setItem(UNLOCK_KEY, 'true')
      return true
    }
    return false
  }

  const lock = () => {
    setUnlocked(false)
    sessionStorage.removeItem(UNLOCK_KEY)
  }

  const isBlocked = !!current.locked && !unlocked

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
              {n.locked && !unlocked && <span className="nav-lock">🔒</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {unlocked && (
            <button className="lock-btn" onClick={lock}>
              🔓 Bloquear secciones
            </button>
          )}
          {BRAND.company}
          <br />
          {BRAND.group} · Marketing interno
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <h1>
              {current.title} {current.locked && <span className="lock-badge">🔒 Solo Santiago Tavera</span>}
            </h1>
            <p>{current.subtitle}</p>
          </div>
          <div className="topbar-badge">Fase Validacion · Mes 1</div>
        </header>
        <main className="content">
          {isBlocked ? (
            <PasswordGate sectionName={current.title} onUnlock={tryUnlock} />
          ) : (
            <>
              {route === 'dashboard' && <Dashboard onNavigateAds={() => setRoute('ads')} />}
              {route === 'ads' && <AdLibrary />}
              {route === 'prompts' && <ImagePrompts />}
              {route === 'content' && <ContentCalendar />}
              {route === 'calculator' && <Calculator />}
              {route === 'landing' && <LandingPage />}
              {route === 'config' && <CampaignConfig />}
              {route === 'brand' && <BrandKit />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
