import {
  BRAND,
  COLORS,
  CTAS,
  FINANCING,
  COMPETITORS,
  DIFFERENTIATORS,
  ORGANIC_PILLARS,
} from '../data/campaign'

export function BrandKit() {
  return (
    <div>
      {/* Tagline */}
      <div className="tagline-card">
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          {BRAND.company} · {BRAND.group}
        </div>
        <div className="quote">
          &ldquo;Tu hogar merece energia que <span>nunca te abandone</span>.&rdquo;
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 620, margin: '16px auto 0', fontSize: 14.5 }}>
          {BRAND.valueProp}
        </p>
      </div>

      {/* Colores */}
      <div className="section-title">Paleta de marca</div>
      <div className="grid swatch-grid">
        {COLORS.map((c) => (
          <div key={c.hex} className="swatch">
            <div className="swatch-color" style={{ background: c.hex }} />
            <div className="swatch-info">
              <b>{c.name}</b>
              <span>{c.hex}</span>
              <div style={{ fontSize: 12, color: '#5c6b83', marginTop: 6 }}>{c.use}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Diferenciadores */}
      <div className="section-title">Como se diferencia Lumina</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {DIFFERENTIATORS.map((d, i) => (
          <div key={d} className="card info-row">
            <div className="idx">{i + 1}</div>
            <div>
              <h4>{d}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Posicionamiento vs competencia */}
      <div className="section-title">Posicionamiento vs competencia</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {COMPETITORS.map((c) => (
          <div key={c.name} className="card compare-card">
            <h4>{c.name}</h4>
            <div className="their">Su fuerte: {c.strength}</div>
            <div className="ours">Lumina: {c.diff}</div>
          </div>
        ))}
      </div>

      {/* Regla de oro */}
      <div className="callout" style={{ marginTop: 24 }}>
        <div className="ico">🏆</div>
        <div>
          <h4>Regla de oro de ventas: cuota, no precio total</h4>
          <p>
            Nunca liderar con el precio total del sistema. Siempre con la cuota mensual. Ej: en vez de &ldquo;sistema de
            $18,000&rdquo;, decir &ldquo;desde $150/mes — menos que tu factura actual&rdquo;.
          </p>
        </div>
      </div>

      {/* Financiamiento */}
      <div className="section-title">Tabla de financiamiento</div>
      <div className="card table-wrap">
        <table className="fin-table">
          <thead>
            <tr>
              <th>Sistema</th>
              <th>Valor</th>
              <th>Plazo</th>
              <th>Cuota</th>
              <th>Mensaje clave</th>
            </tr>
          </thead>
          <tbody>
            {FINANCING.map((f, i) => (
              <tr key={i}>
                <td>{f.system}</td>
                <td>${f.value.toLocaleString()}</td>
                <td>{f.term} anos ({f.rate}%)</td>
                <td><span className="mono">Desde ${f.monthly}/mes</span></td>
                <td>{f.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTAs */}
      <div className="section-title">Banco de CTAs aprobados</div>
      <div className="cta-bank">
        {CTAS.map((c) => (
          <span key={c} className="pill pill-navy" style={{ fontSize: 13, padding: '9px 14px', textTransform: 'none', letterSpacing: 0 }}>
            {c}
          </span>
        ))}
      </div>

      {/* Contenido organico */}
      <div className="section-title">Pilares de contenido organico</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        {ORGANIC_PILLARS.map((p) => (
          <div key={p.title} className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, color: '#0A2342' }}>{p.title}</div>
            <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 5 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#8a97ac', marginTop: 14 }}>
        Frecuencia: 2 publicaciones/semana en FB e IG (martes y jueves). Historias con mayor frecuencia si hay material
        de campo. Contacto cliente: {BRAND.contactClient}.
      </p>
    </div>
  )
}
