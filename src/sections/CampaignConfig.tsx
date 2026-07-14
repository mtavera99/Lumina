import { useState } from 'react'
import { CAMPAIGN_CONFIG, LAUNCH_CHECKLIST, BUDGET } from '../data/campaign'

export function CampaignConfig() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const doneCount = Object.values(checked).filter(Boolean).length

  const toggle = (i: number) => setChecked((c) => ({ ...c, [i]: !c[i] }))

  return (
    <div>
      <div className="callout" style={{ marginBottom: 24 }}>
        <div className="ico">🧭</div>
        <div>
          <h4>Guia de configuracion en Meta, de cero al lanzamiento</h4>
          <p>
            Sigue las fases en orden. Esta pensada para la Fase de Validacion del Mes 1 con ${BUDGET.total.toLocaleString()}{' '}
            de presupuesto. Objetivo: captar leads calificados al menor costo posible y con datos para optimizar.
          </p>
        </div>
      </div>

      <div className="config-steps">
        {CAMPAIGN_CONFIG.map((phase, pi) => (
          <div key={pi} className="card config-phase">
            <div className="config-phase-head">
              <span className="config-ico">{phase.icon}</span>
              <div>
                <h3>{phase.phase}</h3>
                <p>{phase.goal}</p>
              </div>
            </div>
            <ul className="config-list">
              {phase.steps.map((s, si) => (
                <li key={si}>
                  <span className="config-dot" />
                  <div>
                    <div className="config-detail">{s.detail}</div>
                    {s.tip && (
                      <div className="config-tip">
                        <b>💡 Tip:</b> {s.tip}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Checklist de pre-lanzamiento */}
      <div className="section-title">
        Checklist de pre-lanzamiento ({doneCount}/{LAUNCH_CHECKLIST.length})
      </div>
      <div className="card" style={{ padding: 22 }}>
        {LAUNCH_CHECKLIST.map((item, i) => (
          <label key={i} className="checklist-row">
            <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} />
            <span className={checked[i] ? 'done' : ''}>{item}</span>
          </label>
        ))}
        {doneCount === LAUNCH_CHECKLIST.length && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 10, fontWeight: 700, textAlign: 'center' }}>
            ✅ Todo listo. Puedes publicar la campana.
          </div>
        )}
      </div>
    </div>
  )
}
