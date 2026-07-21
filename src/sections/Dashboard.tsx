import { BUDGET, KPIS, FUNNEL, PILLARS, BRAND, ADS } from '../data/campaign'

export function Dashboard({ onNavigateAds }: { onNavigateAds: () => void }) {
  return (
    <div>
      {/* Hero resumen */}
      <div className="card" style={{ padding: 26, marginBottom: 30, background: 'linear-gradient(135deg,#0A2342,#061831)', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#C9A84C', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          Campana de lanzamiento · Meta Ads
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, margin: '10px 0 8px', maxWidth: 620 }}>
          {BRAND.tagline}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 640, fontSize: 14.5 }}>{BRAND.valueProp}</p>
        <div className="mobile-action-row" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={onNavigateAds}>
            ✍️ Ver creativos listos para Meta
          </button>
          <span className="pill pill-gold" style={{ alignSelf: 'center' }}>Oferta: {BRAND.offer}</span>
        </div>
      </div>

      {/* Presupuesto */}
      <div className="section-title">Presupuesto — Fase de Validacion (Mes 1)</div>
      <div className="grid budget-grid">
        {BUDGET.stages.map((s) => (
          <div key={s.key} className={`card budget-card ${s.key}`}>
            <div className="budget-pct">{s.pct}%</div>
            <div className="budget-amt">≈ ${s.amount.toLocaleString()} USD</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0A2342', marginTop: 8 }}>{s.label}</div>
            <div className="budget-obj">{s.objective}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 20, marginTop: 18 }}>
        <div className="budget-summary" style={{ fontSize: 13, fontWeight: 600 }}>
          <span>Distribucion del presupuesto total</span>
          <span style={{ color: '#0A2342', fontWeight: 800 }}>${BUDGET.total.toLocaleString()} USD</span>
        </div>
        <div className="bar" style={{ height: 12 }}>
          {BUDGET.stages.map((s) => (
            <span key={s.key} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.pct}%`} />
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="section-title">KPIs objetivo</div>
      <div className="grid stat-grid">
        {KPIS.map((k) => (
          <div key={k.label} className="card stat">
            <div className="stat-label">{k.label}</div>
            <div className="stat-value">{k.value}</div>
            <div className="stat-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pilares */}
      <div className="section-title">Los 5 pilares del mensaje</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))' }}>
        {PILLARS.map((p) => (
          <div key={p.key} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 26 }}>{p.icon}</div>
            <div style={{ fontWeight: 800, color: '#0A2342', marginTop: 6 }}>{p.label}</div>
            <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="section-title">Arquitectura del funnel (6 pasos)</div>
      <div className="card">
        {FUNNEL.map((f, i) => (
          <div key={f.title} className="funnel-step">
            <div className="funnel-num">{i + 1}</div>
            <div className="funnel-body">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="callout" style={{ marginTop: 24 }}>
        <div className="ico">⏱️</div>
        <div>
          <h4>Regla critica de seguimiento</h4>
          <p>Contacta cada lead en menos de 10 minutos. Un lead respondido rapido vale 5x mas. Tienes {ADS.length} creativos listos para lanzar la campana.</p>
        </div>
      </div>
    </div>
  )
}
