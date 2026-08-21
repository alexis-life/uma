import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginScreen({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    setLoading(false)
    onClose?.()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(82, 46, 56, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="ax-card" style={{ maxWidth: 360, width: '100%' }}>
        <h1 className="ax-title" style={{ marginBottom: 4 }}>Sign in</h1>
        <p className="ax-subtitle" style={{ marginBottom: 20 }}>Sign in to edit your roster — viewing never requires it.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label-micro">Email</label>
            <input
              className="ax-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-row">
            <label className="label-micro">Password</label>
            <input
              className="ax-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="ax-meta" style={{ color: 'var(--error)', marginBottom: 12 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="ax-btn ax-btn--solid" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <button className="ax-btn" type="button" onClick={() => onClose?.()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
