// ============================================================
//  Servicio de conexion con la Meta Marketing API (Insights)
// ------------------------------------------------------------
//  Esta es la UNICA capa que habla con Meta. La seccion de
//  Metricas solo consume fetchInsights(). Para pasar de DEMO a
//  DATOS REALES no hay que tocar la interfaz: solo configurar
//  la conexion (panel de la seccion) o las variables de abajo.
// ============================================================

// Version de la Graph API. Actualizala si Meta publica una nueva.
export const META_API_VERSION = 'v21.0'

// Campos de insights que pedimos a Meta (objetivo: captacion de leads).
export const META_INSIGHTS_FIELDS = [
  'spend',
  'impressions',
  'reach',
  'frequency',
  'clicks',
  'ctr',
  'cpc',
  'cpm',
  'actions',
  'cost_per_action_type',
].join(',')

export type ConnectionMode = 'demo' | 'live' | 'manual'

export interface ManualMetrics {
  spend: number
  impressions: number
  reach: number
  clicks: number
  leads: number
}

export interface MetaConfig {
  mode: ConnectionMode
  // Recomendado en produccion: URL de tu funcion serverless (proxy) que
  // guarda el token en secreto y devuelve los insights. Mas seguro.
  proxyUrl: string
  // Solo para PRUEBAS rapidas (NO usar en un sitio publico): ID de cuenta
  // publicitaria (formato act_XXXXXXXXX) y token de acceso.
  accountId: string
  accessToken: string
  // Modo manual: numeros que el usuario copia del Administrador de Anuncios.
  manual: ManualMetrics
  // Rango: today | yesterday | last_7d | last_14d | last_30d | this_month
  datePreset: string
}

export const DEFAULT_MANUAL: ManualMetrics = {
  spend: 0,
  impressions: 0,
  reach: 0,
  clicks: 0,
  leads: 0,
}

export const DEFAULT_CONFIG: MetaConfig = {
  mode: 'demo',
  proxyUrl: '',
  accountId: '',
  accessToken: '',
  manual: { ...DEFAULT_MANUAL },
  datePreset: 'last_7d',
}

const CONFIG_KEY = 'lumina_meta_config_v1'

export function loadConfig(): MetaConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_CONFIG }
}

export function saveConfig(cfg: MetaConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}

// Metricas normalizadas que usa toda la app.
export interface Insights {
  // Provenientes de Meta (automaticas)
  spend: number
  impressions: number
  reach: number
  frequency: number
  clicks: number
  ctr: number // %
  cpc: number // $
  cpm: number // $
  leads: number
  cpl: number // $
  // De negocio / CRM (manuales hasta integrar el CRM)
  qualifiedRate: number // % de leads calificados
  appointmentRate: number // % de calificados que agendan cita
  closeRate: number // % de citas que cierran
  cpa: number // costo por adquisicion ($)
  avgResponseMin: number // tiempo medio de respuesta (min)
}

export interface InsightsResult {
  data: Insights
  source: 'demo' | 'proxy' | 'meta' | 'manual'
  fetchedAt: number
  warning?: string
}

// Convierte los 5 numeros que el usuario copia del Administrador de Anuncios
// en el set completo de metricas (calcula CTR, CPC, CPM, CPL y frecuencia).
export function manualInsights(manual: ManualMetrics, business: Partial<typeof DEMO_BUSINESS> = {}): Insights {
  const spend = Number(manual.spend) || 0
  const impressions = Number(manual.impressions) || 0
  const reach = Number(manual.reach) || 0
  const clicks = Number(manual.clicks) || 0
  const leads = Number(manual.leads) || 0
  const b = { ...DEMO_BUSINESS, ...business }
  return {
    spend,
    impressions,
    reach,
    frequency: reach ? impressions / reach : 0,
    clicks,
    ctr: impressions ? (clicks / impressions) * 100 : 0,
    cpc: clicks ? spend / clicks : 0,
    cpm: impressions ? (spend / impressions) * 1000 : 0,
    leads,
    cpl: leads ? spend / leads : 0,
    ...b,
  }
}

// -------------------- DEMO --------------------
// Valores base realistas para una campana de leads recien lanzada.
// Deliberadamente disparan algunas alertas para mostrar el motor de KPIs.
const DEMO_BASE = {
  spend: 400,
  impressions: 42000,
  reach: 15500, // frecuencia ~2.7 (atencion: fatiga)
  clicks: 525, // CTR ~1.25% (atencion)
  leads: 15, // CPL ~$27 (bien)
}

// Metricas de negocio (vienen del CRM; editables en el panel de conexion).
const DEMO_BUSINESS = {
  qualifiedRate: 52, // atencion (<60%)
  appointmentRate: 33, // bien
  closeRate: 43, // bien
  cpa: 780, // bien (<1000)
  avgResponseMin: 8, // bien (<10)
}

const jitter = (v: number, pct = 0.04) => v * (1 + (Math.random() * 2 - 1) * pct)

