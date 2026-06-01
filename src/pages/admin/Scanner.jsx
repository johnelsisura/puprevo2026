// src/pages/admin/Scanner.jsx
// PUPREVO 2026 — QR Scanner for Check-in
//
// Requires: npm install html5-qrcode

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../../lib/supabase'

// Inject Font Awesome if not already loaded
if (!document.querySelector('link[href*="font-awesome"]')) {
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  document.head.appendChild(fa)
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #FF3B30;
    --gold: #FFD700;
    --blue: #1A4FD6;
    --cream: #FAF5E9;
    --dark: #060D1F;
    --card: #0D1530;
    --sidebar: #080F25;
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; }

  .admin-wrap {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
    position: relative;
  }

  /* Landing-style animated background */
  .admin-bg {
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,48,0.1) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,215,0,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.1) 0%, transparent 60%),
      radial-gradient(ellipse 30% 25% at 90% 30%, rgba(255,215,0,0.04) 0%, transparent 60%),
      var(--dark);
    z-index: 0;
    animation: bgPulse 8s ease-in-out infinite;
  }
  @keyframes bgPulse { 0%,100%{opacity:1} 50%{opacity:0.75} }

  .admin-bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(26,79,214,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,79,214,0.06) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0;
    animation: gridDrift 20s linear infinite;
  }
  @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

  .sidebar, .main { position: relative; z-index: 1; }

  @media (max-width: 768px) {
    .admin-wrap { grid-template-columns: 1fr; }
    .sidebar { display: none; }
  }

  /* ── Sidebar ── */
  .sidebar {
    background: var(--sidebar);
    border-right: 1px solid var(--border);
    padding: 2rem 1.25rem;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-logo {
    display: block;
    width: 72px;
    margin: 0 auto 0.5rem auto;
  }

  .sidebar-sub {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 2rem;
    text-align: center;
  }

  .nav-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(250,245,233,0.2);
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.75rem;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    transition: background 0.15s, color 0.15s;
    margin-bottom: 0.15rem;
  }

  .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--cream); }
  .nav-item.active { background: rgba(255,59,48,0.12); color: var(--cream); }
  .nav-item.active .nav-icon { color: var(--red); }

  .nav-icon { font-size: 1rem; width: 20px; text-align: center; }

  .sidebar-footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .signout-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.65rem 0.75rem;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: none;
    transition: background 0.15s, color 0.15s;
  }

  .signout-btn:hover { background: rgba(255,59,48,0.1); color: #ff8080; }

  /* ── Main ── */
  .main {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 600px) { .main { padding: 1.5rem; } }

  .page-header {
    width: 100%;
    max-width: 560px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    line-height: 1;
    color: var(--cream);
  }

  .page-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin-top: 0.25rem;
  }

  .btn-outline {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: transparent;
    color: var(--cream);
    border: 1px solid var(--border);
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

  /* ── Scanner box ── */
  .scanner-card {
    width: 100%;
    max-width: 560px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .scanner-top {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .scanner-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .scanner-status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: inline-block;
    flex-shrink: 0;
  }

  .scanner-status-dot.active {
    background: #4ade80;
    box-shadow: 0 0 8px rgba(74,222,128,0.5);
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .scanner-toggle-btn {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.45rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: opacity 0.15s;
  }

  .scanner-toggle-btn.start {
    background: var(--red);
    color: white;
    border: none;
    box-shadow: 0 2px 12px rgba(255,59,48,0.3);
  }

  .scanner-toggle-btn.stop {
    background: rgba(255,59,48,0.12);
    color: #ff8080;
    border: 1px solid rgba(255,59,48,0.3);
  }

  .scanner-toggle-btn:hover { opacity: 0.85; }

  /* html5-qrcode renders into this div */
  #qr-reader { width: 100% !important; }
  #qr-reader video { width: 100% !important; border-radius: 0 !important; }
  #qr-reader__scan_region { background: var(--dark) !important; }
  #qr-reader__dashboard { padding: 1rem !important; background: var(--card) !important; border-top: 1px solid var(--border) !important; }
  #qr-reader__dashboard_section_csr button {
    font-family: 'Syne', sans-serif !important;
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    background: var(--red) !important;
    color: white !important;
    border: none !important;
    padding: 0.6rem 1.25rem !important;
    border-radius: 4px !important;
    cursor: pointer !important;
  }
  #qr-reader__status_span { color: var(--muted) !important; font-size: 0.78rem !important; font-family: 'DM Sans' !important; }
  #qr-reader__camera_selection {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid var(--border) !important;
    color: var(--cream) !important;
    font-family: 'DM Sans' !important;
    padding: 0.4rem 0.6rem !important;
    border-radius: 4px !important;
  }

  .scanner-idle {
    padding: 3rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .scanner-idle-icon {
    font-size: 2.5rem;
    color: rgba(255,215,0,0.2);
  }

  /* ── Manual search ── */
  .manual-card {
    width: 100%;
    max-width: 560px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .manual-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }

  .manual-row {
    display: flex;
    gap: 0.75rem;
  }

  .manual-input {
    flex: 1;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--cream);
    outline: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: border-color 0.15s;
  }

  .manual-input::placeholder { color: rgba(250,245,233,0.2); text-transform: none; letter-spacing: 0; }
  .manual-input:focus { border-color: rgba(255,59,48,0.4); }

  .manual-btn {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: var(--red);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .manual-btn:hover { opacity: 0.85; }
  .manual-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Recent scans log ── */
  .log-card {
    width: 100%;
    max-width: 560px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .log-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .log-clear {
    font-size: 0.62rem;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .log-clear:hover { color: #ff8080; }

  .log-empty {
    text-align: center;
    padding: 2rem;
    font-size: 0.82rem;
    color: var(--muted);
  }

  .log-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .log-item:last-child { border-bottom: none; }

  .log-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .log-dot.success { background: #4ade80; }
  .log-dot.error   { background: var(--red); }
  .log-dot.warning { background: var(--gold); }

  .log-info { flex: 1; min-width: 0; }

  .log-name {
    font-weight: 500;
    color: var(--cream);
    font-size: 0.88rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .log-detail {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 0.15rem;
  }

  .log-time {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    color: rgba(250,245,233,0.2);
    flex-shrink: 0;
  }

  /* ── Confirm modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal {
    background: var(--card);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 16px;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 24px 60px rgba(0,0,0,0.7);
    animation: popIn 0.15s ease-out;
  }

  @keyframes popIn {
    from { transform: scale(0.95); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  .modal-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    margin-bottom: 1rem;
  }

  .modal-badge.found   { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.3);  color: #4ade80; }
  .modal-badge.already { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); color: #93c5fd; }
  .modal-badge.invalid { background: rgba(255,59,48,0.1);  border: 1px solid rgba(255,59,48,0.3);  color: #ff8080; }
  .modal-badge.warning { background: rgba(255,215,0,0.1);  border: 1px solid rgba(255,215,0,0.3);  color: var(--gold); }

  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    color: var(--cream);
    margin-bottom: 1.25rem;
    line-height: 1;
  }

  .attendee-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  .att-row {
    display: flex;
    justify-content: space-between;
    padding: 0.35rem 0;
    font-size: 0.82rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  .att-row:last-child { border-bottom: none; }
  .att-label { color: var(--muted); }
  .att-value { font-weight: 500; color: var(--cream); text-align: right; }
  .att-value.gold { color: var(--gold); font-family: 'Bebas Neue'; font-size: 1rem; letter-spacing: 0.1em; }

  .modal-warning {
    background: rgba(255,215,0,0.06);
    border: 1px solid rgba(255,215,0,0.2);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.78rem;
    color: rgba(255,215,0,0.9);
    margin-bottom: 1.25rem;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .modal-error {
    background: rgba(255,59,48,0.06);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: #ff8080;
    margin-bottom: 1.25rem;
    line-height: 1.5;
    text-align: center;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
  }

  .modal-cancel {
    flex: 1;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .modal-cancel:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }

  .modal-checkin-btn {
    flex: 2;
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #16a34a;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s;
    box-shadow: 0 4px 20px rgba(22,163,74,0.3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  .modal-checkin-btn:hover:not(:disabled) { opacity: 0.88; }
  .modal-checkin-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .modal-close-btn {
    width: 100%;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .modal-close-btn:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }

  /* Success flash */
  .success-flash {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    background: #16a34a;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    animation: flashIn 0.2s ease-out, flashOut 0.3s ease-in 1.5s forwards;
  }

  @keyframes flashIn  { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  @keyframes flashOut { to   { opacity: 0; transform: translateX(-50%) translateY(-10px); } }
`

export default function Scanner() {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const scannerInstanceRef = useRef(null)
  const processingRef = useRef(false) // prevent double-scan
  const [scannerActive, setScannerActive] = useState(false)
  const [modal, setModal] = useState(null) // { ticket, state: 'found'|'already'|'invalid'|'unpaid' }
  const [actionLoading, setActionLoading] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [manualLoading, setManualLoading] = useState(false)
  const [scanLog, setScanLog] = useState([]) // recent scan history
  const [successFlash, setSuccessFlash] = useState('')
  const [userRole, setUserRole] = useState(null)

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate('/portal1721'); return }
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.session.user.id)
        .single()
      if (adminData) setUserRole(adminData.role)
    })
  }, [navigate])

  // ── Cleanup scanner on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.stop().catch(() => {})
      }
    }
  }, [])

  // ── Start/stop scanner ──────────────────────────────────────────────────
  async function startScanner() {
    if (scannerInstanceRef.current) return

    const scanner = new Html5Qrcode('qr-reader')
    scannerInstanceRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' }, // use back camera
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {} // ignore errors during scanning
      )
      setScannerActive(true)
    } catch (err) {
      console.error('Camera error:', err)
      addLog('error', 'Camera', 'Could not access camera. Check permissions.')
      scannerInstanceRef.current = null
    }
  }

  async function stopScanner() {
    if (scannerInstanceRef.current) {
      await scannerInstanceRef.current.stop().catch(() => {})
      scannerInstanceRef.current = null
    }
    setScannerActive(false)
  }

  // ── QR scan success handler ─────────────────────────────────────────────
  async function onScanSuccess(decodedText) {
    if (processingRef.current) return
    processingRef.current = true

    // Extract ticket code from URL or use raw text
    // Supports: https://puprevo2026.me/ticket/XXXXXXXX, /ticket/REVO-XXXX, or raw XXXXXXXX
    let code = decodedText.trim()
    const urlMatch = code.match(/\/ticket\/([A-Z0-9-]+)$/i)
    if (urlMatch) code = urlMatch[1].toUpperCase()

    await lookupTicket(code)
    setTimeout(() => { processingRef.current = false }, 2000)
  }

  // ── Lookup ticket ───────────────────────────────────────────────────────
  async function lookupTicket(rawCode) {
    if (!rawCode) return

    // Build list of codes to try: original + strip any "PREFIX-" prefix
    const codes = [rawCode.toUpperCase()]
    const dashMatch = rawCode.match(/^[A-Z]+-([A-Z0-9]+)$/i)
    if (dashMatch) codes.push(dashMatch[1].toUpperCase())

    let data = null
    for (const code of codes) {
      const { data: row } = await supabase
        .from('orders')
        .select(`
          id, ticket_code, full_name, email, phone,
          payment_method, payment_status, amount_paid,
          is_checked_in, checked_in_at,
          ticket_types ( name, price )
        `)
        .eq('ticket_code', code)
        .single()
      if (row) { data = row; break }
    }

    if (!data) {
      setModal({ state: 'invalid', code: rawCode })
      addLog('error', rawCode, 'Ticket not found')
      return
    }

    if (data.payment_status === 'cancelled') {
      setModal({ state: 'blocked', ticket: data })
      addLog('error', data.full_name, `Blocked ticket — ${data.ticket_code}`)
      return
    }

    if (data.payment_status !== 'paid') {
      setModal({ state: 'unpaid', ticket: data })
      addLog('warning', data.full_name, `Unpaid — ${data.ticket_code}`)
      return
    }

    if (data.is_checked_in) {
      setModal({ state: 'already', ticket: data })
      addLog('warning', data.full_name, `Already checked in — ${data.ticket_code}`)
      return
    }

    setModal({ state: 'found', ticket: data })
  }

  // ── Confirm check-in ────────────────────────────────────────────────────
  async function confirmCheckIn() {
    if (!modal?.ticket) return
    setActionLoading(true)

    const { error } = await supabase
      .from('orders')
      .update({
        is_checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', modal.ticket.id)

    if (!error) {
      addLog('success', modal.ticket.full_name, `Checked in — ${modal.ticket.ticket_code}`)
      setSuccessFlash(`✓ ${modal.ticket.full_name} checked in!`)
      setTimeout(() => setSuccessFlash(''), 2000)
    }

    setActionLoading(false)
    setModal(null)
  }

  // ── Manual search ───────────────────────────────────────────────────────
  async function handleManualSearch() {
    if (!manualCode.trim()) return
    setManualLoading(true)
    await lookupTicket(manualCode.trim())
    setManualCode('')
    setManualLoading(false)
  }

  // ── Scan log ────────────────────────────────────────────────────────────
  function addLog(type, name, detail) {
    const entry = {
      id: Date.now(),
      type, // 'success' | 'error' | 'warning'
      name,
      detail,
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
    setScanLog(prev => [entry, ...prev].slice(0, 20))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/portal1721')
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      {successFlash && <div className="success-flash">{successFlash}</div>}

      <div className="admin-wrap">
        {/* Sidebar */}
        <aside className="sidebar">
          <img src="/logo.png" alt="PUP REVO" className="sidebar-logo" />
          <div className="sidebar-sub">Admin Portal</div>
          <div className="nav-label">Menu</div>
          {userRole === 'superadmin' && (
            <button className="nav-item" onClick={() => navigate('/portal1721/panel62')}>
              <span className="nav-icon"><i className="fa-solid fa-chart-line" /></span> Dashboard
            </button>
          )}
          <button className="nav-item active">
            <span className="nav-icon"><i className="fa-solid fa-qrcode" /></span> Scanner
          </button>
          <div className="sidebar-footer">
            <button className="signout-btn" onClick={handleSignOut}>
              <i className="fa-solid fa-right-from-bracket" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="page-header">
            <div className="page-title">QR Scanner</div>
            <div className="page-sub">Scan attendee QR codes to check them in at the venue.</div>
          </div>

          {/* Scanner card */}
          <div className="scanner-card">
            <div className="scanner-top">
              <span className="scanner-label">
                <span className={`scanner-status-dot ${scannerActive ? 'active' : ''}`} />
                {scannerActive ? 'Camera Active' : 'Camera Off'}
              </span>
              <button
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: scannerActive ? 'rgba(228,0,27,0.12)' : 'var(--red)',
                  color: scannerActive ? '#ff8080' : 'white',
                  border: scannerActive ? '1px solid rgba(228,0,27,0.3)' : 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={scannerActive ? stopScanner : startScanner}
              >
                {scannerActive ? '⏹ Stop' : '▶ Start Camera'}
              </button>
            </div>
            <div id="qr-reader" ref={scannerRef} />
            {!scannerActive && (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '0.85rem',
              }}>
                📷 Click "Start Camera" to begin scanning QR codes.
              </div>
            )}
          </div>

          {/* Manual lookup */}
          <div className="manual-card">
            <div className="manual-label">Manual Lookup — Enter Ticket Code</div>
            <div className="manual-row">
              <input
                className="manual-input"
                placeholder="e.g. REVO-4264EF9B"
                value={manualCode}
                onChange={e => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                maxLength={16}
              />
              <button
                className="manual-btn"
                onClick={handleManualSearch}
                disabled={manualLoading || !manualCode.trim()}
              >
                {manualLoading ? '...' : 'Look Up'}
              </button>
            </div>
          </div>

          {/* Scan log */}
          <div className="log-card">
            <div className="log-header">
              <span>Recent Scans</span>
              {scanLog.length > 0 && (
                <button className="log-clear" onClick={() => setScanLog([])}>Clear</button>
              )}
            </div>
            {scanLog.length === 0 ? (
              <div className="log-empty">No scans yet. Start scanning to see results here.</div>
            ) : scanLog.map(entry => (
              <div className="log-item" key={entry.id}>
                <div className={`log-dot ${entry.type}`} />
                <div className="log-info">
                  <div className="log-name">{entry.name}</div>
                  <div className="log-detail">{entry.detail}</div>
                </div>
                <div className="log-time">{entry.time}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Confirm check-in modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {/* VALID TICKET — confirm check-in */}
            {modal.state === 'found' && (
              <>
                <div className="modal-badge found">✓ Valid Ticket</div>
                <div className="modal-title">Check In?</div>
                <div className="attendee-card">
                  <div className="att-row">
                    <span className="att-label">Name</span>
                    <span className="att-value">{modal.ticket.full_name}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Ticket Type</span>
                    <span className="att-value">{modal.ticket.ticket_types?.name}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Payment</span>
                    <span className="att-value">{modal.ticket.payment_method === 'walk-in' ? '🏫 Walk-in' : '📱 GCash'}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Code</span>
                    <span className="att-value gold">{modal.ticket.ticket_code}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button
                    className="modal-checkin-btn"
                    onClick={confirmCheckIn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : '✓ Confirm Check-In'}
                  </button>
                </div>
              </>
            )}

            {/* ALREADY CHECKED IN */}
            {modal.state === 'already' && (
              <>
                <div className="modal-badge already">Already Checked In</div>
                <div className="modal-title">Duplicate Scan</div>
                <div className="attendee-card">
                  <div className="att-row">
                    <span className="att-label">Name</span>
                    <span className="att-value">{modal.ticket.full_name}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Checked in at</span>
                    <span className="att-value">
                      {modal.ticket.checked_in_at
                        ? new Date(modal.ticket.checked_in_at).toLocaleTimeString('en-PH')
                        : '—'}
                    </span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Code</span>
                    <span className="att-value gold">{modal.ticket.ticket_code}</span>
                  </div>
                </div>
                <div className="modal-warning">
                  ⚠️ This QR code has already been used for entry. Do not allow re-entry.
                </div>
                <button className="modal-close-btn" onClick={() => setModal(null)}>Close</button>
              </>
            )}

            {/* UNPAID */}
            {modal.state === 'unpaid' && (
              <>
                <div className="modal-badge invalid">⚠️ Unpaid</div>
                <div className="modal-title">Payment Pending</div>
                <div className="attendee-card">
                  <div className="att-row">
                    <span className="att-label">Name</span>
                    <span className="att-value">{modal.ticket.full_name}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Code</span>
                    <span className="att-value gold">{modal.ticket.ticket_code}</span>
                  </div>
                  <div className="att-row">
                    <span className="att-label">Amount Due</span>
                    <span className="att-value">₱{Number(modal.ticket.amount_paid).toFixed(2)}</span>
                  </div>
                </div>
                <div className="modal-warning">
                  ⚠️ This ticket has not been paid yet. Collect payment first, then confirm in the Dashboard before allowing entry.
                </div>
                <button className="modal-close-btn" onClick={() => setModal(null)}>Close</button>
              </>
            )}

            {/* BLOCKED */}
            {modal.state === 'blocked' && (
              <>
                <div className="modal-badge invalid">✗ Blocked</div>
                <div className="modal-title">Ticket Blocked</div>
                <div className="modal-error">
                  This ticket has been cancelled or blocked by an admin. Do not allow entry.
                </div>
                <button className="modal-close-btn" onClick={() => setModal(null)}>Close</button>
              </>
            )}

            {/* NOT FOUND */}
            {modal.state === 'invalid' && (
              <>
                <div className="modal-badge invalid">✗ Invalid</div>
                <div className="modal-title">Ticket Not Found</div>
                <div className="modal-error">
                  No ticket found for code: <strong>{modal.code}</strong><br />
                  This QR code is not in the system.
                </div>
                <button className="modal-close-btn" onClick={() => setModal(null)}>Close</button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
