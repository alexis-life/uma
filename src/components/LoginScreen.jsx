import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 360, margin: '96px auto', padding: '0 20px' }}>
      <div className="ax-card">
        <h1 className="ax-title" style={{ marginBottom: 4 }}>uma</h1>
        <p className="ax-subtitle" style={{ marginBottom: 20 }}>Sign in to access your roster</p>
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
          <button className="ax-btn ax-btn--solid" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
