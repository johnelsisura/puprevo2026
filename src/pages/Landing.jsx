// src/pages/Landing.jsx
// PUPREVO 2026 — Event Landing Page
// Fonts needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// Font Awesome needed in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Inject Font Awesome if not already loaded
if (!document.querySelector('link[href*="font-awesome"]')) {
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  document.head.appendChild(fa)
}

const EVENT_DATE = new Date('2026-06-20T09:00:00+08:00')

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

const FAQ_ITEMS = [
  { q: 'What is PUP REVO 2026?', a: 'PUP REVO 2026: Sound Against Silence is a day of OPM music, advocacy, and PUP pride organized by the PUP Communication Society. It is a fundraising event where proceeds go to ABS-CBN Foundation - Bantay Bata 163 and World Vision Philippines.' },
  { q: 'When and where is the event?', a: 'The event will be held on June 20, 2026, starting at 9:00 AM at the PUP Main Campus Oval, Manila.' },
  { q: 'Who can attend?', a: 'The event is open to PUP students, alumni, and the general public. There are two ticket tiers: a discounted rate for PUP students and a regular rate for public/alumni attendees.' },
  { q: 'How do I get a ticket?', a: 'Click the "Get Your Ticket" button on this page or scroll down to the Tickets section. Choose your ticket type and complete the checkout process online.' },
  { q: 'Do I need to bring a physical ticket?', a: 'Your e-ticket or confirmation email serves as proof of purchase. However, a physical ticket is still required for event entry. You must claim your physical ticket at any of our designated onsite ticket selling/claiming booths prior to entering the venue. Please present your e-ticket (digital or printed) upon claiming.' },
  { q: 'Is there a deadline for purchasing tickets?', a: 'Tickets are available while slots last. We encourage you to purchase early as slots are limited and may sell out before the event date.' },
  { q: 'Are tickets refundable?', a: 'All ticket sales are final and non-refundable. For special concerns, please reach out to us on Facebook or via email at puprevo.commsoc@gmail.com.' },
  { q: 'Who are the beneficiaries of this event?', a: 'A portion of ticket sales will be donated to ABS-CBN Foundation -Bantay Bata 163 and World Vision Philippines — two organizations dedicated to the welfare and development of children and communities in need.' },
  { q: 'How can I contact the organizers?', a: 'For any questions or concerns, email us at puprevo.commsoc@gmail.com. You can also reach us through the official PUP Communication Society social media pages.' },
  { q: 'Where can I stay updated about announcements and performer reveals?', a: 'Official announcements, performer lineups, ticket updates, and event reminders will be posted through the official PUP Communication Society social media pages.' },
  { q: 'What time do gates open?', a: 'Gates open at 8:00 AM for the fall-in line. Early attendees will have the opportunity to witness the live soundcheck. We encourage everyone to arrive early to avoid long lines and enjoy the full REVO experience.' },
  { q: 'Can I leave and re-enter the venue?', a: 'Re-entry policies will be announced closer to the event date. Please stay updated through the official PUP Communication Society social media pages for guidelines.' },
  { q: 'Are outside food and drinks allowed?', a: 'Outside food and drinks may be subject to venue regulations and security policies. Official announcements regarding allowed and prohibited items will be posted before the event.' },
  { q: 'Is there a dress code?', a: 'There is no strict dress code, but attendees are encouraged to wear comfortable and event-appropriate clothing. Come dressed for a full-day concert experience!' },
  { q: 'Will there be food booths and concessionaires?', a: 'Yes! Food and beverage booths, partner booths, and sponsor activations will be available during the event for attendees to enjoy.' },
  { q: 'Will there be security and medical personnel on-site?', a: 'Yes. Security personnel, event marshals, and medical responders will be present throughout the event to help ensure everyone\'s safety and well-being.' },
  { q: 'What should I do if I lose something during the event?', a: 'A designated help desk/lost and found area will be available at the venue. Announcements may also be made during the event for recovered items.' },
  { q: 'Is this event only for music performances?', a: 'No. PUP REVO 2026 is more than a concert — it is an advocacy-driven fundraising event that combines music, community, and collective action in support of safer spaces for kids.' },
  { q: 'What happens if it rains?', a: 'PUP REVO 2026 will continue rain or shine unless safety concerns require further announcements from the organizers. Attendees are encouraged to prepare accordingly.' },
  { q: 'Will merchandise be available during the event?', a: 'Official PUP REVO 2026 merchandise are available through pre-orders. Stay tuned for official announcements regarding merch releases and claiming schedules.' },
]

