// ============================================================
//  Proxy seguro de Insights de la Meta Marketing API
// ------------------------------------------------------------
//  La pagina de Metricas de Lumina llama a esta funcion (modo
//  "proxy") en lugar de hablar directo con Meta. Asi el token
//  vive SOLO en las variables de entorno de Netlify y nunca se
//  expone en el navegador de un sitio publico.
//
//  Variables de entorno (Netlify):
//    META_ACCESS_TOKEN   (obligatorio)  Token de acceso con permiso ads_read.
//    META_AD_ACCOUNT_ID  (obligatorio)  ID de la cuenta publicitaria (act_XXXXXXXXX).
//    META_API_VERSION    (opcional)     Version de la Graph API (por defecto v21.0).
//    METRICS_ALLOWED_ORIGINS (opcional) Origenes permitidos para CORS,
//                                       separados por coma. Ej:
//                                       https://mtavera99.github.io
//
//  Uso desde la app:  GET /.netlify/functions/meta-insights?date_preset=last_7d
//  Devuelve el formato nativo de Meta: { "data": [ { ...insights } ] }
//  (la app ya sabe mapearlo con mapMetaRow()).
// ============================================================

const API_VERSION = process.env.META_API_VERSION || 'v21.0'

const INSIGHTS_FIELDS = [
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

// Rangos que acepta Meta; evitamos inyectar valores raros.
const VALID_PRESETS = new Set([
  'today',
  'yesterday',
  'last_7d',
  'last_14d',
  'last_30d',
  'this_month',
  'last_month',
  'maximum',
])

function corsHeaders(req) {
  const allowed = (process.env.METRICS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const origin = req.headers.get('origin') || ''
  const headers = {
    'Content-Type': 'application/json',
    Vary: 'Origin',
  }
  if (allowed.length === 0) {
    // Sin allowlist: permitimos cualquier origen (util en pruebas).
    headers['Access-Control-Allow-Origin'] = '*'
  } else if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
  headers['Access-Control-Allow-Headers'] = 'Content-Type'
  return headers
}

export default async (req) => {
  const headers = corsHeaders(req)

  // Preflight de CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Metodo no permitido' }), { status: 405, headers })
  }

  const token = process.env.META_ACCESS_TOKEN
  let accountId = process.env.META_AD_ACCOUNT_ID
  if (!token || !accountId) {
    return new Response(
      JSON.stringify({
        error:
          'Faltan variables de entorno: configura META_ACCESS_TOKEN y META_AD_ACCOUNT_ID en Netlify.',
      }),
      { status: 500, headers },
    )
  }
  // Aceptamos el id con o sin el prefijo "act_".
  if (!accountId.startsWith('act_')) accountId = `act_${accountId}`

  const url = new URL(req.url)
  let datePreset = url.searchParams.get('date_preset') || 'last_7d'
  if (!VALID_PRESETS.has(datePreset)) datePreset = 'last_7d'
  const level = url.searchParams.get('level') || 'account'

  const params = new URLSearchParams({
    fields: INSIGHTS_FIELDS,
    date_preset: datePreset,
    level,
    access_token: token,
  })

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${accountId}/insights?${params.toString()}`,
    )
    const json = await res.json()

    if (json.error) {
      return new Response(
        JSON.stringify({ error: json.error.message || 'Error de la Graph API de Meta' }),
        { status: 502, headers },
      )
    }

    // Devolvemos el formato nativo de Meta ({ data: [...] }); la app lo mapea.
    return new Response(JSON.stringify({ data: json.data || [] }), { status: 200, headers })
  } catch (e) {
    return new Response(JSON.stringify({ error: `No se pudo consultar Meta: ${String(e)}` }), {
      status: 502,
      headers,
    })
  }
}
