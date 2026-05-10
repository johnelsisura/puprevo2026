// src/pages/Landing.jsx
// PUPREVO 2026 — Event Landing Page
// Fonts needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EVENT_DATE = new Date('2026-06-20T18:00:00+08:00') // <-- palitan ng tamang date

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date()
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export default function Landing() {
  const navigate = useNavigate()
  const { d, h, m, s } = useCountdown(EVENT_DATE)
  const [slots, setSlots] = useState({ student: null, public: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlots() {
      const { data } = await supabase
        .from('ticket_types')
        .select('name, price, total_slots, sold_count')
      if (data) {
        const student = data.find(t => t.name === 'PUP Student')
        const pub = data.find(t => t.name === 'Public')
        setSlots({ student, public: pub })
      }
      setLoading(false)
    }
    fetchSlots()
  }, [])

  const pad = n => String(n ?? 0).padStart(2, '0')

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root {
          --red: #E4001B;
          --gold: #F5C842;
          --cream: #FAF5E9;
          --dark: #0A0500;
          --card-bg: #110900;
        }

        body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        .page { min-height: 100vh; position: relative; }

        /* ---- HERO ---- */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(228,0,27,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(245,200,66,0.08) 0%, transparent 60%),
            var(--dark);
          z-index: 0;
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(228,0,27,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(228,0,27,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
        }

        .hero-content { position: relative; z-index: 1; max-width: 900px; }

        .badge {
          display: inline-block;
          border: 1px solid rgba(245,200,66,0.4);
          color: var(--gold);
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 0.4rem 1.2rem;
          border-radius: 2rem;
          margin-bottom: 2rem;
          background: rgba(245,200,66,0.06);
        }

        .title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 18vw, 14rem);
          line-height: 0.88;
          letter-spacing: -0.01em;
          color: var(--cream);
          margin-bottom: 1rem;
        }

        .title span {
          display: block;
          color: var(--red);
          -webkit-text-stroke: 2px var(--red);
        }

        .subtitle {
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(250,245,233,0.5);
          margin-bottom: 3rem;
        }

        /* ---- COUNTDOWN ---- */
        .countdown {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .countdown-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          line-height: 1;
          color: var(--cream);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.4rem 1rem;
          border-radius: 8px;
          min-width: 80px;
          text-align: center;
        }

        .countdown-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,245,233,0.35);
        }

        /* ---- CTA ---- */
        .cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--red);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 30px rgba(228,0,27,0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(228,0,27,0.6);
        }

        .btn-secondary {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: transparent;
          color: var(--cream);
          border: 1px solid rgba(250,245,233,0.2);
          padding: 1rem 2rem;
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }

        .btn-secondary:hover { border-color: rgba(250,245,233,0.5); background: rgba(255,255,255,0.04); }

        /* ---- TICKET SECTION ---- */
        .section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 1;
          color: var(--cream);
          margin-bottom: 3rem;
        }

        .tickets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .ticket-card {
          background: var(--card-bg);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }

        .ticket-card:hover { transform: translateY(-4px); border-color: rgba(228,0,27,0.4); }

        .ticket-card.featured { border-color: rgba(245,200,66,0.3); }

        .ticket-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .ticket-type {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          color: var(--cream);
        }

        .ticket-badge {
          font-family: 'Syne', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: rgba(245,200,66,0.15);
          color: var(--gold);
          padding: 0.25rem 0.6rem;
          border-radius: 2rem;
          border: 1px solid rgba(245,200,66,0.3);
        }

        .ticket-price {
          padding: 1.5rem;
        }

        .price-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          line-height: 1;
          color: var(--cream);
        }

        .price-currency {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          color: rgba(250,245,233,0.4);
          margin-left: 4px;
        }

        .ticket-slots {
          padding: 0 1.5rem 1.5rem;
        }

        .slot-bar-bg {
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          height: 4px;
          margin-bottom: 0.5rem;
        }

        .slot-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--red);
          transition: width 0.5s ease;
        }

        .slot-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: rgba(250,245,233,0.4);
        }

        .ticket-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .ticket-btn {
          width: 100%;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--red);
          color: white;
          border: none;
          padding: 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }

        .ticket-btn:hover { opacity: 0.85; transform: scale(0.99); }
        .ticket-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ---- EVENT DETAILS ---- */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .detail-item {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
        }

        .detail-icon {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .detail-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,245,233,0.35);
          margin-bottom: 0.4rem;
        }

        .detail-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--cream);
        }

        /* ---- DIVIDER ---- */
        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 0 2rem;
        }

        /* ---- FOOTER ---- */
        .footer {
          text-align: center;
          padding: 3rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: rgba(250,245,233,0.2);
        }

        .footer strong { color: var(--red); }

        /* ---- SOLD OUT ---- */
        .sold-out { opacity: 0.5; pointer-events: none; }

        @media (max-width: 600px) {
          .countdown { gap: 0.75rem; }
          .countdown-num { min-width: 60px; padding: 0.3rem 0.6rem; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />

          <div className="hero-content">
            <div className="badge">✦ PUP Communication Society ✦</div>

            <h1 className="title">
              REVO
              <span>NIGHT</span>
              2026
            </h1>

            <p className="subtitle">
              An Evening of Music, Culture & PUP Pride
            </p>

            {/* Countdown */}
            <div className="countdown">
              {[
                { val: d, label: 'Days' },
                { val: h, label: 'Hours' },
                { val: m, label: 'Mins' },
                { val: s, label: 'Secs' },
              ].map(({ val, label }) => (
                <div className="countdown-unit" key={label}>
                  <div className="countdown-num">{pad(val)}</div>
                  <div className="countdown-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="cta-group">
              <button
                className="btn-primary"
                onClick={() => navigate('/checkout')}
              >
                Get Your Ticket
              </button>
              <button
                className="btn-secondary"
                onClick={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}
              >
                Event Details
              </button>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* EVENT DETAILS */}
        <section className="section" id="details">
          <div className="section-label">About the Event</div>
          <h2 className="section-title">Event Details</h2>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon">📅</div>
              <div className="detail-label">Date</div>
              <div className="detail-value">June 20, 2026</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">🕕</div>
              <div className="detail-label">Time</div>
              <div className="detail-value">9:00 AM onwards</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">📍</div>
              <div className="detail-label">Venue</div>
              <div className="detail-value">PUP Main Campus, Manila</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">🎤</div>
              <div className="detail-label">Hosted by</div>
              <div className="detail-value">PUP Communication Society</div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* TICKETS */}
        <section className="section" id="tickets">
          <div className="section-label">Buy Now</div>
          <h2 className="section-title">Get Your Ticket</h2>

          {loading ? (
            <p style={{ color: 'rgba(250,245,233,0.4)', fontFamily: 'DM Sans' }}>
              Loading ticket info...
            </p>
          ) : (
            <div className="tickets-grid">
              {/* PUP Student Ticket */}
              {slots.student && (() => {
                const remaining = slots.student.total_slots - slots.student.sold_count
                const pct = (slots.student.sold_count / slots.student.total_slots) * 100
                const soldOut = remaining <= 0
                return (
                  <div className={`ticket-card ${soldOut ? 'sold-out' : ''}`}>
                    <div className="ticket-header">
                      <div className="ticket-type">PUP Student</div>
                      <div className="ticket-badge">Student</div>
                    </div>
                    <div className="ticket-price">
                      <span className="price-amount">₱{slots.student.price}</span>
                    </div>
                    <div className="ticket-slots">
                      <div className="slot-bar-bg">
                        <div className="slot-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="slot-text">
                        {soldOut ? '🔴 Sold Out' : `${remaining} slots remaining`}
                      </div>
                    </div>
                    <div className="ticket-footer">
                      <button
                        className="ticket-btn"
                        disabled={soldOut}
                        onClick={() => navigate('/checkout?type=student')}
                      >
                        {soldOut ? 'Sold Out' : 'Buy Student Ticket'}
                      </button>
                    </div>
                  </div>
                )
              })()}

              {/* Public Ticket */}
              {slots.public && (() => {
                const remaining = slots.public.total_slots - slots.public.sold_count
                const pct = (slots.public.sold_count / slots.public.total_slots) * 100
                const soldOut = remaining <= 0
                return (
                  <div className={`ticket-card featured ${soldOut ? 'sold-out' : ''}`}>
                    <div className="ticket-header">
                      <div className="ticket-type">Public / Alumni</div>
                      <div className="ticket-badge">Open</div>
                    </div>
                    <div className="ticket-price">
                      <span className="price-amount">₱{slots.public.price}</span>
                    </div>
                    <div className="ticket-slots">
                      <div className="slot-bar-bg">
                        <div className="slot-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="slot-text">
                        {soldOut ? '🔴 Sold Out' : `${remaining} slots remaining`}
                      </div>
                    </div>
                    <div className="ticket-footer">
                      <button
                        className="ticket-btn"
                        disabled={soldOut}
                        onClick={() => navigate('/checkout?type=public')}
                      >
                        {soldOut ? 'Sold Out' : 'Buy Public Ticket'}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2026 <strong>PUPREVO</strong> — PUP Communication Society. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>
            For concerns, email{' '}
            <a href="mailto:puprevo@pup.edu.ph" style={{ color: 'rgba(250,245,233,0.4)' }}>
              puprevo@pup.edu.ph
            </a>
          </p>
        </footer>
      </div>
    </>
  )
}
