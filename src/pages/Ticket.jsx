// src/pages/Ticket.jsx
// PUPREVO 2026 — QR Ticket Page
//
// REQUIRES in index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'

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
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body {
    background: var(--dark);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .ticket-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
  }

  /* ── Background — matches Landing exactly ── */
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

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
  }

  /* ── Logo ── */
  .ticket-logo {
    display: block;
    width: 140px;
    margin: 0 auto 1.25rem auto;
  }

  /* ── Status banner ── */
  .status-banner {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .status-paid {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.3);
    color: #4ade80;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.5rem 1.25rem;
    border-radius: 2rem;
  }

  .status-pending {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,215,0,0.1);
    border: 1px solid rgba(255,215,0,0.3);
    color: var(--gold);
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.5rem 1.25rem;
    border-radius: 2rem;
  }

  /* Polling indicator */
  .polling-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.75rem;
    font-size: 0.75rem;
    color: var(--muted);
  }

  .poll-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  /* ── Ticket card ── */
  .ticket-card {
    background: var(--card);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .ticket-top {
    background: var(--red);
    padding: 1.5rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .ticket-top::before {
    content: '';
    position: absolute;
    left: -40px;
    bottom: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(0,0,0,0.1);
  }

  .ticket-top::after {
    content: '';
    position: absolute;
    right: -30px;
    top: -30px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }

  .ticket-event {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    color: white;
    line-height: 1;
    margin-bottom: 0.3rem;
    position: relative;
    z-index: 1;
  }

  .ticket-date {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    position: relative;
    z-index: 1;
  }

  .ticket-body {
    padding: 2rem;
  }

  /* QR Code */
  .qr-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .qr-inner {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  /* Ticket details grid */
  .ticket-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .detail {
    padding: 0.75rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .detail-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.3rem;
  }

  /* Payment method & amount use Bebas Neue — same font as event title */
  .detail-value {
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--cream);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .detail-value.bebas {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.15rem;
    letter-spacing: 0.06em;
  }

  /* Tear line */
  .ticket-divider {
    border: none;
    border-top: 1px dashed rgba(255,255,255,0.08);
    margin: 1.5rem 0;
    position: relative;
  }

  .ticket-divider::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: -12px;
    width: 24px;
    height: 24px;
    background: var(--dark);
    border-radius: 50%;
  }

  .ticket-divider::after {
    content: '';
    position: absolute;
    right: -2rem;
    top: -12px;
    width: 24px;
    height: 24px;
    background: var(--dark);
    border-radius: 50%;
  }

  /* Booking reference */
  .ticket-code-wrap {
    text-align: center;
  }

  .ticket-code-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }

  .ticket-code {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.2em;
    color: var(--gold);
  }

  /* Walk-in notice */
  .walkin-notice {
    margin-top: 1.5rem;
    background: rgba(255,215,0,0.06);
    border: 1px solid rgba(255,215,0,0.2);
    border-radius: 10px;
    padding: 1.25rem;
    font-size: 0.82rem;
    color: rgba(255,215,0,0.9);
    line-height: 1.7;
    text-align: center;
  }

  .walkin-notice strong {
    color: var(--gold);
    display: block;
    margin-bottom: 0.4rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* Action buttons */
  .ticket-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: opacity 0.15s, transform 0.15s;
    text-decoration: none;
  }

  .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  .btn-screenshot {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--cream);
  }

  .btn-email {
    background: rgba(255,59,48,0.15);
    border: 1px solid rgba(255,59,48,0.3);
    color: var(--red);
  }

  /* Save hint */
  .save-hint {
    text-align: center;
    margin-top: 1.25rem;
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .save-hint a {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(255,215,0,0.3);
    transition: opacity 0.15s;
  }

  .save-hint a:hover { opacity: 0.8; }

  /* Thank you block */
  .thank-you {
    margin-top: 1.5rem;
    background: rgba(26,79,214,0.06);
    border: 1px solid rgba(26,79,214,0.2);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: rgba(250,245,233,0.65);
    line-height: 1.75;
    text-align: center;
  }

  .thank-you strong {
    color: var(--cream);
  }

  .thank-you a {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(255,215,0,0.3);
    transition: opacity 0.15s;
  }

  .thank-you a:hover { opacity: 0.8; }

  /* ── Loading / Error states ── */
  .center-msg {
    text-align: center;
    padding: 4rem 2rem;
  }

  .center-msg h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    color: var(--cream);
    margin-bottom: 0.5rem;
  }

  .center-msg p {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .spinner-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .spinner {
    width: 32px; height: 32px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: var(--red);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Paid animation */
  .paid-flash {
    animation: paidFlash 0.6s ease-out;
  }

  @keyframes paidFlash {
    0% { transform: scale(0.97); opacity: 0.7; }
    60% { transform: scale(1.01); }
    100% { transform: scale(1); opacity: 1; }
  }

  @media (max-width: 480px) {
    .ticket-top { padding: 1.25rem 1.5rem; }
    .ticket-body { padding: 1.5rem; }
    .ticket-event { font-size: 1.8rem; }
    .ticket-actions { grid-template-columns: 1fr; }
  }
`

// How often to poll for payment status (ms)
const POLL_INTERVAL = 3000
// Max number of polling attempts before giving up
const MAX_POLL_ATTEMPTS = 20

export default function Ticket() {
  const { code } = useParams()
  const [searchParams] = useSearchParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [polling, setPolling] = useState(false)
  const [pollCount, setPollCount] = useState(0)
  const [justPaid, setJustPaid] = useState(false)

  // ── Fetch ticket data ──────────────────────────────────────────────────
  const fetchTicket = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        ticket_code,
        full_name,
        email,
        phone,
        student_id,
        payment_method,
        payment_status,
        amount_paid,
        paid_at,
        is_checked_in,
        checked_in_at,
        ticket_types (
          name,
          price,
          events (
            name,
            venue,
            event_date
          )
        )
      `)
      .eq('ticket_code', code)
      .single()

    if (error || !data) {
      setNotFound(true)
      setLoading(false)
      return null
    }

    const flat = {
      ...data,
      ticket_type: data.ticket_types?.name,
      price: data.ticket_types?.price,
      event_name: data.ticket_types?.events?.name,
      venue: data.ticket_types?.events?.venue,
      event_date: data.ticket_types?.events?.event_date,
    }

    return flat
  }, [code])

  // ── Initial load ───────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const data = await fetchTicket()
      if (!data) return

      const cameFromPayment = searchParams.get('payment') === 'success'

      setTicket(data)
      setLoading(false)

      if (cameFromPayment && data.payment_status !== 'paid') {
        setPolling(true)
      }
    }
    init()
  }, [code, fetchTicket, searchParams])

  // ── Polling logic ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!polling) return

    const interval = setInterval(async () => {
      setPollCount(c => {
        if (c >= MAX_POLL_ATTEMPTS) {
          clearInterval(interval)
          setPolling(false)
          return c
        }
        return c + 1
      })

      const data = await fetchTicket()
      if (data?.payment_status === 'paid') {
        setTicket(data)
        setPolling(false)
        setJustPaid(true)
        setTimeout(() => setJustPaid(false), 1000)
        clearInterval(interval)
      }
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [polling, fetchTicket])

  // ── Helpers ────────────────────────────────────────────────────────────
  const ticketUrl = `${window.location.origin}/ticket/${code}`

  function formatDate(isoString) {
    if (!isoString) return '—'
    return new Date(isoString).toLocaleDateString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila'
    })
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(ticketUrl).catch(() => {})
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="ticket-page">
        <div className="bg" />
        <div className="bg-grid" />

        <div className="content">

          {/* Logo */}
          <img src="/logo.png" alt="PUP REVO" className="ticket-logo" />

          {/* Loading */}
          {loading && (
            <div className="center-msg">
              <div className="spinner-wrap"><div className="spinner" /></div>
              <p>Loading your ticket...</p>
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="center-msg">
              <h2>Ticket Not Found</h2>
              <p>
                We couldn't find a ticket with this code.<br />
                Please check your email or contact the organizers.
              </p>
            </div>
          )}

          {/* Ticket */}
          {ticket && (
            <>
              {/* Status */}
              <div className="status-banner">
                {ticket.payment_status === 'paid' ? (
                  <div className="status-paid">
                    <i className="fa-solid fa-circle-check" /> Payment Confirmed
                  </div>
                ) : (
                  <div className="status-pending">
                    <i className="fa-regular fa-clock" /> Pending Payment
                  </div>
                )}

                {polling && (
                  <div className="polling-notice">
                    <div className="poll-dot" />
                    Waiting for GCash confirmation...
                    {pollCount >= MAX_POLL_ATTEMPTS && (
                      <span style={{ color: 'var(--muted)', marginLeft: '0.25rem' }}>
                        (check your email)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Thank you — above ticket card */}
              <div className="thank-you" style={{ marginBottom: '1.5rem' }}>
                <strong>Thank you for registering!</strong> Your support for <strong>PUP REVO 2026: Sound Against Silence — A Benefit Concert for Safer Kids</strong> means a lot in helping amplify voices that deserve to be heard.
                <br /><br />
                Please allow <strong>2–3 working days</strong> for your email confirmation and ticket pickup details. Kindly note that <strong>physical tickets are required for entry</strong>, so make sure to claim yours once details are sent.
                <br /><br />
                We look forward to seeing you! For more updates, stay connected with{' '}
                <a href="https://www.facebook.com/share/1ErP5gDH6o/" target="_blank" rel="noopener noreferrer">
                  PUP Communication Society
                </a> 💛
              </div>

              {/* Ticket card */}
              <div className={`ticket-card ${justPaid ? 'paid-flash' : ''}`}>
                <div className="ticket-top">
                  <div className="ticket-event">
                    {ticket.event_name || 'PUP REVO 2026: SOUND AGAINST SILENCE'}
                  </div>
                  <div className="ticket-date">
                    {ticket.event_date
                      ? formatDate(ticket.event_date)
                      : 'June 20, 2026 · 9:00 AM · PUP Main Campus Oval, Manila'}
                  </div>
                </div>

                <div className="ticket-body">
                  {/* QR Code — only fully visible when paid */}
                  <div className="qr-wrap">
                    <div className="qr-inner" style={{
                      filter: ticket.payment_status !== 'paid' ? 'blur(6px)' : 'none',
                      transition: 'filter 0.4s ease',
                      userSelect: ticket.payment_status !== 'paid' ? 'none' : 'auto',
                    }}>
                      <QRCodeSVG
                        value={ticketUrl}
                        size={180}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {ticket.payment_status !== 'paid' && (
                    <p style={{
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      color: 'var(--muted)',
                      marginTop: '-0.75rem',
                      marginBottom: '1.25rem',
                    }}>
                      QR code will unlock once payment is confirmed.
                    </p>
                  )}

                  {/* Details grid */}
                  <div className="ticket-details">
                    <div className="detail">
                      <div className="detail-label">Name</div>
                      <div className="detail-value">{ticket.full_name}</div>
                    </div>
                    <div className="detail">
                      <div className="detail-label">Ticket Type</div>
                      <div className="detail-value bebas">{ticket.ticket_type}</div>
                    </div>
                    <div className="detail">
                      <div className="detail-label">Payment</div>
                      <div className="detail-value bebas">
                        {ticket.payment_method === 'walk-in'
                          ? <><i className="fa-solid fa-school" style={{ marginRight: '0.4rem', fontSize: '0.95rem' }} />Walk-in</>
                          : <><i className="fa-solid fa-mobile-screen-button" style={{ marginRight: '0.4rem', fontSize: '0.95rem' }} />GCash</>
                        }
                      </div>
                    </div>
                    <div className="detail">
                      <div className="detail-label">Amount</div>
                      <div className="detail-value bebas">
                        ₱{ticket.amount_paid != null ? Number(ticket.amount_paid).toFixed(2) : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Tear line */}
                  <div className="ticket-divider" />

                  {/* Booking reference */}
                  <div className="ticket-code-wrap">
                    <div className="ticket-code-label">Booking Reference</div>
                    <div className="ticket-code">{ticket.ticket_code}</div>
                  </div>
                </div>
              </div>

              {/* Walk-in notice */}
              {ticket.payment_method === 'walk-in' && ticket.payment_status !== 'paid' && (
                <div className="walkin-notice">
                  <strong>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.4rem' }} />
                    Walk-in Payment Required
                  </strong>
                  Please present this QR code at the registration table and pay{' '}
                  ₱{Number(ticket.price ?? ticket.amount_paid).toFixed(2)} cash on event day.
                  Your slot is reserved but <em>not confirmed</em> until payment is made.
                </div>
              )}

              {/* Action buttons */}
              <div className="ticket-actions">
                <button className="action-btn btn-screenshot" onClick={handleCopyLink}>
                  <i className="fa-solid fa-link" /> Copy Link
                </button>
                <button
                  className="action-btn btn-email"
                  onClick={() => window.print()}
                >
                  <i className="fa-solid fa-print" /> Print / Save
                </button>
              </div>

              {/* Save hint — after buttons */}
              <div className="save-hint">
                <i className="fa-solid fa-camera" style={{ marginRight: '0.4rem', color: 'var(--gold)' }} />
                Screenshot this page to save your ticket. Save this link — this will be your first confirmed ticket and the final QR code for the event will appear here once confirmed.
                <br /><br />
                A copy has been sent to{' '}
                <strong style={{ color: 'var(--cream)' }}>{ticket.email}</strong>
              </div>

              {/* Presented by */}
              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,245,233,0.35)' }}>Presented by</p>
                <img src="/pupxpupcommsoc.png" alt="PUP x PUP CommSoc" style={{ width: '200px', display: 'block', margin: '0 auto' }} />
              </div>

              {/* For the Benefit of */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,245,233,0.35)' }}>For the Benefit of</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <img src="/BantayBata163.png" alt="Bantay Bata 163" style={{ width: '120px', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
                  <img src="/WorldVisionPH.png" alt="World Vision PH" style={{ width: '120px', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
                </div>
              </div>

              {/* Sponsors */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,245,233,0.35)' }}>Our Sponsors & Partners</p>
                <img src="/sponsors.png" alt="Sponsors" style={{ width: '100%', maxWidth: '520px', display: 'block', margin: '0 auto', opacity: 0.85 }} />
              </div>

              {/* Footer */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(250,245,233,0.5)', lineHeight: 1.7 }}>Follow us on our official social media accounts for updates.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                  {[
                    { href: 'https://www.facebook.com/pupcommsoc', label: 'f' },
                    { href: 'https://www.instagram.com/pupcommsoc_/', label: 'ig' },
                    { href: 'https://x.com/pupcommsoc_', label: 'x' },
                    { href: 'http://tiktok.com/@pup_commsoc', label: 'tt' },
                  ].map(({ href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', background: '#1a2340', borderRadius: '50%',
                      textDecoration: 'none', fontSize: '12px', color: '#FAF5E9', fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    }}>{label}</a>
                  ))}
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'rgba(250,245,233,0.3)' }}>© 2026 PUP REVO — PUP Communication Society. All rights reserved.</p>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'rgba(250,245,233,0.3)' }}>
                  For concerns, email{' '}
                  <a href="mailto:puprevo.commsoc@gmail.com" style={{ color: 'rgba(250,245,233,0.4)' }}>puprevo.commsoc@gmail.com</a>
                </p>
                <p style={{ margin: '0 0 2rem', fontSize: '11px', color: 'rgba(250,245,233,0.3)' }}>
                  Website: <a href="https://puprevo2026.me" style={{ color: '#FFD700' }}>puprevo2026.me</a>
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}
