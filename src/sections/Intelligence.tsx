import { useMemo, useState } from 'react'
import {
  connectGoogleWorkspace,
  disconnectGoogleWorkspace,
  fetchIntelligenceStatus,
  getCachedGoogleWorkspace,
  googleWorkspaceConfig,
  syncGoogleWorkspace,
  type GoogleSession,
  type IntelligenceServiceStatus,
  type WorkspaceSync,
} from '../services/googleWorkspace'

type View = 'resumenes' | 'calendario' | 'agente'

const DATE_FORMAT = new Intl.DateTimeFormat('es-PR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const DATE_ONLY_FORMAT = new Intl.DateTimeFormat('es-PR', { dateStyle: 'medium' })

function formatDate(value: string): string {
  if (!value) return 'Fecha no disponible'
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateOnly ? DATE_ONLY_FORMAT.format(date) : DATE_FORMAT.format(date)
}

function isUpcoming(value: string): boolean {
  return Boolean(value) && Date.parse(value) >= Date.now()
}

export function Intelligence() {
  const cached = getCachedGoogleWorkspace()
  const [session, setSession] = useState<GoogleSession | null>(cached.session)
  const [workspace, setWorkspace] = useState<WorkspaceSync | null>(cached.workspace)
  const [serviceStatus, setServiceStatus] = useState<IntelligenceServiceStatus | null>(null)
  const [view, setView] = useState<View>('resumenes')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredReports = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return workspace?.reports ?? []
    return (workspace?.reports ?? []).filter((report) =>
      `${report.subject} ${report.sender} ${report.preview}`.toLowerCase().includes(normalized),
    )
  }, [query, workspace])

  const upcoming = useMemo(
    () => (workspace?.calendar ?? []).filter((meeting) => isUpcoming(meeting.startsAt)),
    [workspace],
  )

  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      const nextSession = await connectGoogleWorkspace()
      setSession(nextSession)
      const nextWorkspace = await syncGoogleWorkspace(nextSession)
      setWorkspace(nextWorkspace)
      const nextStatus = await fetchIntelligenceStatus(nextSession).catch(() => null)
      setServiceStatus(nextStatus)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo conectar Google Workspace.')
    } finally {
      setLoading(false)
    }
  }

  const sync = async () => {
    if (!session) return
    setLoading(true)
    setError(null)
    try {
      setWorkspace(await syncGoogleWorkspace(session))
      const nextStatus = await fetchIntelligenceStatus(session).catch(() => serviceStatus)
      setServiceStatus(nextStatus)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo sincronizar.')
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    disconnectGoogleWorkspace(session)
    setSession(null)
    setWorkspace(null)
    setServiceStatus(null)
    setQuery('')
  }

  return (
    <div className="intelligence">
      <section className="intelligence-hero card">
        <div>
          <span className="pill pill-gold">Centro privado</span>
          <h2>El contexto de Lumina, organizado automaticamente</h2>
          <p>
            Reune tus reportes de Read AI y reuniones de Google Calendar. Los permisos solicitados son de solo lectura y
            la autorizacion queda limitada a <b>{googleWorkspaceConfig.allowedEmail}</b>.
          </p>
        </div>
        <div className="intelligence-hero-action">
          {session ? (
            <>
              <div className="signed-user">
                {session.picture && <img src={session.picture} alt="" referrerPolicy="no-referrer" />}
                <div><b>{session.name}</b><span>{session.email}</span></div>
              </div>
              <div className="intelligence-actions">
                <button className="btn btn-primary" onClick={sync} disabled={loading}>
                  {loading ? 'Sincronizando…' : '↻ Sincronizar ahora'}
                </button>
                <button className="btn btn-ghost" onClick={disconnect}>Desconectar</button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={connect} disabled={loading || !googleWorkspaceConfig.configured}>
              {loading ? 'Conectando…' : 'Conectar mi cuenta de Google'}
            </button>
          )}
        </div>
      </section>

      {!googleWorkspaceConfig.configured && (
        <div className="callout intelligence-setup">
          <div className="ico">🔑</div>
          <div>
            <h4>La interfaz esta lista; falta habilitar Google OAuth</h4>
            <p>
              Hay que crear un cliente OAuth de Google para esta aplicacion y configurar <b>VITE_GOOGLE_CLIENT_ID</b> en
              el despliegue. No compartas tu contrasena: Google mostrara una ventana oficial para autorizar Gmail y
              Calendar en modo de solo lectura.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="callout intelligence-error">
          <div className="ico">⚠️</div>
          <div><h4>No se pudo completar la accion</h4><p>{error}</p></div>
        </div>
      )}

      {workspace?.warnings.map((warning) => (
        <div className="callout intelligence-setup" key={warning}>
          <div className="ico">ℹ️</div>
          <div><h4>Sincronizacion parcial</h4><p>{warning}</p></div>
        </div>
      ))}

      <div className="section-title">Estado de conexiones</div>
      <div className="grid intelligence-connections">
        <ConnectionCard
          icon="✉️"
          name="Gmail"
          description="Busca únicamente reportes de Read AI; Google concede lectura general del buzón"
          state={session ? 'connected' : googleWorkspaceConfig.configured ? 'ready' : 'pending'}
        />
        <ConnectionCard
          icon="📅"
          name="Google Calendar"
          description="Consulta eventos de tu calendario en modo de solo lectura"
          state={session ? 'connected' : googleWorkspaceConfig.configured ? 'ready' : 'pending'}
        />
        <ConnectionCard
          icon="🎙️"
          name="Read AI"
          description="Ingestion inicial desde los correos que ya recibes"
          state={workspace?.reports.length ? 'connected' : 'ready'}
        />
        <ConnectionCard
          icon="🟠"
          name="HubSpot"
          description={googleWorkspaceConfig.apiConfigured ? 'Backend privado listo; falta autorizar la cuenta de Lumina' : 'Requiere backend privado y autorizacion de la cuenta de Lumina'}
          state={serviceStatus?.hubspot ? 'connected' : 'pending'}
        />
      </div>

      {session && workspace ? (
        <>
          <div className="grid intelligence-stats">
            <div className="card stat"><div className="stat-label">Reportes de Read AI</div><div className="stat-value">{workspace.reports.length}</div><div className="stat-sub">Ultimos 12 meses · maximo 30</div></div>
            <div className="card stat"><div className="stat-label">Reuniones proximas</div><div className="stat-value">{upcoming.length}</div><div className="stat-sub">Siguientes 60 dias</div></div>
            <div className="card stat"><div className="stat-label">Ultima sincronizacion</div><div className="stat-value stat-time">{DATE_FORMAT.format(workspace.syncedAt)}</div><div className="stat-sub">Sesion privada de este navegador</div></div>
          </div>

          <div className="intelligence-tabs" role="tablist" aria-label="Vistas de Lumina Intelligence">
            <button className={view === 'resumenes' ? 'active' : ''} onClick={() => setView('resumenes')}>Resumenes</button>
            <button className={view === 'calendario' ? 'active' : ''} onClick={() => setView('calendario')}>Calendario</button>
            <button className={view === 'agente' ? 'active' : ''} onClick={() => setView('agente')}>Agente Lumina</button>
          </div>

          {view === 'resumenes' && (
            <section>
              <div className="intelligence-toolbar">
                <div>
                  <h3>Reportes recibidos</h3>
                  <p>Resultados obtenidos directamente de tu Gmail.</p>
                </div>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar tema, persona o decision…"
                  aria-label="Buscar en reportes"
                />
              </div>
              <div className="intelligence-list">
                {filteredReports.map((report) => (
                  <article className="card report-card" key={report.id}>
                    <div className="report-head">
                      <div><h3>{report.subject}</h3><span>{formatDate(report.receivedAt)} · {report.sender}</span></div>
                      {report.reportUrl && <a className="btn btn-ghost btn-sm" href={report.reportUrl} target="_blank" rel="noreferrer">Abrir en Read AI ↗</a>}
                    </div>
                    <p>{report.preview}</p>
                  </article>
                ))}
                {!filteredReports.length && <EmptyState icon="📭" text={query ? 'No encontramos reportes con esa busqueda.' : 'Read AI no aparece entre los correos encontrados. Cuando llegue un reporte, se mostrara aqui.'} />}
              </div>
            </section>
          )}

          {view === 'calendario' && (
            <section>
              <div className="intelligence-toolbar"><div><h3>Agenda conectada</h3><p>Reuniones de los ultimos 30 y proximos 60 dias.</p></div></div>
              <div className="intelligence-list">
                {workspace.calendar.map((meeting) => (
                  <article className="card meeting-card" key={meeting.id}>
                    <div className="meeting-date"><span>{formatDate(meeting.startsAt)}</span>{isUpcoming(meeting.startsAt) && <b>Proxima</b>}</div>
                    <div className="meeting-body"><h3>{meeting.title}</h3><p>{meeting.attendees.length ? meeting.attendees.join(' · ') : 'Sin participantes visibles'}</p></div>
                    {meeting.meetingUrl && <a className="btn btn-navy btn-sm" href={meeting.meetingUrl} target="_blank" rel="noreferrer">Entrar ↗</a>}
                  </article>
                ))}
                {!workspace.calendar.length && <EmptyState icon="📅" text="No hay eventos visibles en este rango." />}
              </div>
            </section>
          )}

          {view === 'agente' && (
            <section className="card agent-placeholder">
              <div className="agent-icon">✦</div>
              <h3>Agente Lumina</h3>
              <p>
                La busqueda basica ya funciona sobre tus reportes. El agente conversacional se activara cuando conectemos
                el almacenamiento privado y el proveedor de IA; asi podra recordar reuniones anteriores sin exponerlas
                en el sitio publico.
              </p>
              <div className="agent-suggestions">
                <span>¿Que acordamos sobre HubSpot?</span>
                <span>Prepara mi proxima reunion con Natana</span>
                <span>¿Que tareas siguen pendientes?</span>
              </div>
              <div className="agent-input"><input disabled placeholder="El agente se habilitara en la siguiente conexion segura" /><button className="btn btn-navy" disabled>Enviar</button></div>
            </section>
          )}
        </>
      ) : (
        <section className="card intelligence-empty">
          <div>🔐</div>
          <h3>Tus reuniones aun no se han cargado</h3>
          <p>Conecta {googleWorkspaceConfig.allowedEmail} para importar los reportes de Read AI y tu agenda. La aplicacion nunca solicita ni guarda tu contrasena.</p>
        </section>
      )}

      <div className="intelligence-privacy">
        <span>🛡️</span>
        <p><b>Privacidad:</b> Google concede lectura del buzón y de los eventos del calendario; la aplicación filtra Gmail para mostrar solamente correos verificados del dominio read.ai. El token y los resultados permanecen en memoria y se eliminan al recargar o cerrar la página. No se envía contenido a HubSpot ni a un modelo de IA sin tu aprobación.</p>
      </div>
    </div>
  )
}

function ConnectionCard({
  icon,
  name,
  description,
  state,
}: {
  icon: string
  name: string
  description: string
  state: 'connected' | 'ready' | 'pending'
}) {
  const labels = { connected: 'Conectado', ready: 'Listo para conectar', pending: 'Configuracion pendiente' }
  return (
    <div className="card connection-card">
      <div className="connection-icon">{icon}</div>
      <div><h3>{name}</h3><p>{description}</p><span className={`connection-state ${state}`}>● {labels[state]}</span></div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return <div className="card intelligence-list-empty"><span>{icon}</span><p>{text}</p></div>
}
