import { useMemo, useState } from 'react'
import { FINANCING, type FinancingRow } from '../data/campaign'

// Selecciona el sistema mas pequeno cuya cuota mensual no supere la factura actual.
// Si la factura es muy alta, recomienda el mayor. Usa plazo de 20 anos (cuota mas baja).
function recommend(bill: number): FinancingRow {
  const term20 = FINANCING.filter((f) => f.term === 20).sort((a, b) => a.monthly - b.monthly)
  const fit = [...term20].reverse().find((f) => f.monthly <= bill)
  return fit ?? term20[0]
}

export function Calculator() {
  const [bill, setBill] = useState(250)
  const [term, setTerm] = useState<15 | 20>(20)

  const base = useMemo(() => recommend(bill), [bill])
  const plan = useMemo(
    () => FINANCING.find((f) => f.kw === base.kw && f.term === term) ?? base,
    [base, term],
  )

  // Ahorro estimado: la diferencia entre lo que paga hoy y la cuota, proyectada.
  const monthlySaving = Math.max(bill - plan.monthly, 0)
  const yearSaving = monthlySaving * 12
  const savingPct = bill > 0 ? Math.round((monthlySaving / bill) * 100) : 0

  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">🧮</div>
        <div>
          <h4>Herramienta orientativa</h4>
          <p>
            Estimacion basada en la tabla de financiamiento de Lumina. Las cifras finales se confirman en la evaluacion
            solar gratuita, tras revisar la factura y el consumo real del hogar.
          </p>
        </div>
      </div>

      <div className="calc-wrap">
        <div className="card calc-input-card">
          <h3 style={{ color: '#0A2342', marginBottom: 18 }}>Datos del hogar</h3>

          <div className="field">
            <label>Factura electrica mensual promedio</label>
            <div className="range-value">${bill}</div>
            <input
              type="range"
              min={80}
              max={600}
              step={10}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              style={{ accentColor: '#C9A84C' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8a97ac', marginTop: 4 }}>
              <span>$80</span>
              <span>$600+</span>
            </div>
          </div>

          <div className="field">
            <label>Plazo de financiamiento</label>
            <div className="choice-row">
              <button className={`chip ${term === 20 ? 'active' : ''}`} onClick={() => setTerm(20)}>
                20 anos · cuota mas baja
              </button>
              <button className={`chip ${term === 15 ? 'active' : ''}`} onClick={() => setTerm(15)}>
                15 anos · mas ahorro
              </button>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: 16, background: '#f4f6fb', borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#5c6b83', fontWeight: 600 }}>Sistema recomendado</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0A2342', marginTop: 3 }}>{plan.system}</div>
            <div style={{ fontSize: 12.5, color: '#8a97ac', marginTop: 4 }}>
              {plan.kw}kW · {plan.panels} placas · plazo {plan.term} anos ({plan.rate}%)
            </div>
          </div>
        </div>

        <div className="card calc-result-card">
          <div className="res-label">Tu cuota mensual estimada</div>
          <div className="res-big">${plan.monthly}<span style={{ fontSize: 18 }}>/mes</span></div>
          <div style={{ fontSize: 13, color: '#C9A84C', fontWeight: 700, marginBottom: 12 }}>{plan.message}</div>

          <div className="res-row">
            <span>Pagas hoy a LUMA</span>
            <span>${bill}/mes</span>
          </div>
          <div className="res-row">
            <span>Cuota del sistema solar</span>
            <span>${plan.monthly}/mes</span>
          </div>
          <div className="res-row">
            <span>Diferencia mensual</span>
            <span style={{ color: monthlySaving > 0 ? '#C9A84C' : '#fff' }}>
              {monthlySaving > 0 ? `≈ $${monthlySaving}/mes` : 'Similar a tu factura'}
            </span>
          </div>
          <div className="res-row">
            <span>Estimado anual</span>
            <span>{monthlySaving > 0 ? `≈ $${yearSaving.toLocaleString()}` : '—'}</span>
          </div>

          {monthlySaving > 0 ? (
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(201,168,76,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: '#fff' }}>
                Podrias reducir hasta <b style={{ color: '#C9A84C' }}>{savingPct}%</b> vs tu factura actual y ademas
                proteger tu hogar de los apagones.
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                Por una cuota parecida a tu factura, ganas respaldo ante apagones e independencia de LUMA — y el sistema
                queda tuyo.
              </div>
            </div>
          )}

          <div className="res-note">
            Estimacion orientativa. La cuota final depende de tu consumo, la evaluacion tecnica y las opciones de
            financiamiento disponibles.
          </div>
        </div>
      </div>
    </div>
  )
}
