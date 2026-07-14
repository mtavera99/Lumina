import { useEffect, useState } from 'react'
import { BRAND, PR_MUNICIPIOS } from '../data/campaign'

interface Lead {
  id: string
  createdAt: string
  nombre: string
  telefono: string
  municipio: string
  vivienda: string
  factura: string
  bateria: boolean
  financiamiento: boolean
}

const STORAGE_KEY = 'lumina_leads_v1'

function loadLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const emptyForm = {
  nombre: '',
  telefono: '',
  municipio: '',
  vivienda: '',
  factura: '',
  bateria: false,
  financiamiento: false,
}

export function LandingPage() {
  const [form, setForm] = useState({ ...emptyForm })
  const [submitted, setSubmitted] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    setLeads(loadLeads())
  }, [])

  const update = (field: keyof typeof emptyForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...form,
    }
    const next = [lead, ...leads]
    setLeads(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSubmitted(true)
    setForm({ ...emptyForm })
    setTimeout(() => setSubmitted(false), 4000)
  }

  const exportCsv = () => {
    const headers = ['Fecha', 'Nombre', 'Telefono', 'Municipio', 'Vivienda', 'Factura', 'Bateria', 'Financiamiento']
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleString('es-PR'),
      l.nombre,
      l.telefono,
      l.municipio,
      l.vivienda,
      l.factura,
      l.bateria ? 'Si' : 'No',
      l.financiamiento ? 'Si' : 'No',
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-lumina-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearLeads = () => {
    if (confirm('Borrar todos los leads guardados en este navegador?')) {
      localStorage.removeItem(STORAGE_KEY)
      setLeads([])
    }
  }

  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">🌞</div>
        <div>
          <h4>Pagina de destino del anuncio</h4>
          <p>
            Esta es la landing a la que llega el clic desde Meta. El formulario captura los datos del paso 3 del funnel.
            En esta demo los leads se guardan en tu navegador y puedes exportarlos a CSV; para produccion se conectan a
            tu CRM o a un webhook.
          </p>
        </div>
      </div>

      {/* Landing preview */}
      <div className="landing">
        <div className="landing-hero">
          <div>
            <div className="eyebrow">Evaluacion solar gratuita</div>
            <h2>{BRAND.tagline}</h2>
            <p>{BRAND.valueProp}</p>
            <ul className="landing-benefits">
              <li><span className="check">✓</span> Reduce tu factura desde el primer mes</li>
              <li><span className="check">✓</span> Respaldo ante apagones con bateria</li>
              <li><span className="check">✓</span> Financiamiento desde $150/mes, sin pagar de contado</li>
              <li><span className="check">✓</span> Acompanamiento completo, de principio a fin</li>
            </ul>
          </div>

          <form className="lead-form" onSubmit={submit}>
            {submitted ? (
              <div className="form-success">
                <div className="big">🎉</div>
                <div style={{ fontSize: 17, color: '#0A2342', marginTop: 8 }}>Gracias! Recibimos tu solicitud.</div>
                <p style={{ fontWeight: 400, color: '#5c6b83', fontSize: 13.5, marginTop: 6 }}>
                  Un asesor te contactara en menos de 10 minutos.
                </p>
              </div>
            ) : (
              <>
                <h3>Solicita tu evaluacion gratuita</h3>
                <div className="form-sub">Sin compromiso · Respuesta en menos de 10 minutos</div>

                <div className="field">
                  <label>Nombre completo</label>
                  <input required value={form.nombre} onChange={(e) => update('nombre', e.target.value)} placeholder="Tu nombre" />
                </div>
                <div className="field">
                  <label>Telefono</label>
                  <input
                    required
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => update('telefono', e.target.value)}
                    placeholder="787-000-0000"
                  />
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Municipio</label>
                    <select required value={form.municipio} onChange={(e) => update('municipio', e.target.value)}>
                      <option value="">Selecciona</option>
                      {PR_MUNICIPIOS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Tipo de vivienda</label>
                    <select required value={form.vivienda} onChange={(e) => update('vivienda', e.target.value)}>
                      <option value="">Selecciona</option>
                      <option>Casa propia</option>
                      <option>Casa alquilada</option>
                      <option>Apartamento</option>
                      <option>Comercial</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Factura electrica mensual aproximada</label>
                  <select required value={form.factura} onChange={(e) => update('factura', e.target.value)}>
                    <option value="">Selecciona</option>
                    <option>Menos de $100</option>
                    <option>$100 - $200</option>
                    <option>$200 - $350</option>
                    <option>$350 - $500</option>
                    <option>Mas de $500</option>
                  </select>
                </div>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.bateria} onChange={(e) => update('bateria', e.target.checked)} />
                  Me interesa incluir bateria de respaldo
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.financiamiento}
                    onChange={(e) => update('financiamiento', e.target.checked)}
                  />
                  Quiero conocer opciones de financiamiento
                </label>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 6 }}>
                  Solicita tu evaluacion gratuita →
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Leads capturados */}
      <div className="leads-bar">
        <div className="section-title" style={{ margin: 0 }}>
          Leads capturados ({leads.length})
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-navy btn-sm" onClick={exportCsv} disabled={leads.length === 0}>
            ⬇ Exportar CSV
          </button>
          {leads.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearLeads}>
              Borrar
            </button>
          )}
        </div>
      </div>

      <div className="card table-wrap">
        {leads.length === 0 ? (
          <div className="empty-state">Aun no hay leads. Prueba el formulario de arriba para ver como se registran.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Municipio</th>
                <th>Vivienda</th>
                <th>Factura</th>
                <th>Bateria</th>
                <th>Financ.</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.createdAt).toLocaleString('es-PR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{l.nombre}</td>
                  <td>{l.telefono}</td>
                  <td>{l.municipio}</td>
                  <td>{l.vivienda}</td>
                  <td>{l.factura}</td>
                  <td>{l.bateria ? '✔' : '—'}</td>
                  <td>{l.financiamiento ? '✔' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
