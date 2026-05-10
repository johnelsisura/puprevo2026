// src/pages/admin/Dashboard.jsx
// PUPREVO 2026 — Admin Dashboard (Updated)
// Font Awesome needed in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
    --red: #E4001B;
    --gold: #F5C842;
    --cream: #FAF5E9;
    --dark: #0A0500;
    --card: #110900;
    --sidebar: #0d0700;
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; }

  .admin-wrap {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
  }

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
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    color: var(--cream);
    margin-bottom: 0.25rem;
    line-height: 1;
  }

  .sidebar-sub {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 2rem;
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
    text-decoration: none;
  }

  .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--cream); }
  .nav-item.active { background: rgba(228,0,27,0.12); color: var(--cream); }
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

  .signout-btn:hover { background: rgba(228,0,27,0.1); color: #ff8080; }

  /* ── Main ── */
  .main {
    padding: 2.5rem;
    overflow-y: auto;
  }

  @media (max-width: 600px) { .main { padding: 1.5rem; } }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
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

  .header-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
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
  }

  .btn-outline:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

  .btn-red {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--red);
    color: white;
    border: none;
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn-red:hover { opacity: 0.85; }

  /* ── Stat cards ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
  }

  .stat-card.highlight { border-color: rgba(228,0,27,0.25); }

  .stat-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.6rem;
  }

  .stat-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    line-height: 1;
    color: var(--cream);
  }

  .stat-value.green { color: #4ade80; }
  .stat-value.gold { color: var(--gold); }

  .stat-sub {
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 0.35rem;
  }

  /* ── Progress bar ── */
  .progress-wrap { margin-bottom: 2rem; }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .progress-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .progress-pct {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--cream);
  }

  .progress-bar-bg {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    margin-bottom: 1rem;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: var(--red);
    transition: width 0.6s ease;
  }

  /* ── Table ── */
  .table-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .table-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--cream);
    flex-shrink: 0;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    max-width: 280px;
  }

  .search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 0.85rem;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.6rem 0.85rem 0.6rem 2.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: var(--cream);
    outline: none;
    transition: border-color 0.15s;
  }

  .search-input::placeholder { color: rgba(250,245,233,0.2); }
  .search-input:focus { border-color: rgba(228,0,27,0.4); }

  .filter-select {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.6rem 0.85rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--cream);
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
  }

  .filter-select option { background: #1a0a00; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  thead tr { border-bottom: 1px solid var(--border); }

  th {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0.85rem 1.25rem;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .td-name { font-weight: 500; color: var(--cream); }
  .td-code {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.1em;
    color: var(--gold);
    text-decoration: none;
  }
  .td-muted { color: var(--muted); font-size: 0.8rem; }
  .td-section {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    color: rgba(245,200,66,0.7);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.22rem 0.6rem;
    border-radius: 2rem;
    white-space: nowrap;
  }

  .badge-paid    { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.25);  color: #4ade80; }
  .badge-pending { background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.25); color: var(--gold); }
  .badge-cancelled { background: rgba(228,0,27,0.1); border: 1px solid rgba(228,0,27,0.25); color: #ff8080; }
  .badge-checkedin { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.25); color: #93c5fd; }

  .badge-student  { background: rgba(228,0,27,0.1);  border: 1px solid rgba(228,0,27,0.2);  color: #ff8080; }
  .badge-alumni   { background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.2); color: var(--gold); }
  .badge-faculty  { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); color: #93c5fd; }
  .badge-outsider { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--muted); }

  /* Payment method pill */
  .pay-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.78rem;
    color: var(--muted);
    white-space: nowrap;
  }

  /* Proof link */
  .proof-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(96,165,250,0.8);
    background: rgba(96,165,250,0.06);
    border: 1px solid rgba(96,165,250,0.2);
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    transition: background 0.15s;
    margin-top: 0.2rem;
  }

  .proof-link:hover { background: rgba(96,165,250,0.12); }

  /* Row actions */
  .row-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .action-btn {
    font-family: 'Syne', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.28rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    transition: all 0.15s;
    white-space: nowrap;
  }

  .action-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--cream); }
  .action-btn.confirm  { border-color: rgba(34,197,94,0.3); color: #4ade80; background: rgba(34,197,94,0.06); }
  .action-btn.confirm:hover { background: rgba(34,197,94,0.12); }
  .action-btn.block    { border-color: rgba(228,0,27,0.3); color: #ff8080; background: rgba(228,0,27,0.06); }
  .action-btn.block:hover { background: rgba(228,0,27,0.12); }
  .action-btn.unblock  { border-color: rgba(245,200,66,0.3); color: var(--gold); background: rgba(245,200,66,0.06); }
  .action-btn.unblock:hover { background: rgba(245,200,66,0.12); }
  .action-btn.undo-checkin { border-color: rgba(96,165,250,0.3); color: #93c5fd; background: rgba(96,165,250,0.06); }
  .action-btn.undo-checkin:hover { background: rgba(96,165,250,0.12); }

  .table-empty {
    text-align: center;
    padding: 3rem;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .table-footer {
    padding: 0.85rem 1.25rem;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  /* ── Modal base ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal {
    background: var(--card);
    border: 1px solid rgba(228,0,27,0.2);
    border-radius: 12px;
    padding: 2rem;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    color: var(--cream);
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .modal-sub {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .modal-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    color: var(--cream);
    display: block;
    margin-bottom: 0.2rem;
  }

  .modal-code {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    color: var(--gold);
    letter-spacing: 0.1em;
  }

  /* Detail rows in modal */
  .modal-details {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
  }

  .modal-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.4rem 0;
    font-size: 0.82rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    gap: 1rem;
  }

  .modal-detail-row:last-child { border-bottom: none; }
  .modal-detail-label { color: var(--muted); flex-shrink: 0; }
  .modal-detail-value { color: var(--cream); font-weight: 500; text-align: right; }

  /* Screenshot viewer */
  .screenshot-viewer {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin: 1rem 0;
    background: rgba(0,0,0,0.3);
  }

  .screenshot-viewer img {
    width: 100%;
    display: block;
    max-height: 340px;
    object-fit: contain;
  }

  .screenshot-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.5rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
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

  .modal-confirm-btn {
    flex: 2;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    padding: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .modal-confirm-btn.green { background: #16a34a; color: white; }
  .modal-confirm-btn.gold  { background: #b45309; color: white; }
  .modal-confirm-btn.danger { background: var(--red); color: white; }
  .modal-confirm-btn:hover { opacity: 0.85; }
  .modal-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .modal-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.85rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--cream);
    outline: none;
    transition: border-color 0.15s;
  }

  .modal-input:focus { border-color: rgba(228,0,27,0.5); }

  .modal-input-label {
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.45rem;
  }

  /* Pending payment alert strip */
  .pending-alert {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(245,200,66,0.06);
    border: 1px solid rgba(245,200,66,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.78rem;
    color: rgba(245,200,66,0.9);
    margin-bottom: 1.5rem;
  }

  .spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: var(--red);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 2rem auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 1100px) {
    th:nth-child(5), td:nth-child(5) { display: none; }
  }
  @media (max-width: 900px) {
    th:nth-child(4), td:nth-child(4),
    th:nth-child(6), td:nth-child(6) { display: none; }
  }
  @media (max-width: 600px) {
    th:nth-child(3), td:nth-child(3) { display: none; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }
`

// ── Helper: attendee badge ────────────────────────────────────────────────
function AttendeeBadge({ type }) {
  const map = {
    pup_student: { cls: 'badge-student',  label: <><i className="fa-solid fa-graduation-cap" style={{marginRight:'0.3rem'}}/> Student</> },
    alumni:      { cls: 'badge-alumni',   label: <><i className="fa-solid fa-user-graduate" style={{marginRight:'0.3rem'}}/> Alumni</> },
    faculty:     { cls: 'badge-faculty',  label: <><i className="fa-solid fa-chalkboard-user" style={{marginRight:'0.3rem'}}/> Faculty</> },
    outsider:    { cls: 'badge-outsider', label: <><i className="fa-solid fa-globe" style={{marginRight:'0.3rem'}}/> Public</> },
  }
  const { cls, label } = map[type] || { cls: 'badge-outsider', label: type || '—' }
  return <span className={`badge ${cls}`}>{label}</span>
}

// ── Helper: payment method label ──────────────────────────────────────────
function PayMethod({ method }) {
  if (method === 'gcash')   return <span className="pay-pill"><i className="fa-solid fa-mobile-screen-button" style={{marginRight:'0.3rem',color:'#4ade80'}}/> GCash</span>
  if (method === 'maya')    return <span className="pay-pill"><i className="fa-solid fa-credit-card" style={{marginRight:'0.3rem',color:'#93c5fd'}}/> Maya</span>
  if (method === 'walk_in') return <span className="pay-pill"><i className="fa-solid fa-school" style={{marginRight:'0.3rem',color:'var(--gold)'}}/> Walk-in</span>
  // legacy
  if (method === 'walk-in') return <span className="pay-pill"><i className="fa-solid fa-school" style={{marginRight:'0.3rem',color:'var(--gold)'}}/> Walk-in</span>
  if (method === 'online')  return <span className="pay-pill"><i className="fa-solid fa-mobile-screen-button" style={{marginRight:'0.3rem',color:'#4ade80'}}/> GCash</span>
  return <span className="pay-pill">{method}</span>
}

// ── Helper: section code ──────────────────────────────────────────────────
function sectionCode(order) {
  if (order.attendee_type !== 'pup_student') return null
  const parts = [order.college, order.department, order.year_level, order.block].filter(Boolean)
  return parts.length > 0 ? parts.join('-') : null
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [attendeeFilter, setAttendeeFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [editSlots, setEditSlots] = useState(null)
  const [newSlots, setNewSlots] = useState('')
  const [event, setEvent] = useState(null)
  const [editEvent, setEditEvent] = useState(false)
  const [eventForm, setEventForm] = useState({})
  const [eventLoading, setEventLoading] = useState(false)

  // Screenshot signed URLs cache
  const [screenshotUrls, setScreenshotUrls] = useState({})
  const [idPhotoUrls, setIdPhotoUrls] = useState({})
  const [waiverUrls, setWaiverUrls] = useState({})

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate('/admin'); return }
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.session.user.id)
        .single()
      if (adminData?.role === 'scanner') navigate('/admin/scanner')
    })
  }, [navigate])

  // ── Fetch data ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        id, ticket_code, full_name, email, phone,
        attendee_type, college, department, year_level, block,
        student_id, student_id_photo_url, cor_or_id_url,
        payment_method, payment_status, payment_reference,
        payment_screenshot_url, amount_paid,
        waiver_url, is_checked_in, created_at,
        ticket_types ( name, price )
      `)
      .order('created_at', { ascending: false })

    if (ordersData) setOrders(ordersData)

    const { data: summaryData } = await supabase
      .from('sales_summary')
      .select('*')
    if (summaryData) setSummary(summaryData)

    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .single()
    if (eventData) setEvent(eventData)

    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Filter logic ────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...orders]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.full_name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.ticket_code?.toLowerCase().includes(q) ||
        o.phone?.includes(q) ||
        o.student_id?.toLowerCase().includes(q) ||
        sectionCode(o)?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'checked_in') result = result.filter(o => o.is_checked_in)
      else result = result.filter(o => o.payment_status === statusFilter)
    }

    if (attendeeFilter !== 'all') {
      result = result.filter(o => o.attendee_type === attendeeFilter)
    }

    setFiltered(result)
  }, [orders, search, statusFilter, attendeeFilter])

  // ── Get signed URL for private storage ─────────────────────────────────
  async function getSignedUrl(bucket, path, cacheObj, setCacheObj, orderId) {
    if (!path) return null
    if (cacheObj[orderId]) return cacheObj[orderId]
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600) // 1 hour
    if (data?.signedUrl) {
      setCacheObj(prev => ({ ...prev, [orderId]: data.signedUrl }))
      return data.signedUrl
    }
    return null
  }

  // Open verify modal and load screenshot
  async function openVerifyModal(order) {
    setModal({ type: 'verify', order, screenshotUrl: null, idPhotoUrl: null, waiverUrl: null })

    // Load screenshot
    if (order.payment_screenshot_url) {
      const url = await getSignedUrl(
        'payment-screenshots',
        order.payment_screenshot_url,
        screenshotUrls,
        setScreenshotUrls,
        order.id
      )
      setModal(prev => prev ? { ...prev, screenshotUrl: url } : prev)
    }

    // Load student ID / COR photo (support both column names)
    const idPhotoPath = order.student_id_photo_url || order.cor_or_id_url
    if (idPhotoPath) {
      const url = await getSignedUrl(
        'student-id-photos',
        idPhotoPath,
        idPhotoUrls,
        setIdPhotoUrls,
        `id_${order.id}`
      )
      setModal(prev => prev ? { ...prev, idPhotoUrl: url } : prev)
    }

    // Load waiver
    if (order.waiver_url) {
      const url = await getSignedUrl(
        'waiver-forms',
        order.waiver_url,
        waiverUrls,
        setWaiverUrls,
        `waiver_${order.id}`
      )
      setModal(prev => prev ? { ...prev, waiverUrl: url } : prev)
    }
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  async function confirmPayment(order) {
    setActionLoading(true)
    await supabase
      .from('orders')
      .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', order.id)
    await fetchData()
    setModal(null)
    setActionLoading(false)
  }

  async function blockOrder(order) {
    setActionLoading(true)
    await supabase
      .from('orders')
      .update({ payment_status: 'cancelled' })
      .eq('id', order.id)
    await fetchData()
    setModal(null)
    setActionLoading(false)
  }

  async function unblockOrder(order) {
    setActionLoading(true)
    await supabase
      .from('orders')
      .update({ payment_status: 'pending' })
      .eq('id', order.id)
    await fetchData()
    setModal(null)
    setActionLoading(false)
  }

  async function undoCheckIn(order) {
    setActionLoading(true)
    await supabase
      .from('orders')
      .update({ is_checked_in: false })
      .eq('id', order.id)
    await fetchData()
    setModal(null)
    setActionLoading(false)
  }

  async function saveSlots() {
    if (!newSlots || isNaN(newSlots) || Number(newSlots) < 1) return
    setActionLoading(true)
    await supabase
      .from('ticket_types')
      .update({ total_slots: Number(newSlots) })
      .eq('name', editSlots.ticket_type)
    await fetchData()
    setEditSlots(null)
    setNewSlots('')
    setActionLoading(false)
  }

  async function saveEvent() {
    setEventLoading(true)
    await supabase
      .from('events')
      .update({
        name: eventForm.name,
        description: eventForm.description,
        venue: eventForm.venue,
        event_date: eventForm.event_date,
        poster_url: eventForm.poster_url || null,
      })
      .eq('id', event.id)
    await fetchData()
    setEditEvent(false)
    setEventLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  // ── Computed ────────────────────────────────────────────────────────────
  const totalRevenue  = summary?.reduce((a, s) => a + Number(s.total_revenue || 0), 0) ?? 0
  const totalSold     = summary?.reduce((a, s) => a + Number(s.sold_count    || 0), 0) ?? 0
  const totalSlots    = summary?.reduce((a, s) => a + Number(s.total_slots   || 0), 0) ?? 0
  const totalPaid     = orders.filter(o => o.payment_status === 'paid').length
  const totalPending  = orders.filter(o => o.payment_status === 'pending').length
  const totalCheckedIn = orders.filter(o => o.is_checked_in).length
  const pendingProof  = orders.filter(o =>
    o.payment_status === 'pending' &&
    ['gcash','maya'].includes(o.payment_method) &&
    o.payment_screenshot_url
  ).length

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-PH', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <div className="admin-wrap">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">PUPREVO</div>
          <div className="sidebar-sub">Admin Portal</div>

          <div className="nav-label">Menu</div>
          <button className="nav-item active">
            <span className="nav-icon"><i className="fa-solid fa-chart-line" /></span> Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/scanner')}>
            <span className="nav-icon"><i className="fa-solid fa-qrcode" /></span> Scanner
          </button>
          <button className="nav-item" onClick={() => { setEventForm(event || {}); setEditEvent(true) }}>
            <span className="nav-icon"><i className="fa-solid fa-ticket" /></span> Event Settings
          </button>

          <div className="sidebar-footer">
            <button className="signout-btn" onClick={handleSignOut}>
              <i className="fa-solid fa-right-from-bracket" /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">
          <div className="page-header">
            <div>
              <div className="page-title">Dashboard</div>
              <div className="page-sub">PUPREVO Night 2026 — Ticket Sales Overview</div>
            </div>
            <div className="header-actions">
              <button className="btn-outline" onClick={fetchData}><i className="fa-solid fa-rotate-right" /> Refresh</button>
              <button className="btn-red" onClick={() => navigate('/admin/scanner')}>
                <i className="fa-solid fa-qrcode" /> Open Scanner
              </button>
            </div>
          </div>

          {loading ? <div className="spinner" /> : (
            <>
              {/* ── Pending proof alert ── */}
              {pendingProof > 0 && (
                <div className="pending-alert">
                  <i className="fa-solid fa-triangle-exclamation" style={{marginRight:'0.4rem'}} /> <strong>{pendingProof} order{pendingProof > 1 ? 's' : ''}</strong> with uploaded payment proof waiting for verification.
                  Click <strong>Verify</strong> on pending GCash/Maya orders below.
                </div>
              )}

              {/* ── Event Info ── */}
              {event && (
                <div className="stat-card highlight" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div className="stat-label">Event</div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>{event.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      <i className="fa-solid fa-location-dot" style={{marginRight:'0.4rem'}} />{event.venue}<br />
                      <i className="fa-regular fa-calendar" style={{marginRight:'0.4rem'}} />{new Date(event.event_date).toLocaleString('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button
                    className="btn-outline"
                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    onClick={() => { setEventForm({ ...event, event_date: event.event_date?.slice(0, 16) }); setEditEvent(true) }}
                  >
                    ✏️ Edit
                  </button>
                </div>
              )}

              {/* ── Stats ── */}
              <div className="stats-grid">
                <div className="stat-card highlight">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value gold">₱{totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                  <div className="stat-sub">Paid orders only</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Tickets Sold</div>
                  <div className="stat-value">{totalSold} <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>/ {totalSlots}</span></div>
                  <div className="stat-sub">{totalSlots - totalSold} slots remaining</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Paid</div>
                  <div className="stat-value green">{totalPaid}</div>
                  <div className="stat-sub">Confirmed payments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending</div>
                  <div className="stat-value gold">{totalPending}</div>
                  <div className="stat-sub">Awaiting verification</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Checked In</div>
                  <div className="stat-value" style={{ color: '#93c5fd' }}>{totalCheckedIn}</div>
                  <div className="stat-sub">Scanned at venue</div>
                </div>
              </div>

              {/* ── Progress bars ── */}
              {summary?.map(s => {
                const pct = Math.min(100, (s.sold_count / s.total_slots) * 100)
                return (
                  <div className="progress-wrap" key={s.ticket_type}>
                    <div className="progress-header">
                      <span className="progress-label">{s.ticket_type} — ₱{s.price}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="progress-pct">{s.sold_count} / {s.total_slots} ({Math.round(pct)}%)</span>
                        <button
                          className="action-btn"
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => { setEditSlots(s); setNewSlots(String(s.total_slots)) }}
                        >
                          ✏️ Edit Slots
                        </button>
                      </div>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}

              {/* ── Orders table ── */}
              <div className="table-section">
                <div className="table-header">
                  <div className="table-title">All Orders</div>
                  <div className="search-wrap">
                    <span className="search-icon"><i className="fa-solid fa-magnifying-glass" /></span>
                    <input
                      className="search-input"
                      placeholder="Search name, email, code, section..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="filter-select"
                    value={attendeeFilter}
                    onChange={e => setAttendeeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="pup_student">PUP Students</option>
                    <option value="alumni">Alumni</option>
                    <option value="faculty">Faculty</option>
                    <option value="outsider">Public</option>
                  </select>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="checked_in">Checked In</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name / Section</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Attendee</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8}>
                            <div className="table-empty">
                              {search ? 'No results found.' : 'No orders yet.'}
                            </div>
                          </td>
                        </tr>
                      ) : filtered.map(order => {
                        const sec = sectionCode(order)
                        return (
                          <tr key={order.id}>
                            <td>
                              <div className="td-name">{order.full_name}</div>
                              <div className="td-muted">{order.email}</div>
                              {sec && <div className="td-section">{sec}</div>}
                            </td>
                            <td>
                              <a
                                href={`/ticket/${order.ticket_code}`}
                                target="_blank"
                                rel="noreferrer"
                                className="td-code"
                              >
                                {order.ticket_code}
                              </a>
                            </td>
                            <td className="td-muted">{order.ticket_types?.name}</td>
                            <td><AttendeeBadge type={order.attendee_type} /></td>
                            <td>
                              <PayMethod method={order.payment_method} />
                              {/* Proof button for GCash/Maya orders */}
                              {(order.payment_screenshot_url || order.cor_or_id_url || order.student_id_photo_url || order.waiver_url) && (
                                <div>
                                  <button
                                    className="proof-link"
                                    onClick={() => openVerifyModal(order)}
                                  >
                                    <i className="fa-solid fa-folder-open" style={{marginRight:'0.3rem'}} /> View Docs
                                  </button>
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${
                                order.is_checked_in      ? 'badge-checkedin' :
                                order.payment_status === 'paid'      ? 'badge-paid' :
                                order.payment_status === 'cancelled' ? 'badge-cancelled' :
                                'badge-pending'
                              }`}>
                                {order.is_checked_in      ? <><i className="fa-solid fa-circle-check" /> In</> :
                                 order.payment_status === 'paid'      ? <><i className="fa-solid fa-circle-check" /> Paid</> :
                                 order.payment_status === 'cancelled' ? <><i className="fa-solid fa-circle-xmark" /> Blocked</> :
                                 <><i className="fa-regular fa-clock" /> Pending</>}
                              </span>
                            </td>
                            <td className="td-muted">{formatDate(order.created_at)}</td>
                            <td>
                              <div className="row-actions">
                                {order.is_checked_in && (
                                  <button className="action-btn undo-checkin" onClick={() => setModal({ type: 'undo_checkin', order })}>
                                    <i className="fa-solid fa-rotate-left" /> Undo
                                  </button>
                                )}
                                {order.payment_status === 'pending' && !order.is_checked_in && (
                                  <button
                                    className="action-btn confirm"
                                    onClick={() => {
                                      if (order.payment_screenshot_url || order.cor_or_id_url || order.student_id_photo_url || order.waiver_url) {
                                        openVerifyModal(order)
                                      } else {
                                        setModal({ type: 'confirm', order })
                                      }
                                    }}
                                  >
                                    {['gcash','maya'].includes(order.payment_method) ? <><i className="fa-solid fa-magnifying-glass" /> Verify</> : 'Confirm'}
                                  </button>
                                )}
                                {order.payment_status === 'cancelled' ? (
                                  <button className="action-btn unblock" onClick={() => setModal({ type: 'unblock', order })}>
                                    Unblock
                                  </button>
                                ) : (
                                  !order.is_checked_in && (
                                    <button className="action-btn block" onClick={() => setModal({ type: 'block', order })}>
                                      Block
                                    </button>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="table-footer">
                  <span>Showing {filtered.length} of {orders.length} orders</span>
                  {(search || statusFilter !== 'all' || attendeeFilter !== 'all') && (
                    <button
                      className="btn-outline"
                      style={{ fontSize: '0.7rem', padding: '0.35rem 0.85rem' }}
                      onClick={() => { setSearch(''); setStatusFilter('all'); setAttendeeFilter('all') }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── VERIFY PAYMENT MODAL ── */}
      {modal?.type === 'verify' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Review & Confirm</div>
            <div className="modal-sub">Review the order details and uploaded documents before confirming.</div>

            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="modal-detail-label">Name</span>
                <span className="modal-detail-value">{modal.order.full_name}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Email</span>
                <span className="modal-detail-value">{modal.order.email}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Phone</span>
                <span className="modal-detail-value">{modal.order.phone}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Code</span>
                <span className="modal-detail-value" style={{ fontFamily: 'Bebas Neue', color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                  {modal.order.ticket_code}
                </span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Ticket Type</span>
                <span className="modal-detail-value">{modal.order.ticket_types?.name || '—'}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Attendee</span>
                <span className="modal-detail-value"><AttendeeBadge type={modal.order.attendee_type} /></span>
              </div>
              {modal.order.attendee_type === 'pup_student' && (
                <>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Student ID</span>
                    <span className="modal-detail-value">{modal.order.student_id || '—'}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Section</span>
                    <span className="modal-detail-value" style={{ fontFamily: 'Bebas Neue', color: 'var(--gold)' }}>
                      {sectionCode(modal.order) || '—'}
                    </span>
                  </div>
                </>
              )}
              <div className="modal-detail-row">
                <span className="modal-detail-label">Method</span>
                <span className="modal-detail-value"><PayMethod method={modal.order.payment_method} /></span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Amount</span>
                <span className="modal-detail-value" style={{ color: '#4ade80', fontWeight: 700 }}>
                  ₱{Number(modal.order.amount_paid).toFixed(2)}
                </span>
              </div>
              {modal.order.payment_reference && (
                <div className="modal-detail-row">
                  <span className="modal-detail-label">Reference No.</span>
                  <span className="modal-detail-value" style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.06em' }}>
                    {modal.order.payment_reference}
                  </span>
                </div>
              )}
              <div className="modal-detail-row">
                <span className="modal-detail-label">Status</span>
                <span className="modal-detail-value">
                  <span className={`badge ${
                    modal.order.payment_status === 'paid' ? 'badge-paid' :
                    modal.order.payment_status === 'cancelled' ? 'badge-cancelled' :
                    'badge-pending'
                  }`}>
                    {modal.order.payment_status === 'paid' ? <><i className="fa-solid fa-circle-check" /> Paid</> :
                     modal.order.payment_status === 'cancelled' ? <><i className="fa-solid fa-circle-xmark" /> Blocked</> : <><i className="fa-regular fa-clock" /> Pending</>}
                  </span>
                </span>
              </div>
            </div>

            {/* Payment screenshot */}
            {modal.order.payment_screenshot_url && (
              <div>
                <div className="screenshot-label">Payment Screenshot</div>
                <div className="screenshot-viewer">
                  {modal.screenshotUrl ? (
                    <img src={modal.screenshotUrl} alt="Payment screenshot" />
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      Loading screenshot...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Student ID / COR photo */}
            {(modal.order.student_id_photo_url || modal.order.cor_or_id_url) && (
              <div style={{ marginTop: '1rem' }}>
                <div className="screenshot-label">Student ID / COR Photo</div>
                <div className="screenshot-viewer">
                  {modal.idPhotoUrl ? (
                    <img src={modal.idPhotoUrl} alt="Student ID / COR" />
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      Loading ID photo...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Waiver / Consent form */}
            {modal.order.waiver_url && (
              <div style={{ marginTop: '1rem' }}>
                <div className="screenshot-label">Consent / Waiver Form</div>
                <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  {modal.waiverUrl ? (
                    <a
                      href={modal.waiverUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#93c5fd', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <i className="fa-solid fa-file-pdf" style={{marginRight:'0.4rem',color:'#ff8080'}} /> View / Download Waiver Form
                    </a>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Loading waiver...</div>
                  )}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Close</button>
              <button
                className="modal-confirm-btn gold"
                onClick={() => setModal({ type: 'block', order: modal.order })}
                disabled={actionLoading}
              >
                <i className="fa-solid fa-xmark" /> Reject
              </button>
              <button
                className="modal-confirm-btn green"
                onClick={() => confirmPayment(modal.order)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : <><i className="fa-solid fa-check" /> Confirm Paid</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM PAYMENT MODAL (walk-in) ── */}
      {modal?.type === 'confirm' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Confirm Payment</div>
            <div className="modal-sub">
              Mark this order as <strong style={{ color: '#4ade80' }}>PAID</strong>?
              {modal.order.payment_method === 'walk_in' && ' Cash received at venue.'}
            </div>
            <span className="modal-name">{modal.order.full_name}</span>
            <span className="modal-code">{modal.order.ticket_code}</span>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm-btn green" onClick={() => confirmPayment(modal.order)} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : <><i className="fa-solid fa-check" /> Confirm Paid</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BLOCK MODAL ── */}
      {modal?.type === 'block' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Block Ticket</div>
            <div className="modal-sub">
              Mark this ticket as <strong style={{ color: '#ff8080' }}>CANCELLED</strong>? The QR code will be invalidated.
            </div>
            <span className="modal-name">{modal.order.full_name}</span>
            <span className="modal-code">{modal.order.ticket_code}</span>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm-btn danger" onClick={() => blockOrder(modal.order)} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : <><i className="fa-solid fa-ban" /> Block Ticket</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UNBLOCK MODAL ── */}
      {modal?.type === 'unblock' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Unblock Ticket</div>
            <div className="modal-sub">
              Restore this ticket to <strong style={{ color: 'var(--gold)' }}>PENDING</strong>?
            </div>
            <span className="modal-name">{modal.order.full_name}</span>
            <span className="modal-code">{modal.order.ticket_code}</span>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm-btn green" onClick={() => unblockOrder(modal.order)} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UNDO CHECK-IN MODAL ── */}
      {modal?.type === 'undo_checkin' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Undo Check-in</div>
            <div className="modal-sub">
              Remove check-in status for this attendee?
            </div>
            <span className="modal-name">{modal.order.full_name}</span>
            <span className="modal-code">{modal.order.ticket_code}</span>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm-btn gold" onClick={() => undoCheckIn(modal.order)} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : <><i className="fa-solid fa-rotate-left" /> Undo Check-in</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EVENT SETTINGS MODAL ── */}
      {editEvent && (
        <div className="modal-overlay" onClick={() => setEditEvent(false)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Event Settings</div>
            <div className="modal-sub">Changes here reflect on the landing page.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Event Name', key: 'name', placeholder: 'PUPREVO Night 2026' },
                { label: 'Venue', key: 'venue', placeholder: 'PUP Main Campus, Manila' },
                { label: 'Poster URL (optional)', key: 'poster_url', placeholder: 'https://...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="modal-input-label">{label}</label>
                  <input
                    className="modal-input"
                    value={eventForm[key] || ''}
                    onChange={e => setEventForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="modal-input-label">Description</label>
                <textarea
                  className="modal-input"
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans', lineHeight: 1.5 }}
                  value={eventForm.description || ''}
                  onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="modal-input-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="modal-input"
                  value={eventForm.event_date || ''}
                  onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditEvent(false)}>Cancel</button>
              <button
                className="modal-confirm-btn green"
                onClick={saveEvent}
                disabled={eventLoading || !eventForm.name || !eventForm.venue || !eventForm.event_date}
              >
                {eventLoading ? 'Saving...' : <><i className="fa-solid fa-floppy-disk" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT SLOTS MODAL ── */}
      {editSlots && (
        <div className="modal-overlay" onClick={() => setEditSlots(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Edit Slots</div>
            <div className="modal-sub">
              Update total slots for <strong style={{ color: 'var(--cream)' }}>{editSlots.ticket_type}</strong>.
              Currently <strong style={{ color: 'var(--gold)' }}>{editSlots.sold_count}</strong> sold.
            </div>
            <label className="modal-input-label">Total Slots</label>
            <input
              type="number"
              min={editSlots.sold_count}
              value={newSlots}
              onChange={e => setNewSlots(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditSlots(null)}>Cancel</button>
              <button
                className="modal-confirm-btn green"
                onClick={saveSlots}
                disabled={actionLoading || Number(newSlots) < Number(editSlots.sold_count)}
              >
                {actionLoading ? 'Saving...' : <><i className="fa-solid fa-floppy-disk" /> Save Slots</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
