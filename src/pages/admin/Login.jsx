// src/pages/admin/Login.jsx
// PUPREVO 2026 — Admin Login

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #FF3B30;
    --gold: #FFD700;
    --blue: #1A4FD6;
    --cream: #FAF5E9;
    --dark: #060D1F;
    --card: #0D1530;
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
  }

  /* Landing-style animated background */
  .bg {
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,48,0.16) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,215,0,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 35% 30% at 90% 30%, rgba(255,215,0,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 30% 25% at 50% 90%, rgba(26,79,214,0.08) 0%, transparent 60%),
      var(--dark);
    z-index: 0;
    animation: bgPulse 8s ease-in-out infinite;
  }

  @keyframes bgPulse { 0%,100%{opacity:1} 50%{opacity:0.75} }

  .bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(26,79,214,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,79,214,0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0;
    animation: gridDrift 20s linear infinite;
  }

  @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

  .login-box {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    background: var(--card);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }

  .login-logo {
    display: block;
    width: 80px;
    margin: 0 auto 1.25rem auto;
  }

  .login-badge {
    display: block;
    text-align: center;
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(255,215,0,0.3);
    background: rgba(255,215,0,0.06);
    padding: 0.3rem 0.9rem;
    border-radius: 2rem;
    margin-bottom: 1.75rem;
  }

  .login-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin-bottom: 2rem;
    line-height: 1.5;
    text-align: center;
  }

  label {
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.45rem;
  }

  .field { margin-bottom: 1.25rem; }

  input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.85rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--cream);
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }

  input:focus {
    border-color: rgba(255,59,48,0.5);
    background: rgba(255,59,48,0.04);
  }

  input.error { border-color: var(--red); }
  input::placeholder { color: rgba(250,245,233,0.2); }

  .error-msg {
    background: rgba(255,59,48,0.1);
    border: 1px solid rgba(255,59,48,0.3);
    color: #ff8080;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1.25rem;
    line-height: 1.5;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .login-btn {
    width: 100%;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--red);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 4px 24px rgba(255,59,48,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .login-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .login-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.75rem;
    color: var(--muted);
  }
`

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    // Check if user is in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, name, role')
      .eq('id', data.user.id)
      .single()

    if (adminError || !adminData) {
      await supabase.auth.signOut()
      setError('Access denied. This account is not an admin.')
      setLoading(false)
      return
    }

    // Redirect based on role
    if (adminData.role === 'scanner') {
      navigate('/portal1721/scanner220')
    } else {
      navigate('/portal1721/panel62')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-page">
        <div className="bg" />
        <div className="bg-grid" />
        <div className="login-box">
          <img src="/logo.png" alt="PUP REVO 2026" className="login-logo" />
          <div className="login-badge">Admin Portal</div>
          <p className="login-sub">Sign in to manage tickets and check-in attendees.</p>

          {error && (
            <div className="error-msg">
              <i className="fa-solid fa-triangle-exclamation" />
              {error}
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@pup.edu.ph"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className={error ? 'error' : ''}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className={error ? 'error' : ''}
            />
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading
              ? <><div className="spinner" /> Signing in...</>
              : <><i className="fa-solid fa-right-to-bracket" /> Sign In</>
            }
          </button>

          <div className="login-footer">
            For access issues, contact the system admin.
          </div>
        </div>
      </div>
    </>
  )
}
