const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? ''
const INTELLIGENCE_API_URL = (import.meta.env.VITE_INTELLIGENCE_API_URL as string | undefined)?.trim() ?? ''
const ALLOWED_EMAIL = 'mtavera99@gmail.com'

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ')

const GIS_SCRIPT = 'https://accounts.google.com/gsi/client'
let cachedSession: GoogleSession | null = null
let cachedWorkspace: WorkspaceSync | null = null

interface GoogleTokenResponse {
  access_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

interface GoogleTokenClient {
  requestAccessToken(options?: { prompt?: string }): void
}

interface GoogleAccountsOAuth2 {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: GoogleTokenResponse) => void
    error_callback?: (error: { type?: string; message?: string }) => void
  }): GoogleTokenClient
  revoke(token: string, callback?: () => void): void
}

declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleAccountsOAuth2 } }
  }
}

export interface GoogleSession {
  accessToken: string
  expiresAt: number
  email: string
  name: string
  picture?: string
}

export interface ReadAiReport {
  id: string
  subject: string
  sender: string
  receivedAt: string
  preview: string
  reportUrl?: string
}

export interface CalendarMeeting {
  id: string
  title: string
  startsAt: string
  endsAt: string
  attendees: string[]
  meetingUrl?: string
  status: string
}

export interface WorkspaceSync {
  reports: ReadAiReport[]
  calendar: CalendarMeeting[]
  warnings: string[]
  syncedAt: number
}

export interface IntelligenceServiceStatus {
  google: boolean
  readAiEmailImport: boolean
  hubspot: boolean
  assistant: boolean
  persistentStorage: boolean
}

export const googleWorkspaceConfig = {
  clientId: GOOGLE_CLIENT_ID,
  allowedEmail: ALLOWED_EMAIL,
  configured: Boolean(GOOGLE_CLIENT_ID),
  apiConfigured: Boolean(INTELLIGENCE_API_URL),
}

export function getCachedGoogleWorkspace(): { session: GoogleSession | null; workspace: WorkspaceSync | null } {
  if (cachedSession && Date.now() >= cachedSession.expiresAt) {
    cachedSession = null
    cachedWorkspace = null
  }
  return { session: cachedSession, workspace: cachedWorkspace }
}

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts.oauth2) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT}"]`)
    if (existing) {
      let attempts = 0
      const timer = window.setInterval(() => {
        attempts += 1
        if (window.google?.accounts.oauth2) {
          window.clearInterval(timer)
          resolve()
        } else if (attempts >= 100) {
          window.clearInterval(timer)
          reject(new Error('Google Identity Services no respondio.'))
        }
      }, 50)
      return
    }

    const script = document.createElement('script')
    script.src = GIS_SCRIPT
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'))
    document.head.appendChild(script)
  })
}

async function googleJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message || `Google respondio ${response.status}.`)
  }
  return response.json() as Promise<T>
}

export async function connectGoogleWorkspace(): Promise<GoogleSession> {
  const cached = getCachedGoogleWorkspace().session
  if (cached) return cached
  if (!GOOGLE_CLIENT_ID) throw new Error('Falta configurar VITE_GOOGLE_CLIENT_ID en el despliegue de la aplicacion.')

  await loadGoogleIdentityServices()
  const token = await new Promise<GoogleTokenResponse>((resolve, reject) => {
    const oauth2 = window.google?.accounts.oauth2
    if (!oauth2) {
      reject(new Error('Google Identity Services no esta disponible.'))
      return
    }

    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response) => response.error
        ? reject(new Error(response.error_description || response.error))
        : resolve(response),
      error_callback: (error) => reject(new Error(error.message || 'La autorizacion de Google fue cancelada.')),
    })
    client.requestAccessToken()
  })

  if (!token.access_token) throw new Error('Google no devolvio un token de acceso.')
  const profile = await googleJson<{
    email?: string
    email_verified?: boolean
    name?: string
    picture?: string
  }>('https://www.googleapis.com/oauth2/v3/userinfo', token.access_token)

  if (!profile.email_verified || profile.email?.toLowerCase() !== ALLOWED_EMAIL) {
    window.google?.accounts.oauth2.revoke(token.access_token)
    throw new Error(`Esta seccion solo acepta la cuenta ${ALLOWED_EMAIL}.`)
  }

  cachedSession = {
    accessToken: token.access_token,
    expiresAt: Date.now() + Math.max(0, (token.expires_in ?? 3600) - 60) * 1000,
    email: profile.email,
    name: profile.name || 'Santiago Tavera',
    picture: profile.picture,
  }
  return cachedSession
}

