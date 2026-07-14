import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchInsights,
  loadConfig,
  saveConfig,
  DEFAULT_CONFIG,
  type MetaConfig,
  type Insights,
  type InsightsResult,
} from '../services/meta'
import { evaluateAll, STATUS_LABEL, type KpiResult, type KpiStatus } from '../data/kpiConfig'

const REFRESH_MS = 60_000
const BUSINESS_KEY = 'lumina_business_v1'

type Business = Pick<Insights, 'qualifiedRate' | 'appointmentRate' | 'closeRate' | 'cpa' | 'avgResponseMin'>

const DEFAULT_BUSINESS: Business = {
  qualifiedRate: 52,
  appointmentRate: 33,
  closeRate: 43,
  cpa: 780,
  avgResponseMin: 8,
}

function loadBusiness(): Business {
  try {
    const raw = localStorage.getItem(BUSINESS_KEY)
    if (raw) return { ...DEFAULT_BUSINESS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_BUSINESS }
}

const statusClass: Record<KpiStatus, string> = {
  good: 'kpi-good',
  warning: 'kpi-warning',
  bad: 'kpi-bad',
  info: 'kpi-info',
}
const statusDot: Record<KpiStatus, string> = { good: '🟢', warning: '🟡', bad: '🔴', info: '⚪' }

export function Metrics() {
  const [config, setConfig] = useState<MetaConfig>(loadConfig)
  const [business, setBusiness] = useState<Business>(loadBusiness)
  const [result, setResult] = useState<InsightsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [now, setNow] = useState(Date.now())
  const timer = useRef<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetchInsights(config, business)
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener metricas')
    } finally {
      setLoading(false)
    }
  }, [config, business])

  // Carga inicial + auto-refresh
  useEffect(() => {
    load()
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(load, REFRESH_MS)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [load])

  // Reloj para "actualizado hace Xs"
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const results: KpiResult[] = result ? evaluateAll(result.data) : []
  const alerts = results.filter((r) => r.status === 'bad' || r.status === 'warning')
  const bad = alerts.filter((a) => a.status === 'bad')
  const warn = alerts.filter((a) => a.status === 'warning')

  const secsAgo = result ? Math.max(0, Math.round((now - result.fetchedAt) / 1000)) : 0
  const connected = result && result.source !== 'demo'

  const metaKpis = results.filter((r) => r.def.group === 'Meta (automatico)')
  const bizKpis = results.filter((r) => r.def.group === 'Negocio (CRM)')

  const applyConfig = (patch: Partial<MetaConfig>) => setConfig((c) => ({ ...c, ...patch }))
  const persist = () => {
    saveConfig(config)
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(business))
    setShowPanel(false)
    load()
  }

  return (
    <div>
      {/* Barra de estado */}
      <div className="metrics-topbar card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className={`conn-badge ${connected ? 'on' : 'demo'}`}>
            {connected ? '● Conectado a Meta' : '● Modo demostracion'}
          </span>
          <span style={{ fontSize: 13, color: '#5c6b83' }}>
            {loading ? 'Actualizando…' : result ? `Actualizado hace ${secsAgo}s` : '—'}
          </span>
          <span style={{ fontSize: 12, color: '#8a97ac' }}>Rango: {config.datePreset}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
            ↻ Refrescar
          </button>
          <button className="btn btn-navy btn-sm" onClick={() => setShowPanel((s) => !s)}>
            ⚙ Conexion
          </button>
        </div>
      </div>

      {!connected && (
        <div className="callout" style={{ marginBottom: 20 }}>
          <div className="ico">🔌</div>
          <div>
            <h4>Datos de demostracion (aun sin conectar)</h4>
            <p>
              Todo esta listo para Meta. Abre <b>Conexion</b> y pega tu proxy (recomendado) o tu ID de cuenta + token de
              prueba. En cuanto conectes, estas mismas tarjetas mostraran tus numeros reales y las alertas se calcularan
              solas. Se refresca cada 60 segundos.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="callout" style={{ marginBottom: 20, background: '#fdecec', borderColor: '#f3caca' }}>
          <div className="ico">⚠️</div>
          <div>
            <h4 style={{ color: 'var(--red)' }}>No se pudo conectar</h4>
            <p style={{ color: '#8a3a3a' }}>{error}</p>
          </div>
        </div>
      )}

      {result?.warning && (
        <div className="callout" style={{ marginBottom: 20 }}>
          <div className="ico">🔐</div>
          <div>
            <h4>Nota de seguridad</h4>
            <p>{result.warning}</p>
          </div>
        </div>
      )}

      {/* Panel de conexion */}
      {showPanel && (
        <div className="card conn-panel">
          <h3 style={{ color: '#0A2342', marginBottom: 4 }}>Configuracion de conexion</h3>
          <p style={{ fontSize: 13, color: '#5c6b83', marginBottom: 16 }}>
            Para produccion segura usa un proxy (funcion serverless) que guarde el token. El token nunca deberia ir en el
            navegador de un sitio publico.
          </p>

          <div className="field">
            <label>Modo</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className={`chip ${config.mode === 'demo' ? 'active' : ''}`} onClick={() => applyConfig({ mode: 'demo' })}>
                Demostracion
              </button>
              <button className={`chip ${config.mode === 'live' ? 'active' : ''}`} onClick={() => applyConfig({ mode: 'live' })}>
                Conectar a Meta
              </button>
            </div>
          </div>

          <div className="field">
            <label>URL del proxy (recomendado)</label>
            <input
              value={config.proxyUrl}
              placeholder="https://tu-proyecto.vercel.app/api/meta-insights"
              onChange={(e) => applyConfig({ proxyUrl: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>ID de cuenta publicitaria (solo prueba)</label>
              <input value={config.accountId} placeholder="act_123456789" onChange={(e) => applyConfig({ accountId: e.target.value })} />
            </div>
            <div className="field">
              <label>Rango de fechas</label>
              <select value={config.datePreset} onChange={(e) => applyConfig({ datePreset: e.target.value })}>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="last_7d">Ultimos 7 dias</option>
                <option value="last_14d">Ultimos 14 dias</option>
                <option value="last_30d">Ultimos 30 dias</option>
                <option value="this_month">Este mes</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Token de acceso (solo prueba, no en publico)</label>
            <input
              type="password"
              value={config.accessToken}
              placeholder="EAAB..."
              onChange={(e) => applyConfig({ accessToken: e.target.value })}
            />
          </div>

          <div className="section-title" style={{ marginTop: 10 }}>Metricas de negocio (del CRM, manuales por ahora)</div>
          <div className="biz-grid">
            {(
              [
                ['qualifiedRate', '% calificados'],
                ['appointmentRate', '% citas'],
                ['closeRate', '% cierre'],
                ['cpa', 'CPA ($)'],
                ['avgResponseMin', 'Respuesta (min)'],
              ] as [keyof Business, string][]
            ).map(([k, label]) => (
              <div className="field" key={k} style={{ marginBottom: 0 }}>
                <label>{label}</label>
                <input
                  type="number"
                  value={business[k]}
                  onChange={(e) => setBusiness((b) => ({ ...b, [k]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button className="btn btn-primary" onClick={persist}>Guardar y aplicar</button>
            <button className="btn btn-ghost" onClick={() => { setConfig({ ...DEFAULT_CONFIG }); setBusiness({ ...DEFAULT_BUSINESS }) }}>
              Restablecer
            </button>
          </div>
        </div>
      )}

      {/* Panel de alertas */}
      <div className="section-title">
        Diagnostico automatico {alerts.length > 0 ? `· ${bad.length} criticos, ${warn.length} en atencion` : ''}
      </div>
      {alerts.length === 0 ? (
        <div className="card" style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div style={{ fontSize: 14, color: '#1f9d63', fontWeight: 600 }}>
            Todos los KPIs estan en objetivo. Sigue monitoreando y escala lo que funciona.
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gap: 14 }}>
          {[...bad, ...warn].map((a) => (
            <div key={a.def.key} className={`card alert-card ${statusClass[a.status]}`}>
              <div className="alert-head">
                <span className="alert-dot">{statusDot[a.status]}</span>
                <div>
                  <b>{a.def.label}</b> — {a.def.format(a.value)}{' '}
                  <span className="alert-status">{STATUS_LABEL[a.status]}</span>
                  <div className="alert-target">Objetivo: {a.def.target}</div>
                </div>
              </div>
              {a.def.advice && (
                <ul className="alert-solutions">
                  {a.def.advice.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* KPIs de Meta */}
      <div className="section-title">Metricas de Meta (automaticas)</div>
      <div className="grid kpi-grid">
        {metaKpis.map((r) => (
          <KpiCard key={r.def.key} r={r} />
        ))}
      </div>

      {/* KPIs de negocio */}
      <div className="section-title">Metricas de negocio (del CRM)</div>
      <div className="grid kpi-grid">
        {bizKpis.map((r) => (
          <KpiCard key={r.def.key} r={r} />
        ))}
      </div>
    </div>
  )
}

function KpiCard({ r }: { r: KpiResult }) {
  return (
    <div className={`card kpi-card ${statusClass[r.status]}`}>
      <div className="kpi-top">
        <span className="kpi-label">{r.def.label}</span>
        {r.status !== 'info' && <span className="kpi-dot">{statusDot[r.status]}</span>}
      </div>
      <div className="kpi-value">{r.def.format(r.value)}</div>
      <div className="kpi-target">Obj: {r.def.target}</div>
    </div>
  )
}
