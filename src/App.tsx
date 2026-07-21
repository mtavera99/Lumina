import { useEffect, useRef, useState } from 'react'
import { Logo } from './components/Logo'
import { PasswordGate } from './components/PasswordGate'
import { Dashboard } from './sections/Dashboard'
import { Metrics } from './sections/Metrics'
import { AdLibrary } from './sections/AdLibrary'
import { ImagePrompts } from './sections/ImagePrompts'
import { ContentCalendar } from './sections/ContentCalendar'
import { Calculator } from './sections/Calculator'
import { LandingPage } from './sections/LandingPage'
import { CampaignConfig } from './sections/CampaignConfig'
import { BrandKit } from './sections/BrandKit'
import { Intelligence } from './sections/Intelligence'
import { BRAND } from './data/campaign'

type Route = 'dashboard' | 'metrics' | 'intelligence' | 'ads' | 'prompts' | 'content' | 'calculator' | 'landing' | 'config' | 'brand'

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
  { key: 'metrics', label: 'Metricas en vivo', icon: '📈', title: 'Metricas en Tiempo Real', subtitle: 'Rendimiento de la campana, alertas de KPIs y soluciones', locked: true },
  { key: 'intelligence', label: 'Lumina Intelligence', icon: '🧠', title: 'Lumina Intelligence', subtitle: 'Reuniones, contexto y automatizaciones privadas', locked: true },
  { key: 'ads', label: 'Anuncios', icon: '✍️', title: 'Biblioteca de Anuncios', subtitle: 'Creativos listos para pegar en Meta Ads Manager' },
  { key: 'prompts', label: 'Prompts de Imagenes', icon: '🎨', title: 'Prompts de Imagenes', subtitle: 'Prompts para Nano Banana / Gemini y otras apps de imagen', locked: true },
  { key: 'content', label: 'Parrilla de Contenido', icon: '📅', title: 'Parrilla de Contenido', subtitle: 'Calendario de publicaciones organicas para Facebook e Instagram' },
  { key: 'calculator', label: 'Calculadora', icon: '🧮', title: 'Calculadora de Ahorro Solar', subtitle: 'Estima sistema, cuota mensual y ahorro segun la factura' },
  { key: 'landing', label: 'Landing', icon: '🌞', title: 'Landing de Captacion', subtitle: 'La landing en vivo de la campana (OpenSolar + pixel de Meta)' },
  { key: 'config', label: 'Configuracion Meta', icon: '⚙️', title: 'Configuracion de la Campana', subtitle: 'Guia paso a paso para montar la campana en Meta', locked: true },
  { key: 'brand', label: 'Brand Kit', icon: '🎨', title: 'Brand Kit', subtitle: 'Marca, financiamiento, CTAs y posicionamiento' },
]

export default function App() {
  const [route, setRoute] = useState<Route>('ads')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [unlocked, setUnlocked] = useState<boolean>(
    () => sessionStorage.getItem(UNLOCK_KEY) === 'true',
  )
  const current = NAV.find((n) => n.key === route)!
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobileViewport = window.matchMedia('(max-width: 760px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) setMobileNavOpen(false)
    }
    mobileViewport.addEventListener('change', closeOnDesktop)
    return () => mobileViewport.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen || !window.matchMedia('(max-width: 760px)').matches) return

    const sidebar = sidebarRef.current
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusable = () => Array.from(sidebar?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])

    document.body.style.overflow = 'hidden'
    mainRef.current?.setAttribute('inert', '')
    focusable()[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      mainRef.current?.removeAttribute('inert')
      ;(previouslyFocused ?? menuButtonRef.current)?.focus()
    }
  }, [mobileNavOpen])

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
    <div className={`app ${mobileNavOpen ? 'nav-open' : ''}`}>
      <button type="button" className="sidebar-backdrop" aria-label="Cerrar menu" tabIndex={-1} onClick={() => setMobileNavOpen(false)} />
      <aside
        id="mobile-navigation"
        ref={sidebarRef}
        className="sidebar"
        aria-label="Navegacion principal"
        aria-modal={mobileNavOpen || undefined}
        role={mobileNavOpen ? 'dialog' : undefined}
      >
        <div className="brand">
          <Logo />
          <div>
            <div className="brand-name">
              LUMINA<span>PR</span>
            </div>
            <div className="brand-sub">Campaign Studio</div>
          </div>
          <button type="button" className="sidebar-close" aria-label="Cerrar menu" onClick={() => setMobileNavOpen(false)}>×</button>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${route === n.key ? 'active' : ''}`}
              onClick={() => {
                setRoute(n.key)
                setMobileNavOpen(false)
              }}
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

      <div ref={mainRef} className="main" aria-hidden={mobileNavOpen || undefined}>
        <header className="topbar">
          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-btn"
            aria-label="Abrir menu"
            aria-controls="mobile-navigation"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
          >
            <span /> <span /> <span />
          </button>
          <div className="topbar-copy">
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
              {route === 'metrics' && <Metrics />}
              {route === 'intelligence' && <Intelligence />}
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