function ArtistCard({ artist }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showTba = !artist.image || imgFailed

  return (
    <div className="artist-card">
      {showTba ? (
        <div className="artist-tba">
          <div className="artist-tba-icon"><i className="fa-solid fa-music" /></div>
          <div className="artist-tba-text">Coming Soon</div>
        </div>
      ) : (
        <>
          <img
            src={artist.image}
            alt={artist.name}
            className="artist-img"
            onError={() => setImgFailed(true)}
          />
          <div className="artist-overlay">
            <div className="artist-name">{artist.name}</div>
            {artist.tag && <div className="artist-tag">{artist.tag}</div>}
          </div>
        </>
      )}
    </div>
  )
}

// Artists lineup — update name & tag per artist when ready for reveal
const ARTISTS = [
  { name: 'MAYONNAISE', tag: 'Performing Live', image: '/artist1.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist2.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist3.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist4.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist5.png' },
  { name: 'IAN QUIRUZ', tag: 'Performing Live', image: '/artist6.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist7.png' },
  { name: 'SHANNE DANDAN', tag: 'Performing Live', image: '/artist8.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist9.png' },
  { name: 'BRANDO BAL', tag: 'Performing Live', image: '/artist10.png' },
  { name: 'Artist Name', tag: 'Performing Live', image: '/artist11.png' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { d, h, m, s } = useCountdown(EVENT_DATE)
  const [slots, setSlots] = useState({ student: null, public: null })
  const [loading, setLoading] = useState(true)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [faqSearch, setFaqSearch] = useState('')

  useEffect(() => {
    async function fetchSlots() {
      // Fetch ticket types
      const { data: types } = await supabase
        .from('ticket_types')
        .select('id, name, price, total_slots')

      if (types) {
        // Count non-cancelled orders per ticket type (pending + paid both hold a slot)
        const { data: counts } = await supabase
          .from('orders')
          .select('ticket_type_id')
          .neq('payment_status', 'cancelled')

        const countMap = {}
        if (counts) {
          counts.forEach(o => {
            countMap[o.ticket_type_id] = (countMap[o.ticket_type_id] || 0) + 1
          })
        }

        const enriched = types.map(t => ({
          ...t,
          sold_count: countMap[t.id] || 0,
        }))

        const student = enriched.find(t => t.name === 'PUP Student')
        const pub = enriched.find(t => t.name === 'Public')
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
          --red: #FF3B30;
          --gold: #FFD700;
          --blue: #1A4FD6;
          --cream: #FAF5E9;
          --dark: #060D1F;
          --card-bg: #0D1530;
        }

        body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        .page { min-height: 100vh; position: relative; }

        /* ---- HERO ---- */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 2rem;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
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
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(26,79,214,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,79,214,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
          animation: gridDrift 20s linear infinite;
        }
        @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

        /* ---- FLOATING DECO NOTES ---- */
        .deco-note {
          position: absolute; opacity: 0.15;
          pointer-events: none;
          animation: floatNote 5s ease-in-out infinite;
          z-index: 0; user-select: none;
        }
        .deco-note:nth-child(1){top:12%;left:6%;font-size:32px;color:var(--red);animation-duration:4.5s;animation-delay:0s}
        .deco-note:nth-child(2){top:25%;right:8%;font-size:22px;color:var(--gold);animation-duration:5.5s;animation-delay:1s}
        .deco-note:nth-child(3){top:55%;left:4%;font-size:18px;color:var(--blue);animation-duration:6s;animation-delay:2s}
        .deco-note:nth-child(4){top:18%;right:22%;font-size:26px;color:var(--gold);animation-duration:4s;animation-delay:0.5s}
        .deco-note:nth-child(5){top:68%;right:7%;font-size:20px;color:var(--blue);animation-duration:5s;animation-delay:1.5s}
        .deco-note:nth-child(6){top:40%;left:9%;font-size:16px;color:var(--red);animation-duration:7s;animation-delay:3s}
        .deco-note:nth-child(7){top:78%;left:20%;font-size:24px;color:var(--gold);animation-duration:4.8s;animation-delay:2.5s}
        @keyframes floatNote { 0%,100%{transform:translateY(0px) rotate(-6deg)} 50%{transform:translateY(-16px) rotate(6deg)} }

        .hero-content { position: relative; z-index: 1; max-width: 900px; }

        .badge {
          display: inline-block;
          border: 1px solid rgba(255,215,0,0.4); color: var(--gold);
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          padding: 0.4rem 1.2rem; border-radius: 2rem; margin-bottom: 2rem;
          background: rgba(255,215,0,0.06);
        }

        .hero-event-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.3rem, 3.5vw, 2.2rem);
          letter-spacing: 0.1em; color: var(--gold);
          margin-bottom: 0.6rem; opacity: 0.9;
        }

        .title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 18vw, 14rem);
          line-height: 0.88; letter-spacing: -0.01em;
          color: var(--cream); margin-bottom: 1rem;
        }
        .title span { display: block; color: var(--red); -webkit-text-stroke: 2px var(--red); }

        .subtitle {
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.9rem, 2vw, 1.1rem); font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(250,245,233,0.5); margin-bottom: 1rem;
        }

        .hero-date-pill {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--cream);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.5rem 1.4rem; border-radius: 2rem; margin-bottom: 3rem;
          background: rgba(255,255,255,0.05);
        }

        /* ---- COUNTDOWN ---- */
        .countdown { display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
        .countdown-unit { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
        .countdown-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem); line-height: 1; color: var(--cream);
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          padding: 0.4rem 1rem; border-radius: 8px; min-width: 80px; text-align: center;
        }
        .countdown-label {
          font-family: 'Syne', sans-serif; font-size: 0.6rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: rgba(250,245,233,0.35);
        }

        /* ---- CTA ---- */
        .cta-group { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.05em; text-transform: uppercase;
          background: var(--gold); color: #000; border: none;
          padding: 1rem 2.5rem; border-radius: 4px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 30px rgba(255,215,0,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(255,215,0,0.55); }
        .btn-secondary {
          font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.9rem;
          letter-spacing: 0.05em; text-transform: uppercase;
          background: transparent; color: var(--cream);
          border: 1px solid rgba(250,245,233,0.2); padding: 1rem 2rem;
          border-radius: 4px; cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-secondary:hover { border-color: rgba(250,245,233,0.5); background: rgba(255,255,255,0.04); }

        /* ---- SECTIONS ---- */
        .section { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem;
        }
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1; color: var(--cream); margin-bottom: 3rem;
        }

        /* ---- EVENT DETAILS ---- */
        .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .detail-item {
          padding: 1.5rem; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
        }
        .detail-icon { font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--gold); }
        .detail-label {
          font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(250,245,233,0.35); margin-bottom: 0.4rem;
        }
        .detail-value {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
          color: var(--cream); text-transform: uppercase; letter-spacing: 0.08em;
        }

        /* ---- BENEFICIARIES ---- */
        .bene-card {
          background: rgba(26,79,214,0.06); border: 1px solid rgba(26,79,214,0.2);
          border-radius: 8px; padding: 1.5rem; grid-column: 1 / -1;
        }
        .bene-card .detail-icon { color: var(--red); }
        .bene-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.25rem; }
        @media(max-width:600px){ .bene-grid{ grid-template-columns: 1fr; } }
        .bene-item {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 1.5rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.9rem;
          text-align: center;
          transition: border-color 0.2s, transform 0.2s;
        }
        .bene-item:hover { border-color: rgba(255,215,0,0.3); transform: translateY(-2px); }
        .bene-logo {
          height: 52px; object-fit: contain; object-position: center;
          filter: brightness(0) invert(1); opacity: 0.85;
        }
        .bene-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
          letter-spacing: 0.1em; color: var(--cream);
          line-height: 1.2;
        }
        .bene-desc {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          color: rgba(250,245,233,0.55); line-height: 1.65;
        }
        .bene-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold); text-decoration: none;
          border: 1px solid rgba(255,215,0,0.35); padding: 0.4rem 1rem;
          border-radius: 2rem; transition: background 0.15s, opacity 0.15s;
        }
        .bene-link:hover { background: rgba(255,215,0,0.08); opacity: 0.85; }

        /* ---- TICKETS ---- */
        .tickets-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .ticket-card {
          background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; overflow: hidden; position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }
        .ticket-card:hover { transform: translateY(-4px); border-color: rgba(255,59,48,0.4); }
        .ticket-card.featured { border-color: rgba(255,215,0,0.3); }
        .ticket-header {
          padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .ticket-type { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 0.06em; color: var(--cream); }
        .ticket-badge {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          background: rgba(255,215,0,0.15); color: var(--gold);
          padding: 0.25rem 0.6rem; border-radius: 2rem; border: 1px solid rgba(255,215,0,0.3);
        }
        .ticket-price { padding: 1.5rem; }
        .price-amount { font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem; line-height: 1; color: var(--cream); }
        .price-original { font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem; color: rgba(250,245,233,0.3); text-decoration: line-through; margin-left: 0.5rem; }
        .price-discount-badge { display: inline-block; font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); padding: 0.2rem 0.55rem; border-radius: 2rem; margin-left: 0.5rem; vertical-align: middle; }
        .ticket-slots { padding: 0 1.5rem 0.5rem; }
        .slot-bar-bg { background: rgba(255,255,255,0.06); border-radius: 2px; height: 4px; margin-bottom: 0.5rem; }
        .slot-bar-fill { height: 100%; border-radius: 2px; background: var(--red); transition: width 0.5s ease; }
        .slot-text { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: rgba(250,245,233,0.4); }
        .ticket-desc {
          padding: 0.75rem 1.5rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          color: rgba(250,245,233,0.35); line-height: 1.5;
          border-top: 1px solid rgba(255,255,255,0.04); font-style: italic;
        }
        .ticket-footer { padding: 1rem 1.5rem 1.5rem; }
        .ticket-btn {
          width: 100%; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: var(--gold); color: #000; border: none;
          padding: 0.85rem; border-radius: 6px; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .ticket-btn:hover { opacity: 0.85; transform: scale(0.99); }
        .ticket-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ---- SPONSORS ---- */
        .sponsors-wrap { text-align: center; padding: 0.5rem 0; }
        .sponsors-img {
          max-width: 100%; width: 100%; opacity: 0.85;
          transition: opacity 0.2s;
        }
        .sponsors-img:hover { opacity: 1; }

        /* ---- FAQ ---- */
        details.faq-item {
          background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; overflow: hidden; transition: border-color 0.2s;
        }
        details.faq-item[open] { border-color: rgba(255,59,48,0.35); }
        summary.faq-summary {
          font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700;
          color: var(--cream); padding: 1.2rem 1.5rem; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; list-style: none; text-align: left;
        }
        summary.faq-summary::-webkit-details-marker { display: none; }
        .faq-icon { color: var(--red); flex-shrink: 0; font-size: 1.2rem; transition: transform 0.2s; }
        details.faq-item[open] .faq-icon { transform: rotate(45deg); }
        .faq-body {
          padding: 0.8rem 1.5rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.05);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: rgba(250,245,233,0.65); line-height: 1.7; text-align: left;
        }
        .faq-search-wrap {
          position: relative; margin-bottom: 1.5rem;
        }
        .faq-search-icon {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          color: rgba(250,245,233,0.3); font-size: 0.9rem; pointer-events: none;
        }
        .faq-search-input {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--cream); outline: none;
          transition: border-color 0.15s;
        }
        .faq-search-input::placeholder { color: rgba(250,245,233,0.25); }
        .faq-search-input:focus { border-color: rgba(255,59,48,0.45); }
        .faq-no-results {
          text-align: left; padding: 2rem 0;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: rgba(250,245,233,0.35);
        }

        /* ---- ARTISTS ---- */
        .artists-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        @media(min-width: 640px) {
          .artists-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
        .artist-card {
          position: relative; border-radius: 12px; overflow: hidden;
          aspect-ratio: 3/4;
          background: var(--card-bg);
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.25s, border-color 0.25s;
          cursor: default;
        }
        .artist-card:hover { transform: translateY(-6px) scale(1.01); border-color: rgba(255,215,0,0.35); }
        .artist-card:hover .artist-overlay { opacity: 1; }
        .artist-card:hover .artist-img { transform: scale(1.06); }
        .artist-img {
          width: 100%; height: 100%; object-fit: cover; object-position: top center;
          display: block; transition: transform 0.4s ease;
        }
        .artist-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(6,13,31,0.95) 0%, rgba(6,13,31,0.4) 55%, transparent 100%);
          opacity: 0.85;
          transition: opacity 0.3s;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0.5rem 0.5rem 0.5rem;
        }
        @media(min-width: 640px) {
          .artist-overlay { padding: 1.25rem 1rem 1rem; }
        }
        .artist-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem; letter-spacing: 0.04em;
          color: var(--cream); line-height: 1.1; margin-bottom: 0.15rem;
        }
        .artist-tag {
          font-family: 'Syne', sans-serif; font-size: 0.45rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold); opacity: 0.85;
        }
        @media(min-width: 640px) {
          .artist-name { font-size: 1.4rem; letter-spacing: 0.06em; margin-bottom: 0.25rem; }
          .artist-tag { font-size: 0.6rem; letter-spacing: 0.2em; }
        }
        .artist-tba {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 100%;
          gap: 0.75rem;
        }
        .artist-tba-icon {
          font-size: 1.5rem; color: rgba(255,215,0,0.2);
        }
        @media(min-width: 640px) {
          .artist-tba-icon { font-size: 2.5rem; }
        }
        .artist-tba-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.65rem; letter-spacing: 0.15em;
          color: rgba(250,245,233,0.2); text-transform: uppercase;
        }

        /* ---- DIVIDER ---- */
        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0; }

        /* ---- FOOTER ---- */
        .footer {
          text-align: center; padding: 3rem 2rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          color: rgba(250,245,233,0.2);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer strong { color: var(--red); }
        .footer-socials { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .footer-social-link {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(250,245,233,0.45); font-size: 0.9rem;
          text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .footer-social-link:hover { border-color: var(--gold); color: var(--gold); background: rgba(255,215,0,0.07); }
        .footer-privacy-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(250,245,233,0.3); font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; text-decoration: underline; margin-top: 0.75rem;
          display: inline-block; transition: color 0.15s;
        }
        .footer-privacy-btn:hover { color: rgba(250,245,233,0.6); }

        /* ---- PRIVACY MODAL ---- */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }
        .modal {
          background: #0D1530; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; max-width: 680px; width: 100%;
          max-height: 80vh; overflow-y: auto; padding: 2rem;
          text-align: left;
        }
        .modal h2 {
          font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
          color: var(--gold); margin-bottom: 0.5rem;
        }
        .modal-subtitle {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          color: rgba(250,245,233,0.4); margin-bottom: 1rem;
        }
        .modal h3 {
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
          color: var(--cream); margin: 1.25rem 0 0.4rem; letter-spacing: 0.05em;
        }
        .modal p { font-family: 'DM Sans', sans-serif; font-size: 0.84rem; color: rgba(250,245,233,0.6); line-height: 1.75; }
        .modal ul { padding-left: 1.2rem; margin-top: 0.4rem; }
        .modal li { font-family: 'DM Sans', sans-serif; font-size: 0.84rem; color: rgba(250,245,233,0.6); line-height: 1.75; }
        .modal-close {
          display: block; margin: 1.5rem auto 0;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: rgba(255,255,255,0.07); color: var(--cream);
          border: 1px solid rgba(255,255,255,0.12); padding: 0.6rem 2rem;
          border-radius: 4px; cursor: pointer; transition: background 0.15s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.12); }

        /* ---- SOLD OUT ---- */
        .sold-out { opacity: 0.5; pointer-events: none; }

        /* ---- TICKETS URGENCY STRIP ---- */
        .tickets-urgency {
          display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;
          margin-top: -1.5rem; margin-bottom: 1.75rem;
        }
        .urgency-dot {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--red);
        }
        .urgency-dot::before {
          content: ''; display: inline-block;
          width: 8px; height: 8px; border-radius: 50%; background: var(--red);
          animation: urgencyPulse 1.4s ease-in-out infinite;
        }
        @keyframes urgencyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
        .urgency-wave-pill {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          color: rgba(250,245,233,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.3rem 0.85rem; border-radius: 2rem;
          background: rgba(255,255,255,0.03);
        }
        .urgency-wave-sep { opacity: 0.3; }

        /* ---- SLOTS NOT GUARANTEED ---- */
        .ticket-snag {
          padding: 0 1.5rem 0.75rem;
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--red); display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }

        /* ---- MEMBERSHIP PERK BANNER ---- */
        .perk-banner {
          margin-top: 2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,215,0,0.18);
          border-radius: 12px; padding: 1.75rem 2rem;
          position: relative; overflow: hidden;
        }
        .perk-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,215,0,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .perk-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.6rem;
        }
        .perk-label {
          font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); opacity: 0.7;
        }
        .perk-badge {
          font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: rgba(74,222,128,0.12); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.25);
          padding: 0.25rem 0.7rem; border-radius: 2rem;
        }
        @media (max-width: 600px) {
          .perk-label { font-size: 0.55rem; }
          .perk-badge { font-size: 0.75rem; letter-spacing: 0.06em; padding: 0.2rem 0.5rem; }
        }
        .perk-title {
          font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.4rem,3.5vw,2rem);
          letter-spacing: 0.06em; color: var(--cream); margin-bottom: 0.35rem;
          text-align: left;
        }
        .perk-sub {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          color: rgba(250,245,233,0.45); margin-bottom: 1.1rem;
          text-align: left;
        }
        .perk-list { display: flex; flex-direction: column; gap: 0.55rem; }
        .perk-item {
          display: flex; align-items: center; gap: 0.65rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.84rem;
          color: rgba(250,245,233,0.75);
        }
        .perk-logo {
          height: 80px; object-fit: contain; opacity: 0.9; flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .perk-logo { height: 52px; align-self: center; margin: 0 auto; }
        }
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: rgba(74,222,128,0.15); border: 1px solid rgba(74,222,128,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #4ade80; font-size: 0.65rem;
        }

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
          <div className="deco-note">♪</div>
          <div className="deco-note">♫</div>
          <div className="deco-note">♩</div>
          <div className="deco-note">♬</div>
          <div className="deco-note">♭</div>
          <div className="deco-note">♪</div>
          <div className="deco-note">♫</div>

          <div className="hero-content">
            <img src="/pupxpupcommsoc.png" alt="PUP x PUP CommSoc" style={{ width: '200px', display: 'block', margin: '0 auto 1rem auto' }} />
            <div className="badge">✦ PUP Communication Society ✦</div>

            {/* Event title above REVO */}
            <p className="hero-event-title">PUP REVO 2026: SOUND AGAINST SILENCE</p>

            <img src="/officialposter.png" alt="PUP Revo 2026 Poster" style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '1.5rem auto 0 auto' }} />

            <p className="subtitle">A Day of Advocacy, OPM Music, & PUP Pride</p>

            <div className="hero-date-pill">
              <i className="fa-regular fa-calendar" />
              JUNE 20, 2026
            </div>

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
              <button className="btn-primary" onClick={() => document.getElementById('tickets').scrollIntoView({ behavior: 'smooth' })}>
                Get Your Ticket
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}>
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

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', lineHeight: '1.85',
            color: 'rgba(250,245,233,0.7)', maxWidth: '760px', marginBottom: '2.5rem',
            textAlign: 'center', margin: '0 auto 2.5rem auto'
          }}>
            <p>The PUP Communication Society proudly presents <strong style={{ color: 'var(--cream)' }}>PUP REVO 2026: Sound Against Silence — A Benefit Concert for Safer Kids</strong>, a revived and reimagined flagship concert that brings together music, creative media, and social advocacy. More than just entertainment, the event serves as a platform to amplify voices, raise awareness, and inspire action against child abuse, exploitation, and trafficking.</p>
            <p style={{ marginTop: '1rem' }}>In partnership with ABS-CBN Foundation - Bantay Bata 163 and World Vision Philippines, this benefit concert aims to mobilize the PUP community and beyond to turn sound into a force for change—because silence should never protect harm.</p>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon"><i className="fa-regular fa-calendar" /></div>
              <div className="detail-label">Date</div>
              <div className="detail-value">June 20, 2026</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fa-regular fa-clock" /></div>
              <div className="detail-label">Time</div>
              <div className="detail-value">9:00 AM Onwards</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fa-solid fa-location-dot" /></div>
              <div className="detail-label">Venue</div>
              <div className="detail-value">PUP Main Campus Oval, Manila</div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fa-solid fa-microphone" /></div>
              <div className="detail-label">Hosted By</div>
              <div className="detail-value">PUP Communication Society</div>
            </div>

            {/* BENEFICIARIES */}
            <div className="detail-item bene-card">
              <div className="detail-icon"><i className="fa-solid fa-heart" /></div>
              <div className="detail-label">Beneficiaries</div>
              <div className="bene-grid">
                <div className="bene-item">
                  <img src="/BantayBata163.png" alt="Bantay Bata 163" className="bene-logo" />
                  <div className="bene-title">ABS-CBN Foundation - Bantay Bata 163</div>
                  <p className="bene-desc">
                    Giving abused and vulnerable children a voice through rescue, protection, and safe spaces, so no child suffers in silence.
                  </p>
                  <a href="https://abs-cbncares.org/ways-to-give/programs/child-welfare" target="_blank" rel="noopener noreferrer" className="bene-link">
                    <i className="fa-solid fa-arrow-up-right-from-square" /> Learn More
                  </a>
                </div>
                <div className="bene-item">
                  <img src="/WorldVisionPH.png" alt="World Vision Philippines" className="bene-logo" />
                  <div className="bene-title">World Vision Philippines</div>
                  <p className="bene-desc">
                    Standing with children in the most vulnerable communities, protecting their rights and helping them build a future free from fear.
                  </p>
                  <a href="https://joytogive.worldvision.org.ph/donate/details/18/childhood-rescue-survive-recover-and-build-a-future" target="_blank" rel="noopener noreferrer" className="bene-link">
                    <i className="fa-solid fa-arrow-up-right-from-square" /> Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* TICKETS */}
        <section className="section" id="tickets">
          <div className="section-label">Buy Now</div>
          <h2 className="section-title">Get Your Ticket</h2>

          {/* Urgency strip */}
          <div className="tickets-urgency">
            <span className="urgency-dot">Very Limited Tickets Only</span>
            <span className="urgency-wave-pill">
              Wave per week <span className="urgency-wave-sep">·</span> Slots not guaranteed
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(250,245,233,0.4)', fontFamily: 'DM Sans' }}>Loading ticket info...</p>
          ) : (
            <div className="tickets-grid">
              {/* PUPian Ticket */}
              {slots.student && (() => {
                const remaining = slots.student.total_slots - slots.student.sold_count
                const pct = (slots.student.sold_count / slots.student.total_slots) * 100
                const soldOut = remaining <= 0
                return (
                  <div className={`ticket-card ${soldOut ? 'sold-out' : ''}`}>
                    <div className="ticket-header">
                      <div className="ticket-type">PUPian</div>
                      <div className="ticket-badge">Student</div>
                    </div>
                    <div className="ticket-price">
                      <span className="price-amount">₱{slots.student.price}</span>
                      <span className="price-original">₱{slots.public?.price ?? 350}</span>
                      <span className="price-discount-badge">-₱{(slots.public?.price ?? 350) - slots.student.price} off</span>
                    </div>
                    <div className="ticket-slots">
                      <div className="slot-bar-bg">
                        <div className="slot-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="slot-text">
                        {soldOut ? <><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.35rem', color: 'var(--red)' }} /> Sold Out</> : `${remaining} slots remaining`}
                      </div>
                    </div>
                    {!soldOut && (
                      <div className="ticket-snag">
                        <i className="fa-solid fa-bolt" />
                        Buy Now — Slots Not Guaranteed
                      </div>
                    )}
                    <div className="ticket-desc">
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.35rem', color: 'rgba(255,215,0,0.5)' }} />
                      Service fee may apply for online payments.
                    </div>
                    <div className="ticket-footer">
                      <button className="ticket-btn" disabled={soldOut} onClick={() => navigate('/checkout?type=student')}>
                        {soldOut ? 'Sold Out' : 'Buy PUPian Ticket'}
                      </button>
                    </div>
                  </div>
                )
              })()}

              {/* Non-PUPian Ticket */}
              {slots.public && (() => {
                const remaining = slots.public.total_slots - slots.public.sold_count
                const pct = (slots.public.sold_count / slots.public.total_slots) * 100
                const soldOut = remaining <= 0
                return (
                  <div className={`ticket-card featured ${soldOut ? 'sold-out' : ''}`}>
                    <div className="ticket-header">
                      <div className="ticket-type">Non-PUPian / Alumni</div>
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
                        {soldOut ? <><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.35rem', color: 'var(--red)' }} /> Sold Out</> : `${remaining} slots remaining`}
                      </div>
                    </div>
                    {!soldOut && (
                      <div className="ticket-snag">
                        <i className="fa-solid fa-bolt" />
                        Buy Now — Slots Not Guaranteed
                      </div>
                    )}
                    <div className="ticket-desc">
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.35rem', color: 'rgba(255,215,0,0.5)' }} />
                      Service fee may apply for online payments.
                    </div>
                    <div className="ticket-footer">
                      <button className="ticket-btn" disabled={soldOut} onClick={() => navigate('/checkout?type=public')}>
                        {soldOut ? 'Sold Out' : 'Buy Non-PUPian Ticket'}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Online Purchase Exclusive Perk */}
          <div className="perk-banner">
            <div className="perk-top">
              <div className="perk-label">Online Purchase Exclusive Perk</div>
              <div className="perk-badge">Free ₱500-Worth Membership Upgrade</div>
            </div>
            <div className="perk-title">Free Laking National Plus Membership</div>
            <div className="perk-sub">Book online and enjoy perks worth more than the ticket itself.</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="perk-list">
                <div className="perk-item">
                  <div className="perk-check"><i className="fa-solid fa-check" /></div>
                  Free cashback every time you shop
                </div>
                <div className="perk-item">
                  <div className="perk-check"><i className="fa-solid fa-check" /></div>
                  10% OFF on imported books
                </div>
                <div className="perk-item">
                  <div className="perk-check"><i className="fa-solid fa-check" /></div>
                  3% OFF on select school &amp; office supplies
                </div>
              </div>
              <img src="/lakingnational.png" alt="Laking National Plus" className="perk-logo" />
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ARTISTS */}
        <section className="section" id="artists">
          <div className="section-label">Performing Live</div>
          <h2 className="section-title">Artists & Lineup</h2>
          <div className="artists-grid">
            {ARTISTS.map((artist, i) => (
              <ArtistCard key={i} artist={artist} />
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* SPONSORS */}
        <section className="section" id="sponsors">
          <div className="section-label">SUPPORTED BY OUR</div>
          <h2 className="section-title">Sponsors & Partners</h2>
          <div className="sponsors-wrap">
            <img src="/sponsors.png" alt="Event Sponsors" className="sponsors-img" />
          </div>
        </section>

        <hr className="divider" />

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="section-label">Got Questions?</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-search-wrap">
            <i className="fa-solid fa-magnifying-glass faq-search-icon" />
            <input
              className="faq-search-input"
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(() => {
              const q = faqSearch.trim().toLowerCase()
              const results = q
                ? FAQ_ITEMS.filter(item =>
                    item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
                  )
                : FAQ_ITEMS
              if (results.length === 0) return (
                <div className="faq-no-results">No results found for "{faqSearch}".</div>
              )
              return results.map(({ q, a }) => (
                <details key={q} className="faq-item">
                  <summary className="faq-summary">
                    {q} <span className="faq-icon">+</span>
                  </summary>
                  <div className="faq-body">{a}</div>
                </details>
              ))
            })()}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-socials">
            <a href="https://www.facebook.com/pupcommsoc" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href="https://www.instagram.com/pupcommsoc_/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="https://x.com/pupcommsoc_" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X / Twitter">
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a href="http://tiktok.com/@pup_commsoc" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="TikTok">
              <i className="fa-brands fa-tiktok" />
            </a>
          </div>
          <p>© 2026 PUP REVO — PUP Communication Society. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>
            For concerns, email{' '}
            <a href="mailto:puprevo.commsoc@gmail.com" style={{ color: 'rgba(250,245,233,0.4)' }}>
              puprevo.commsoc@gmail.com
            </a>
          </p>
          <button className="footer-privacy-btn" onClick={() => setPrivacyOpen(true)}>
            Privacy Policy
          </button>
        </footer>

        {/* PRIVACY MODAL */}
        {privacyOpen && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPrivacyOpen(false) }}>
            <div className="modal">
              <h2>Privacy Policy</h2>
              <p className="modal-subtitle">PUP REVO 2026: Sound Against Silence - A Benefit Concert for Safer Kids</p>
              <p>The PUP Communication Society respects your right to privacy and is committed to protecting your personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).</p>

              <h3>1. Information We Collect</h3>
              <p>In the course of ticket registration and purchase, we may collect the following information:</p>
              <ul>
                <li>Full Name</li>
                <li>Contact Number</li>
                <li>Email Address</li>
                <li>Course/School (if applicable)</li>
                <li>Proof of Payment and transaction details</li>
                <li>Other information necessary for ticket verification and event coordination</li>
              </ul>

              <h3>2. Purpose of Collection</h3>
              <p>Your personal data is collected and processed solely for the following purposes:</p>
              <ul>
                <li>Ticket registration and verification</li>
                <li>Payment confirmation and validation</li>
                <li>Event coordination and participant management</li>
                <li>Issuance of event updates and important announcements</li>
                <li>Security and safety management during the event</li>
              </ul>
              <p>Your information will not be used for purposes unrelated to PUP REVO 2026.</p>

              <h3>3. Data Protection and Security</h3>
              <p>All collected information will be handled with strict confidentiality. Access to personal data is limited only to authorized members of the PUP Communication Society organizing team. We implement reasonable organizational and technical safeguards to protect your information against unauthorized access, disclosure, alteration, or misuse.</p>

              <h3>4. Data Sharing</h3>
              <p>Personal information will not be shared with unauthorized third parties. Data may only be disclosed when required by law or when necessary for event security, safety, and compliance with university policies.</p>

              <h3>5. Data Retention</h3>
              <p>Personal data will be retained only for as long as necessary for event implementation, documentation, and required post-event reporting. After such period, data will be securely deleted or disposed of.</p>

              <h3>6. Your Rights</h3>
              <p>Under the Data Privacy Act of 2012, you have the right to:</p>
              <ul>
                <li>Be informed about how your data is being processed</li>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Withdraw consent when applicable, subject to legal and contractual limitations</li>
              </ul>

              <h3>7. Consent</h3>
              <p>By registering and purchasing a ticket for PUP REVO 2026, you voluntarily consent to the collection, use, and processing of your personal data in accordance with this Privacy Policy. If you have questions or concerns regarding your personal data, you may contact the PUP Communication Society through its official communication channels.</p>

              <button className="modal-close" onClick={() => setPrivacyOpen(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
