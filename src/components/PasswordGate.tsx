import { useState } from 'react'
import { Logo } from './Logo'

export function PasswordGate({ sectionName, onUnlock }: { sectionName: string; onUnlock: (pw: string) => boolean }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = onUnlock(pw)
    if (!ok) {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="gate">
      <div className="gate-card card">
        <Logo size={52} />
        <div className="gate-lock">🔒</div>
        <h2>Seccion restringida</h2>
        <p>
          <b>{sectionName}</b> es de acceso exclusivo para Santiago Tavera. Ingresa la contrasena para continuar.
        </p>
        <form onSubmit={submit}>
          <input
            type="password"
            value={pw}
            autoFocus
            placeholder="Contrasena"
            onChange={(e) => {
              setPw(e.target.value)
              setError(false)
            }}
            className={error ? 'gate-input error' : 'gate-input'}
          />
          {error && <div className="gate-error">Contrasena incorrecta. Intenta de nuevo.</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Desbloquear
          </button>
        </form>
        <div className="gate-note">El acceso queda activo mientras dure esta sesion del navegador.</div>
      </div>
    </div>
  )
}
