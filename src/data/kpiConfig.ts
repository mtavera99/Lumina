import type { Insights } from '../services/meta'

// ============================================================
//  Motor de KPIs: evalua cada metrica contra su objetivo y,
//  si esta mal, propone soluciones especificas para una campana
//  de captacion de leads solares en Meta.
// ============================================================

export type KpiStatus = 'good' | 'warning' | 'bad' | 'info'

export interface KpiDef {
  key: keyof Insights
  label: string
  group: 'Meta (automatico)' | 'Negocio (CRM)'
  target: string
  format: (v: number) => string
  // Devuelve el estado del KPI segun su valor.
  evaluate?: (v: number) => KpiStatus
  // Consejos cuando el KPI no esta en verde.
  advice?: string[]
}

const money = (v: number) => `$${v.toFixed(2)}`
const money0 = (v: number) => `$${Math.round(v).toLocaleString()}`
const pct = (v: number) => `${v.toFixed(2)}%`
const pct0 = (v: number) => `${Math.round(v)}%`
const num = (v: number) => Math.round(v).toLocaleString()
const dec = (v: number) => v.toFixed(2)

export const KPI_DEFS: KpiDef[] = [
  // -------------------- Informativas (sin semaforo) --------------------
  { key: 'spend', label: 'Gasto', group: 'Meta (automatico)', target: 'Presupuesto', format: money0 },
  { key: 'impressions', label: 'Impresiones', group: 'Meta (automatico)', target: 'Volumen', format: num },
  { key: 'reach', label: 'Alcance', group: 'Meta (automatico)', target: 'Personas unicas', format: num },
  { key: 'clicks', label: 'Clics', group: 'Meta (automatico)', target: 'Interaccion', format: num },
  { key: 'cpm', label: 'CPM', group: 'Meta (automatico)', target: 'Costo x 1000 impr.', format: money },

  // -------------------- Con semaforo --------------------
  {
    key: 'ctr',
    label: 'CTR',
    group: 'Meta (automatico)',
    target: '>= 1.5%',
    format: pct,
    evaluate: (v) => (v >= 1.5 ? 'good' : v >= 1.0 ? 'warning' : 'bad'),
    advice: [
      'El creativo no esta conectando: prueba nuevos ganchos por pilar (respaldo, ahorro, financiamiento).',
      'Refresca imagenes/videos si la frecuencia ya pasa de 2-3 (fatiga de anuncio).',
      'En Reels, usa el primer segundo para el dolor: apagon o factura alta.',
      'Afina el publico a propietarios de 30-65 en Puerto Rico.',
    ],
  },
  {
    key: 'cpc',
    label: 'CPC',
    group: 'Meta (automatico)',
    target: '<= $0.80',
    format: money,
    evaluate: (v) => (v <= 0.8 ? 'good' : v <= 1.5 ? 'warning' : 'bad'),
    advice: [
      'CPC alto suele venir de baja relevancia: mejora el creativo o el gancho.',
      'Publico demasiado estrecho: amplialo o activa expansion Advantage+.',
      'Prueba ubicaciones automaticas (Advantage+) para encontrar clics mas baratos.',
    ],
  },
  {
    key: 'frequency',
    label: 'Frecuencia',
    group: 'Meta (automatico)',
    target: '<= 2.5',
    format: dec,
    evaluate: (v) => (v <= 2.5 ? 'good' : v <= 3.5 ? 'warning' : 'bad'),
    advice: [
      'Fatiga de anuncio: sube 1-2 creativos nuevos esta semana.',
      'Amplia el publico o activa la expansion de audiencia.',
      'Excluye a quienes ya enviaron el formulario para no repetirles.',
    ],
  },
  {
    key: 'cpl',
    label: 'CPL (costo por lead)',
    group: 'Meta (automatico)',
    target: '$20 - $40',
    format: money,
    evaluate: (v) => (v <= 40 ? 'good' : v <= 60 ? 'warning' : 'bad'),
    advice: [
      'Cambia el angulo del creativo hacia el pilar con mejor CTR.',
      'Prueba Formularios Instantaneos de Meta: suelen bajar el CPL.',
      'Reduce friccion en la landing: menos campos y carga rapida en movil.',
      'Verifica que el evento "Lead" dispare bien; sin el, Meta no optimiza.',
      'Deja pasar la fase de aprendizaje: no edites los primeros 3-4 dias.',
    ],
  },
  {
    key: 'leads',
    label: 'Leads',
    group: 'Meta (automatico)',
    target: '50 - 100 / mes',
    format: num,
    evaluate: (v) => (v >= 50 ? 'good' : v >= 25 ? 'warning' : 'info'),
    advice: [
      'Volumen bajo: sube presupuesto en el conjunto con mejor CPL.',
      'Anade mas variantes de creativo para ampliar el alcance util.',
    ],
  },
  {
    key: 'qualifiedRate',
    label: '% Leads calificados',
    group: 'Negocio (CRM)',
    target: '>= 60%',
    format: pct0,
    evaluate: (v) => (v >= 60 ? 'good' : v >= 45 ? 'warning' : 'bad'),
    advice: [
      'Atraes volumen pero poca calidad: si usas Formularios Instantaneos, cambia a landing (leads mas calificados).',
      'Anade una pregunta de calificacion: casa propia y rango de factura.',
      'Afina la segmentacion a propietarios con factura suficiente.',
    ],
  },
  {
    key: 'appointmentRate',
    label: '% Citas agendadas',
    group: 'Negocio (CRM)',
    target: '>= 30% de calificados',
    format: pct0,
    evaluate: (v) => (v >= 30 ? 'good' : v >= 20 ? 'warning' : 'bad'),
    advice: [
      'Responde en menos de 10 minutos: un lead frio se enfria rapido.',
      'Usa las plantillas de primer contacto para agendar en el primer mensaje.',
      'Ofrece dia y hora concretos en vez de "cuando puedas".',
    ],
  },
  {
    key: 'closeRate',
    label: 'Tasa de cierre',
    group: 'Negocio (CRM)',
    target: '>= 40% de citas',
    format: pct0,
    evaluate: (v) => (v >= 40 ? 'good' : v >= 30 ? 'warning' : 'bad'),
    advice: [
      'Refuerza el guion de manejo de objeciones: precio -> cuota mensual.',
      'Confirma la cita el dia anterior para reducir ausencias.',
      'Lleva la propuesta con la cuota (desde $150/mes), no el precio total.',
    ],
  },
  {
    key: 'cpa',
    label: 'CPA (costo por cliente)',
    group: 'Negocio (CRM)',
    target: '< $1,000',
    format: money0,
    evaluate: (v) => (v <= 1000 ? 'good' : v <= 1500 ? 'warning' : 'bad'),
    advice: [
      'Sube presupuesto a los conjuntos/creativos con mejor CPL.',
      'Pausa lo que tiene CTR < 1% y CPL alto.',
      'Mejora la tasa de cierre: impacta el CPA de forma directa.',
    ],
  },
  {
    key: 'avgResponseMin',
    label: 'Tiempo de respuesta',
    group: 'Negocio (CRM)',
    target: '< 10 min',
    format: (v) => `${Math.round(v)} min`,
    evaluate: (v) => (v <= 10 ? 'good' : v <= 30 ? 'warning' : 'bad'),
    advice: [
      'Activa notificaciones instantaneas de nuevos leads.',
      'Ten plantillas listas para responder en segundos.',
      'Define turnos en el equipo para que nunca pase de 10 minutos.',
    ],
  },
]

export interface KpiResult {
  def: KpiDef
  value: number
  status: KpiStatus
}

export function evaluateAll(data: Insights): KpiResult[] {
  return KPI_DEFS.map((def) => {
    const value = data[def.key]
    const status: KpiStatus = def.evaluate ? def.evaluate(value) : 'info'
    return { def, value, status }
  })
}

export const STATUS_LABEL: Record<KpiStatus, string> = {
  good: 'En objetivo',
  warning: 'Atencion',
  bad: 'Critico',
  info: 'Informativo',
}