function demoInsights(business: Partial<typeof DEMO_BUSINESS> = {}): Insights {
  const spend = jitter(DEMO_BASE.spend)
  const impressions = Math.round(jitter(DEMO_BASE.impressions))
  const reach = Math.round(jitter(DEMO_BASE.reach))
  const clicks = Math.round(jitter(DEMO_BASE.clicks))
  const leads = Math.max(1, Math.round(jitter(DEMO_BASE.leads)))
  const b = { ...DEMO_BUSINESS, ...business }
  return {
    spend,
    impressions,
    reach,
    frequency: impressions / reach,
    clicks,
    ctr: (clicks / impressions) * 100,
    cpc: spend / clicks,
    cpm: (spend / impressions) * 1000,
    leads,
    cpl: spend / leads,
    ...b,
  }
}

// -------------------- Mapeo de la respuesta de Meta --------------------
interface MetaAction {
  action_type: string
  value: string
}
interface MetaInsightsRow {
  spend?: string
  impressions?: string
  reach?: string
  frequency?: string
  clicks?: string
  ctr?: string
  cpc?: string
  cpm?: string
  actions?: MetaAction[]
  cost_per_action_type?: MetaAction[]
}

const LEAD_ACTION_TYPES = [
  'lead',
  'leadgen.other',
  'onsite_conversion.lead_grouped',
  'offsite_conversion.fb_pixel_lead',
]

function sumLeads(actions?: MetaAction[]): number {
  if (!actions) return 0
  return actions
    .filter((a) => LEAD_ACTION_TYPES.some((t) => a.action_type.includes(t) || a.action_type === t))
    .reduce((acc, a) => acc + Number(a.value || 0), 0)
}

// Convierte una fila de la Graph API a nuestro formato. Las metricas de
// negocio se completan con lo que haya guardado el usuario (CRM manual).
export function mapMetaRow(row: MetaInsightsRow, business: Partial<typeof DEMO_BUSINESS> = {}): Insights {
  const spend = Number(row.spend || 0)
  const impressions = Number(row.impressions || 0)
  const reach = Number(row.reach || 0)
  const clicks = Number(row.clicks || 0)
  const leads = sumLeads(row.actions)
  const b = { ...DEMO_BUSINESS, ...business }
  return {
    spend,
    impressions,
    reach,
    frequency: row.frequency ? Number(row.frequency) : reach ? impressions / reach : 0,
    clicks,
    ctr: row.ctr ? Number(row.ctr) : impressions ? (clicks / impressions) * 100 : 0,
    cpc: row.cpc ? Number(row.cpc) : clicks ? spend / clicks : 0,
    cpm: row.cpm ? Number(row.cpm) : impressions ? (spend / impressions) * 1000 : 0,
    leads,
    cpl: leads ? spend / leads : 0,
    ...b,
  }
}

// -------------------- Fetch principal --------------------
export async function fetchInsights(cfg: MetaConfig, business?: Partial<typeof DEMO_BUSINESS>): Promise<InsightsResult> {
  // Modo demo: datos simulados con pequenas variaciones (sensacion "en vivo").
  if (cfg.mode === 'demo') {
    return { data: demoInsights(business), source: 'demo', fetchedAt: Date.now() }
  }

  // Modo manual: numeros reales que el usuario copio del Administrador de Anuncios.
  if (cfg.mode === 'manual') {
    return { data: manualInsights(cfg.manual || DEFAULT_MANUAL, business), source: 'manual', fetchedAt: Date.now() }
  }

  // 1) Opcion recomendada: proxy serverless propio.
  if (cfg.proxyUrl) {
    const url = `${cfg.proxyUrl}${cfg.proxyUrl.includes('?') ? '&' : '?'}date_preset=${encodeURIComponent(cfg.datePreset)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Proxy respondio ${res.status}`)
    const json = await res.json()
    // El proxy puede devolver el formato de Meta ({data:[...]}) o ya normalizado.
    if (json && Array.isArray(json.data)) {
      const row = json.data[0] ?? {}
      return { data: mapMetaRow(row, business), source: 'proxy', fetchedAt: Date.now() }
    }
    return { data: { ...demoInsights(business), ...json }, source: 'proxy', fetchedAt: Date.now() }
  }

  // 2) Prueba directa contra la Graph API (solo para test; no en publico).
  if (cfg.accountId && cfg.accessToken) {
    const base = `https://graph.facebook.com/${META_API_VERSION}/${cfg.accountId}/insights`
    const params = new URLSearchParams({
      fields: META_INSIGHTS_FIELDS,
      date_preset: cfg.datePreset,
      level: 'account',
      access_token: cfg.accessToken,
    })
    const res = await fetch(`${base}?${params.toString()}`)
    const json = await res.json()
    if (json.error) throw new Error(json.error.message || 'Error de la Graph API')
    const row = (json.data && json.data[0]) || {}
    return {
      data: mapMetaRow(row, business),
      source: 'meta',
      fetchedAt: Date.now(),
      warning: 'Conexion directa con token en el navegador: usar solo para pruebas. En produccion usa un proxy.',
    }
  }

  throw new Error('Configura un proxy o un ID de cuenta + token para conectar con Meta.')
}