export function disconnectGoogleWorkspace(session: GoogleSession | null): void {
  if (session?.accessToken) window.google?.accounts.oauth2.revoke(session.accessToken)
  cachedSession = null
  cachedWorkspace = null
}

function decodeBase64Url(value: string): string {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

interface GmailPart {
  mimeType?: string
  body?: { data?: string }
  parts?: GmailPart[]
}

function findMimePart(part: GmailPart | undefined, mimeType: string): GmailPart | undefined {
  if (!part) return undefined
  if (part.mimeType === mimeType && part.body?.data) return part
  for (const child of part.parts ?? []) {
    const found = findMimePart(child, mimeType)
    if (found) return found
  }
  return undefined
}

function collectMessageBody(part?: GmailPart): string {
  const plain = findMimePart(part, 'text/plain')
  if (plain?.body?.data) return decodeBase64Url(plain.body.data)

  const html = findMimePart(part, 'text/html')
  if (html?.body?.data) {
    const documentBody = new DOMParser().parseFromString(decodeBase64Url(html.body.data), 'text/html').body
    return documentBody.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  }

  return part?.body?.data ? decodeBase64Url(part.body.data) : ''
}

function findReadReportUrl(text: string): string | undefined {
  const match = text.match(/https:\/\/(?:app\.)?read\.ai\/[^\s<>"')]+/i)
  return match?.[0]?.replace(/&amp;/g, '&')
}

function safeIsoDate(timestamp?: string, fallback?: string): string {
  const preferred = timestamp ? new Date(Number(timestamp)) : new Date(fallback || '')
  return Number.isNaN(preferred.getTime()) ? new Date().toISOString() : preferred.toISOString()
}

function isReadAiSender(sender: string): boolean {
  const email = sender.match(/<([^>]+)>/)?.[1] || sender.match(/[\w.+-]+@[\w.-]+/)?.[0] || ''
  return /@(?:[\w-]+\.)*read\.ai$/i.test(email.trim())
}

async function fetchReadAiReports(accessToken: string): Promise<ReadAiReport[]> {
  const query = encodeURIComponent('from:(read.ai) newer_than:1y')
  const list = await googleJson<{ messages?: { id: string }[] }>(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=30`,
    accessToken,
  )

  const settled = await Promise.allSettled((list.messages ?? []).map(({ id }) =>
    googleJson<{
      id: string
      snippet?: string
      internalDate?: string
      payload?: GmailPart & { headers?: { name: string; value: string }[] }
    }>(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, accessToken),
  ))

  return settled
    .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof googleJson<{
      id: string
      snippet?: string
      internalDate?: string
      payload?: GmailPart & { headers?: { name: string; value: string }[] }
    }>>>> => result.status === 'fulfilled')
    .map(({ value: message }) => {
      const headers = message.payload?.headers ?? []
      const header = (name: string) => headers.find((item) => item.name.toLowerCase() === name)?.value ?? ''
      const body = collectMessageBody(message.payload)
      return {
        id: message.id,
        subject: header('subject') || 'Reporte de reunion de Read AI',
        sender: header('from'),
        receivedAt: safeIsoDate(message.internalDate, header('date')),
        preview: (body || message.snippet || 'Sin resumen disponible en el correo.').slice(0, 1200),
        reportUrl: findReadReportUrl(body),
      }
    })
    .filter((message) => isReadAiSender(message.sender))
    .sort((a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt))
}

interface GoogleCalendarEvent {
  id: string
  summary?: string
  status?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  attendees?: { email?: string; displayName?: string }[]
  hangoutLink?: string
  location?: string
  description?: string
  conferenceData?: { entryPoints?: { uri?: string; entryPointType?: string }[] }
}

function trustedMeetingUrl(value?: string): string | undefined {
  if (!value) return undefined
  const match = value.match(/https?:\/\/[^\s<>"']+/i)?.[0]
  if (!match) return undefined
  try {
    const host = new URL(match).hostname.toLowerCase()
    const trusted = ['teams.microsoft.com', 'teams.live.com', 'meet.google.com', 'zoom.us', 'webex.com']
    return trusted.some((domain) => host === domain || host.endsWith(`.${domain}`)) ? match : undefined
  } catch {
    return undefined
  }
}

async function fetchCalendarMeetings(accessToken: string): Promise<CalendarMeeting[]> {
  const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const timeMax = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  const events: GoogleCalendarEvent[] = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      maxResults: '100',
      singleEvents: 'true',
      orderBy: 'startTime',
      conferenceDataVersion: '1',
    })
    if (pageToken) params.set('pageToken', pageToken)

    const page = await googleJson<{ items?: GoogleCalendarEvent[]; nextPageToken?: string }>(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      accessToken,
    )
    events.push(...(page.items ?? []))
    pageToken = page.nextPageToken ?? ''
  } while (pageToken && events.length < 500)

  return events.map((event) => {
    const conferenceUrl = event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri
    const teamsUrl = event.description?.match(/https:\/\/(?:teams\.microsoft\.com|teams\.live\.com)\/[^\s<>"']+/i)?.[0]
    return {
      id: event.id,
      title: event.summary || 'Reunion sin titulo',
      startsAt: event.start?.dateTime || event.start?.date || '',
      endsAt: event.end?.dateTime || event.end?.date || '',
      attendees: (event.attendees ?? []).map((attendee) => attendee.displayName || attendee.email || '').filter(Boolean),
      meetingUrl: trustedMeetingUrl(teamsUrl) || trustedMeetingUrl(conferenceUrl) || trustedMeetingUrl(event.hangoutLink) || trustedMeetingUrl(event.location),
      status: event.status || 'confirmed',
    }
  })
}

export async function syncGoogleWorkspace(session: GoogleSession): Promise<WorkspaceSync> {
  if (Date.now() >= session.expiresAt) throw new Error('La autorizacion de Google vencio. Vuelve a conectar tu cuenta.')

  const [reportsResult, calendarResult] = await Promise.allSettled([
    fetchReadAiReports(session.accessToken),
    fetchCalendarMeetings(session.accessToken),
  ])
  if (reportsResult.status === 'rejected' && calendarResult.status === 'rejected') {
    throw new Error('Google no permitio leer Gmail ni Calendar. Revisa los permisos concedidos.')
  }

  const warnings: string[] = []
  if (reportsResult.status === 'rejected') warnings.push(`Gmail: ${reportsResult.reason instanceof Error ? reportsResult.reason.message : 'no disponible'}`)
  if (calendarResult.status === 'rejected') warnings.push(`Calendar: ${calendarResult.reason instanceof Error ? calendarResult.reason.message : 'no disponible'}`)

  cachedWorkspace = {
    reports: reportsResult.status === 'fulfilled' ? reportsResult.value : [],
    calendar: calendarResult.status === 'fulfilled' ? calendarResult.value : [],
    warnings,
    syncedAt: Date.now(),
  }
  return cachedWorkspace
}

export async function fetchIntelligenceStatus(session: GoogleSession): Promise<IntelligenceServiceStatus | null> {
  if (!INTELLIGENCE_API_URL) return null
  const response = await fetch(INTELLIGENCE_API_URL, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })
  const body = await response.json().catch(() => null) as { services?: IntelligenceServiceStatus; error?: string } | null
  if (!response.ok) throw new Error(body?.error || `El backend privado respondio ${response.status}.`)
  return body?.services ?? null
}
