// src/pages/Landing.jsx
// PUPREVO 2026 — Event Landing Page
// Fonts needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// Font Awesome needed in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState, useRef, useCallback } from 'react'
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

const FAQ_CATEGORIES = [
  {
    label: 'General',
    icon: 'fa-solid fa-circle-info',
    items: [
      { q: 'What is PUP REVO 2026?', a: 'PUP REVO 2026: Sound Against Silence is a day of OPM music, advocacy, and PUP pride organized by the PUP Communication Society. It is a fundraising event where proceeds go to ABS-CBN Foundation - Bantay Bata 163 and World Vision Philippines.' },
      { q: 'When and where is the event?', a: 'The event will be held on June 20, 2026, starting at 9:00 AM at the PUP Main Campus Oval, Manila.' },
      { q: 'Who can attend?', a: 'The event is open to PUP students, alumni, and the general public. There are two ticket tiers: a discounted rate for PUP students and a regular rate for public/alumni attendees.' },
      { q: 'Who are the beneficiaries of this event?', a: 'A portion of ticket sales will be donated to ABS-CBN Foundation - Bantay Bata 163 and World Vision Philippines — two organizations dedicated to the welfare and development of children and communities in need.' },
      { q: 'Is this event only for music performances?', a: 'No. PUP REVO 2026 is more than a concert — it is an advocacy-driven fundraising event that combines music, community, and collective action in support of safer spaces for kids.' },
      { q: 'How can I contact the organizers?', a: 'For any questions or concerns, email us at puprevo.commsoc@gmail.com. You can also reach us through the official PUP Communication Society social media pages.' },
      { q: 'Where can I stay updated about announcements and performer reveals?', a: 'Official announcements, performer lineups, ticket updates, and event reminders will be posted through the official PUP Communication Society social media pages.' },
    ],
  },
  {
    label: 'Registration & Tickets',
    icon: 'fa-solid fa-ticket',
    items: [
      { q: 'How do I get a ticket?', a: 'Click the "Get Your Tickets" button on this page or scroll down to the Tickets section. Choose your ticket type and complete the checkout process online.' },
      { q: 'Is there a deadline for purchasing tickets?', a: 'Tickets are available while slots last. We encourage you to purchase early as slots are limited and may sell out before the event date.' },
      { q: 'Are tickets refundable?', a: 'All ticket sales are final and non-refundable. For special concerns, please reach out to us on Facebook or via email at puprevo.commsoc@gmail.com.' },
      { q: 'Do I need to bring a physical ticket?', a: 'Your e-ticket or confirmation email serves as proof of purchase. However, a physical ticket is still required for event entry. You must claim your physical ticket at any of our designated onsite ticket selling/claiming booths prior to entering the venue. Please present your e-ticket (digital or printed) upon claiming.' },
      { q: 'I accidentally exited the tab and tried to register again, but it says my Student ID number is already registered.', a: 'Only one registration is allowed per Student ID number. If you accidentally exited the tab during registration, kindly email or message us your details, including your reference number, so we can either delete the incomplete registration from the database for you to register again or assist you in retrieving your ticket code and link. Even if you were unable to fully submit the form or were unsure if your registration went through, the system automatically saved your details in the database.' },
      { q: 'I selected Walk-in Payment, but I want to switch to GCash payment (or vice versa).', a: 'Kindly email or message us your details, including your reference number and full name. Your current registration will need to be deleted from the database first. Once your email or message has been acknowledged, you may register again using your preferred payment method.' },
      { q: 'The uploaded file says "inbound" and the actual file name is not showing.', a: 'That is completely okay as long as the uploaded file is not in PDF format. You may proceed to the next step.' },
      { q: 'I entered incorrect details during registration.', a: 'Kindly email or message us your details, including your reference number, so we can review and update your registration concern. Depending on the situation, your current registration may need to be deleted from the database for you to register again using the correct information. You might also receive an email regarding the incorrect detail(s). In this case, you will only need to send your updated detail(s) through the same email thread.' },
      { q: 'I did not receive a confirmation email and forgot to screenshot my details or proof.', a: 'Please note that the verification process may take around 1–3 days due to the volume of registrations. Kindly email or message us your details so we can check the status of your registration. Kindly check your spam or junk folder from time to time for possible updates regarding the confirmation of your registration.' },
      { q: 'I cannot personally claim my tickets on-site.', a: 'You may arrange a courier pick-up for your tickets instead. Kindly send us your courier details through our Facebook page, @PUPcommsoc. Please note that the delivery fee will be shouldered by the customer. Make sure to provide your PUP REVO code from the website and the full name of the ticket owner to the courier. A representative may also claim the tickets on your behalf as long as they can provide the reference code and a valid ID of the ticket owner. Tickets cannot be released on the day of the event itself as we are trying to ensure a smooth claiming process and avoid delays or long lines during the event day.' },
    ],
  },
  {
    label: 'On-Site & Event Day',
    icon: 'fa-solid fa-calendar-day',
    items: [
      { q: 'What time do gates open?', a: 'Gates open at 8:00 AM for the fall-in line. Early attendees will have the opportunity to witness the live soundcheck. We encourage everyone to arrive early to avoid long lines and enjoy the full REVO experience.' },
      { q: 'Can I leave and re-enter the venue?', a: 'Re-entry policies will be announced closer to the event date. Please stay updated through the official PUP Communication Society social media pages for guidelines.' },
      { q: 'Are outside food and drinks allowed?', a: 'Outside food and drinks may be subject to venue regulations and security policies. Official announcements regarding allowed and prohibited items will be posted before the event.' },
      { q: 'Is there a dress code?', a: 'There is no strict dress code, but attendees are encouraged to wear comfortable and event-appropriate clothing. Come dressed for a full-day concert experience!' },
      { q: 'Will there be food booths and concessionaires?', a: 'Yes! Food and beverage booths, partner booths, and sponsor activations will be available during the event for attendees to enjoy.' },
      { q: 'Will there be security and medical personnel on-site?', a: 'Yes. Security personnel, event marshals, and medical responders will be present throughout the event to help ensure everyone\'s safety and well-being.' },
      { q: 'What should I do if I lose something during the event?', a: 'A designated help desk/lost and found area will be available at the venue. Announcements may also be made during the event for recovered items.' },
      { q: 'What happens if it rains?', a: 'PUP REVO 2026 will continue rain or shine unless safety concerns require further announcements from the organizers. Attendees are encouraged to prepare accordingly.' },
      { q: 'Will merchandise be available during the event?', a: 'Official PUP REVO 2026 merchandise are available through pre-orders. Stay tuned for official announcements regarding merch releases and claiming schedules.' },
    ],
  },
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
  { name: 'SUD', tag: 'Performing Live', image: '/artist2.png' },
  { name: 'SOAPDISH', tag: 'Performing Live', image: '/artist3.png' },
  { name: 'QUEST', tag: 'Performing Live', image: '/artist4.png' },
  { name: 'FRANK ELY', tag: 'Performing Live', image: '/artist5.png' },
  { name: 'IAN QUIRUZ', tag: 'Performing Live', image: '/artist6.png' },
  { name: 'JULIA DANIEL', tag: 'Performing Live', image: '/artist7.png' },
  { name: 'SHANNE DANDAN', tag: 'Performing Live', image: '/artist8.png' },
  { name: 'LEILA', tag: 'Performing Live', image: '/artist9.png' },
  { name: 'BRANDO BAL', tag: 'Performing Live', image: '/artist10.png' },
  { name: 'BITA AND THE BOTFLIES', tag: 'Performing Live', image: '/artist11.png' },
  { name: 'THE SUN', tag: 'Performing Live', image: '/artist12.png' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { d, h, m, s } = useCountdown(EVENT_DATE)
  const [slots, setSlots] = useState({ student: null, public: null })
  const [loading, setLoading] = useState(true)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [faqSearch, setFaqSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [faqTab, setFaqTab] = useState(0)
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [calOpen, setCalOpen] = useState(false)
  const [navHeight, setNavHeight] = useState(56)
  const [toastVisible, setToastVisible] = useState(true)
  const navRef = useRef(null)
  const revealRefs = useRef([])

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

  // Sticky nav + scroll-to-top + active section + nav height measurement
  useEffect(() => {
    const SECTIONS = ['details', 'tickets', 'artists', 'sponsors', 'faq']
    const measureNav = () => {
      if (navRef.current) setNavHeight(navRef.current.getBoundingClientRect().height)
    }
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60)
      setShowScrollTop(window.scrollY > 400)
      measureNav()
      let current = ''
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) current = id
      }
      setActiveSection(current)
    }
    measureNav()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measureNav)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measureNav)
    }
  }, [])

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  const addReveal = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleShare = () => {
    navigator.clipboard.writeText('https://puprevo2026.me').then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  const pad = n => String(n ?? 0).padStart(2, '0')

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          width: 100%; max-width: 100%; overflow-x: hidden;
          background: var(--dark); border: none; outline: none;
          margin: 0; padding: 0;
        }

        :root {
          --red: #FF3B30;
          --gold: #FFD700;
          --blue: #1A4FD6;
          --cream: #FAF5E9;
          --dark: #060D1F;
          --card-bg: #0D1530;
        }

        /* ---- STICKY NAV ---- */
        .sticky-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 900;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 2rem;
          transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s, box-shadow 0.3s;
          border-bottom: 1px solid transparent;
        }
        .sticky-nav.nav-scrolled {
          background: rgba(6,13,31,0.88);
          backdrop-filter: blur(14px);
          border-color: rgba(255,255,255,0.07);
          box-shadow: 0 2px 24px rgba(0,0,0,0.4);
        }
        .nav-logo {
          cursor: pointer; display: flex; align-items: center;
        }
        .nav-logo img { height: 36px; width: auto; object-fit: contain; }
        .nav-links {
          display: flex; align-items: center; gap: 2rem;
          list-style: none;
        }
        @media(max-width: 640px) { .nav-links { display: none; } }
        .nav-link {
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(250,245,233,0.5); cursor: pointer;
          transition: color 0.15s; border: none; background: none; padding: 0;
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active { color: var(--cream); }
        .nav-link.active { color: var(--gold); }
        .nav-cta {
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: var(--gold); color: #000; border: none;
          padding: 0.5rem 1.2rem; border-radius: 4px; cursor: pointer;
          transition: opacity 0.15s;
        }
        .nav-cta:hover { opacity: 0.85; }

        /* ---- TICKER BANNER ---- */
        .ticker-wrap {
          position: fixed; left: 0; right: 0; z-index: 899;
          background: var(--red);
          overflow: hidden; white-space: nowrap;
          height: 30px; display: flex; align-items: center;
        }
        .ticker-track {
          display: inline-flex; align-items: center;
          animation: ticker-scroll 35s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover { animation-play-state: paused; }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-item {
          font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: #fff;
          padding: 0 2rem; display: inline-flex; align-items: center; gap: 0.6rem;
        }
        .ticker-sep {
          color: rgba(255,255,255,0.4); font-size: 0.55rem;
        }

        /* ---- SCROLL REVEAL ---- */
        .reveal {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .reveal-visible { opacity: 1; transform: translateY(0); }

        /* ---- SCROLL TO TOP ---- */
        .scroll-top-btn {
          position: fixed; bottom: 2rem; right: 2rem; z-index: 800;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.35);
          color: var(--gold); font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: opacity 0.3s, transform 0.3s, background 0.2s;
          opacity: 0; pointer-events: none;
        }
        .scroll-top-btn.visible { opacity: 1; pointer-events: auto; }
        .scroll-top-btn:hover { background: rgba(255,215,0,0.25); transform: translateY(-3px); }

        /* ---- SHARE MODAL ---- */
        .share-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }
        .share-modal {
          background: #0D1530; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; max-width: 420px; width: 100%; padding: 2rem;
          text-align: center;
        }
        .share-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
          letter-spacing: 0.08em; color: var(--cream); margin-bottom: 0.4rem;
        }
        .share-sub {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          color: rgba(250,245,233,0.45); margin-bottom: 1.5rem;
        }
        .share-buttons { display: flex; flex-direction: column; gap: 0.75rem; }
        .share-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.65rem;
          font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.85rem 1rem; border-radius: 8px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1); text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }
        .share-btn:hover { opacity: 0.85; transform: scale(0.99); }
        .share-btn-fb { background: #1877f2; color: #fff; border-color: #1877f2; }
        .share-btn-tw { background: #000; color: #fff; border-color: #333; }
        .share-btn-copy { background: rgba(255,215,0,0.1); color: var(--gold); border-color: rgba(255,215,0,0.3); }
        .share-btn-close {
          margin-top: 1rem; background: none; color: rgba(250,245,233,0.35);
          border: none; font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          cursor: pointer; text-decoration: underline;
        }

        /* ---- CALENDAR MODAL ---- */
        .cal-modal {
          background: #0D1530; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; max-width: 400px; width: 100%; padding: 2rem;
          text-align: center;
        }
        .cal-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
          letter-spacing: 0.08em; color: var(--cream); margin-bottom: 0.4rem;
        }
        .cal-sub {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          color: rgba(250,245,233,0.45); margin-bottom: 1.5rem;
        }
        .cal-buttons { display: flex; flex-direction: column; gap: 0.75rem; }
        .cal-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.65rem;
          font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.85rem 1rem; border-radius: 8px; cursor: pointer;
          text-decoration: none; transition: opacity 0.15s;
          border: 1px solid rgba(255,255,255,0.1); color: var(--cream);
        }
        .cal-btn-google { background: rgba(66,133,244,0.15); border-color: rgba(66,133,244,0.4); color: #6fa3f7; }
        .cal-btn-ical { background: rgba(255,59,48,0.1); border-color: rgba(255,59,48,0.3); color: var(--red); }
        .cal-btn-outlook { background: rgba(0,120,212,0.1); border-color: rgba(0,120,212,0.3); color: #4ea6e8; }
        .cal-btn:hover { opacity: 0.8; }
        .cal-btn-close {
          margin-top: 1rem; background: none; color: rgba(250,245,233,0.35);
          border: none; font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          cursor: pointer; text-decoration: underline;
        }

        body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        .page { min-height: 100vh; position: relative; }

        /* ---- HERO ---- */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 1rem 2rem 2rem;
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
          padding: 0.4rem 1.2rem; border-radius: 2rem; margin-bottom: 1.25rem;
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
        .cta-row-secondary { display: flex; gap: 1rem; }
        .btn-primary {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.05em; text-transform: uppercase;
          background: var(--gold); color: #000; border: none;
          padding: 1rem 2.5rem; border-radius: 4px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 30px rgba(255,215,0,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(255,215,0,0.55); }
        @media (max-width: 640px) {
          .cta-group { flex-direction: column; align-items: stretch; width: 100%; max-width: 420px; margin: 0 auto; }
          .btn-primary { width: 100%; }
          .cta-row-secondary { display: flex; gap: 1rem; width: 100%; }
          .cta-row-secondary .btn-secondary:first-child { flex: 1; }
          .cta-row-secondary .btn-secondary.icon-btn { width: 56px; flex-shrink: 0; }
        }
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
        .ticket-card::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255,59,48,0.06) 0%, transparent 55%);
          border-radius: 12px;
        }
        .ticket-card > * { position: relative; z-index: 1; }
        .ticket-card:hover { transform: translateY(-4px); border-color: rgba(255,59,48,0.4); }
        .ticket-card.featured { border-color: rgba(255,215,0,0.3); }
        .ticket-card.featured::before {
          background: radial-gradient(circle at 80% 20%, rgba(255,215,0,0.07) 0%, transparent 55%);
        }
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
        .price-discount-badge { display: inline-block; font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); padding: 0.2rem 0.55rem; border-radius: 2rem; margin-left: 0.5rem; vertical-align: middle; }
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
        .faq-tabs {
          display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
        }
        .faq-tab {
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 0.45rem 1rem;
          color: rgba(250,245,233,0.5); cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .faq-tab:hover { color: var(--cream); border-color: rgba(255,255,255,0.25); }
        .faq-tab.active {
          background: rgba(255,59,48,0.12); border-color: rgba(255,59,48,0.4);
          color: var(--cream);
        }
        .faq-item {
          background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; overflow: hidden; transition: border-color 0.2s;
          cursor: pointer;
        }
        .faq-item.faq-open { border-color: rgba(255,59,48,0.35); }
        .faq-summary {
          font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700;
          color: var(--cream); padding: 1.2rem 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left; user-select: none;
        }
        .faq-icon { color: var(--red); flex-shrink: 0; font-size: 1.2rem; }
        .faq-body {
          padding: 0.8rem 1.5rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.05);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: rgba(250,245,233,0.65); line-height: 1.7; text-align: left;
        }
        .faq-search-wrap {
          position: relative; margin-bottom: 1.25rem;
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
          font-family: 'DM Sans', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: var(--dark);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .footer-main {
          display: grid;
          grid-template-columns: 220px repeat(3, 1fr);
          gap: 2.5rem;
          padding: 3rem 3rem 2.5rem;
          max-width: 1200px; margin: 0 auto;
        }
        @media (max-width: 900px) {
          .footer-main { grid-template-columns: 1fr 1fr; padding: 2rem 1.5rem; }
        }
        @media (max-width: 520px) {
          .footer-main { grid-template-columns: 1fr; }
        }
        .footer-brand { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
        .footer-logo img { height: 96px; width: auto; object-fit: contain; }
        .footer-tagline {
          font-size: 0.78rem; color: rgba(250,245,233,0.35); line-height: 1.65;
          text-align: left;
        }
        .footer-socials {
          display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.25rem;
        }
        .footer-social-link {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(250,245,233,0.45); font-size: 0.85rem;
          text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .footer-social-link:hover { border-color: var(--gold); color: var(--gold); background: rgba(255,215,0,0.07); }
        .footer-col {}
        .footer-col-title {
          font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--cream); margin-bottom: 1rem;
          text-align: left;
        }
        .footer-col-links {
          display: flex; flex-direction: column; gap: 0.6rem; list-style: none;
          align-items: flex-start;
        }
        .footer-col-links li {}
        .footer-col-links a,
        .footer-col-links button {
          font-size: 0.82rem; color: rgba(250,245,233,0.42);
          text-decoration: none; background: none; border: none;
          cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif;
          transition: color 0.15s; text-align: left;
        }
        .footer-col-links a:hover,
        .footer-col-links button:hover { color: var(--cream); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 1rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1200px; margin: 0 auto; flex-wrap: wrap; gap: 1rem;
        }
        @media (max-width: 640px) {
          .footer-bottom { padding: 1rem 1.5rem; flex-direction: column; align-items: center; }
        }
        .footer-copy {
          font-size: 0.73rem; color: rgba(250,245,233,0.22); white-space: nowrap;
        }
        @media (max-width: 640px) {
          .footer-copy { font-size: 0.6rem; text-align: center; white-space: normal; }
        }
        .footer-bottom-links {
          display: flex; gap: 1.5rem; list-style: none; flex-wrap: wrap;
        }
        .footer-bottom-links button {
          font-size: 0.73rem; color: rgba(250,245,233,0.3);
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; padding: 0;
          transition: color 0.15s;
        }
        .footer-bottom-links button:hover { color: rgba(250,245,233,0.7); }

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
        .sold-out-social-link { pointer-events: auto !important; }

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
        .perk-check {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: rgba(74,222,128,0.15); border: 1px solid rgba(74,222,128,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #4ade80; font-size: 0.65rem;
        }

        @media (max-width: 600px) {
          .countdown { gap: 0.75rem; }
          .countdown-num { min-width: 60px; padding: 0.3rem 0.6rem; }
        }

        /* ---- ANNOUNCEMENT TOAST ---- */
        .toast-overlay {
          position: fixed; inset: 0; z-index: 950;
          background: rgba(6,13,31,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: toastFadeIn 0.4s ease both;
        }
        @keyframes toastFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .toast-announcement {
          width: 100%; max-width: 420px;
          background: #0D1530;
          border: 1px solid rgba(255,215,0,0.35);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,215,0,0.08);
          animation: toastPopIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
          position: relative;
        }
        .toast-header {
          background: #070e22;
          padding: 1.25rem 1.5rem 1rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          border-bottom: 1px solid rgba(255,215,0,0.15);
        }
        .toast-body {
          padding: 1.25rem 1.5rem 1.5rem;
          text-align: center;
        }
        @keyframes toastPopIn {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .toast-icon {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,215,0,0.12); border: 1px solid rgba(255,215,0,0.25);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); font-size: 0.95rem;
        }
        .toast-label {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); opacity: 0.8;
        }
        .toast-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
          letter-spacing: 0.06em; color: var(--cream);
          margin-bottom: 0.75rem; line-height: 1.2;
        }
        .toast-msg {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          color: rgba(250,245,233,0.6); line-height: 1.75;
        }
        .toast-close {
          position: absolute; top: 0.85rem; right: 1rem;
          background: none; border: none; cursor: pointer;
          color: rgba(250,245,233,0.3); font-size: 1.1rem; line-height: 1;
          padding: 0.1rem; transition: color 0.15s;
        }
        .toast-close:hover { color: rgba(250,245,233,0.7); }
        .toast-dismiss {
          margin-top: 1.25rem;
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: var(--gold); color: #000;
          border: none;
          padding: 0.7rem 2.5rem; border-radius: 4px; cursor: pointer;
          transition: opacity 0.15s;
        }
        .toast-dismiss:hover { opacity: 0.88; }
      `}</style>

      <div className="page" style={{ paddingTop: (navHeight + 30) + 'px' }}>

        {/* STICKY NAV */}
        <nav ref={navRef} className={`sticky-nav${navScrolled ? ' nav-scrolled' : ''}`}>
          <span className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="PUP REVO 2026" />
          </span>
          <ul className="nav-links">
            {[
              { label: 'Details', id: 'details' },
              { label: 'Tickets', id: 'tickets' },
              { label: 'Artists', id: 'artists' },
              { label: 'Sponsors', id: 'sponsors' },
              { label: 'FAQ', id: 'faq' },
            ].map(({ label, id }) => (
              <li key={id}>
                <button
                  className={`nav-link${activeSection === id ? ' active' : ''}`}
                  onClick={() => scrollTo(id)}
                >{label}</button>
              </li>
            ))}
            <li>
              <a
                className="nav-link"
                href="https://puprevo2026.me/contact"
              >Contact</a>
            </li>
          </ul>
          <button className="nav-cta" onClick={() => scrollTo('tickets')}>Buy Tickets</button>
        </nav>

        {/* TICKER BANNER */}
        <div className="ticker-wrap" style={{ top: navHeight + 'px' }} aria-label="Ticket announcement">
          <div className="ticker-track">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span className="ticker-item"><i className="fa-solid fa-ticket" /> Limited tickets available — Buy now until May 31 only. Sorry for the technical errors. Huhu... It is now resolved! Thank you for your patience. :) | Bukas na po namin replyan concerns, pahinga lang po kami hehe loveuall </span>
                <span className="ticker-sep">✦</span>
                <span className="ticker-item"><i className="fa-solid fa-fire" /> Slots are running out — Buy your tickets today. GCash Payment is working totally fine. Hehe. XD. </span>
                <span className="ticker-sep">✦</span>
                <span className="ticker-item"><i className="fa-solid fa-clock" /> Onsite ticket selling tomorrow, May 29, 2026, is canceled due to the heat index. See you on May 30 at Lunan for onsite ticket selling! | Last Day of Ticket Selling: May 31 · Don't miss out.</span>
                <span className="ticker-sep">✦</span>
                <span className="ticker-item"><i className="fa-solid fa-star" /> PUP REVO 2026 · June 20 · PUP Main Campus Oval</span>
                <span className="ticker-sep">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* SCROLL TO TOP */}
        <button
          className={`scroll-top-btn${showScrollTop ? ' visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <i className="fa-solid fa-chevron-up" />
        </button>


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
            <img src="/pupxpupcommsoc.png" alt="PUP x PUP CommSoc" style={{ width: '160px', display: 'block', margin: '0 auto 0.5rem auto' }} />
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
                Buy Tickets
              </button>
              <div className="cta-row-secondary">
                <button className="btn-secondary" onClick={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}>
                  Event Details
                </button>
                <button className="btn-secondary icon-btn" onClick={() => setCalOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', padding: '1rem', flexShrink: 0 }} title="Add to Calendar">
                  <i className="fa-regular fa-calendar-plus" />
                </button>
                <button className="btn-secondary icon-btn" onClick={() => setShareOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', padding: '1rem', flexShrink: 0 }} title="Share Event">
                  <i className="fa-solid fa-share-nodes" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* EVENT DETAILS */}
        <section className="section reveal" ref={addReveal} id="details">
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
            <div id="beneficiaries" className="detail-item bene-card">
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
        <section className="section reveal" ref={addReveal} id="tickets">
          <div className="section-label">Buy Now</div>
          <h2 className="section-title">Get Your Tickets</h2>

          {/* Urgency strip */}
          <div className="tickets-urgency">
            <span className="urgency-dot">Very Limited Tickets Only</span>
            <span className="urgency-wave-pill">
              ENDS SOON <span className="urgency-wave-sep">·</span> UNTIL MAY 31 ONLY
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
                        Buy now to secure your slot.
                      </div>
                    )}
                    {soldOut && (
                      <div style={{
                        margin: '0 1.5rem 0.75rem', padding: '1rem 1.25rem',
                        background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.25)',
                        borderRadius: '8px', textAlign: 'center',
                      }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                          Aray ko, naubusan ng tickets!
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(250,245,233,0.55)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                          A benefit concert this big doesn't come to PUP often and everyone knew it. The next wave is coming, and it will go just as fast.
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(250,245,233,0.55)', lineHeight: 1.7, marginBottom: '0.85rem' }}>
                          Follow our socials. When it drops, don't think twice.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <a href="https://www.facebook.com/pupcommsoc" target="_blank" rel="noopener noreferrer" className="sold-out-social-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1877f2', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.45rem 0.9rem', borderRadius: '4px', textDecoration: 'none' }}>
                            <i className="fa-brands fa-facebook-f" /> Facebook
                          </a>
                          <a href="https://www.instagram.com/pupcommsoc_/" target="_blank" rel="noopener noreferrer" className="sold-out-social-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c13584', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.45rem 0.9rem', borderRadius: '4px', textDecoration: 'none' }}>
                            <i className="fa-brands fa-instagram" /> Instagram
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="ticket-desc">
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.35rem', color: 'rgba(255,215,0,0.5)' }} />
                      Service fee may apply for online payments.
                    </div>
                    <div className="ticket-footer">
                      <button className="ticket-btn" disabled={soldOut} onClick={() => navigate('/checkout?type=student')} style={soldOut ? { background: 'var(--red)', color: '#fff', cursor: 'not-allowed' } : {}}>
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
                        Buy now to secure your slot.
                      </div>
                    )}
                    {soldOut && (
                      <div style={{
                        margin: '0 1.5rem 0.75rem', padding: '1rem 1.25rem',
                        background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.25)',
                        borderRadius: '8px', textAlign: 'center',
                      }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.06em', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                          Aray ko, naubusan ng tickets!
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(250,245,233,0.55)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                          A benefit concert this big doesn't come to PUP often and everyone knew it. The next wave is coming, and it will go just as fast.
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(250,245,233,0.55)', lineHeight: 1.7, marginBottom: '0.85rem' }}>
                          Follow our socials. When it drops, don't think twice.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <a href="https://www.facebook.com/pupcommsoc" target="_blank" rel="noopener noreferrer" className="sold-out-social-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1877f2', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.45rem 0.9rem', borderRadius: '4px', textDecoration: 'none' }}>
                            <i className="fa-brands fa-facebook-f" /> Facebook
                          </a>
                          <a href="https://www.instagram.com/pupcommsoc_/" target="_blank" rel="noopener noreferrer" className="sold-out-social-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c13584', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.45rem 0.9rem', borderRadius: '4px', textDecoration: 'none' }}>
                            <i className="fa-brands fa-instagram" /> Instagram
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="ticket-desc">
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.35rem', color: 'rgba(255,215,0,0.5)' }} />
                      Service fee may apply for online payments.
                    </div>
                    <div className="ticket-footer">
                      <button className="ticket-btn" disabled={soldOut} onClick={() => navigate('/checkout?type=public')} style={soldOut ? { background: 'var(--red)', color: '#fff', cursor: 'not-allowed' } : {}}>
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
        <section className="section reveal" ref={addReveal} id="artists">
          <div className="section-label">Performing Live</div>
          <h2 className="section-title">Artists & Lineup</h2>
          <div className="artists-grid">
            {ARTISTS.map((artist, i) => (
              <ArtistCard key={i} artist={artist} />
            ))}
          </div>

          {/* OFFICIAL PLAYLIST */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Listen Now</div>
            <h3 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
              letterSpacing: '0.06em',
              color: 'var(--cream)',
              marginBottom: '1.25rem',
            }}>
              Official Playlist
            </h3>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/6FmEQclu5G50ylZewMDyEO?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* SPONSORS */}
        <section className="section reveal" ref={addReveal} id="sponsors">
          <div className="section-label">SUPPORTED BY OUR</div>
          <h2 className="section-title">Sponsors & Partners</h2>
          <div className="sponsors-wrap">
            <img src="/sponsors.png" alt="Event Sponsors" className="sponsors-img" />
          </div>
        </section>

        <hr className="divider" />

        {/* FAQ */}
        <section className="section reveal" ref={addReveal} id="faq">
          <div className="section-label">Got Questions?</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-search-wrap">
            <i className="fa-solid fa-magnifying-glass faq-search-icon" />
            <input
              className="faq-search-input"
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={e => { setFaqSearch(e.target.value); setOpenFaq(null) }}
            />
          </div>
          {!faqSearch.trim() && (
            <div className="faq-tabs">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  className={`faq-tab${faqTab === i ? ' active' : ''}`}
                  onClick={() => { setFaqTab(i); setOpenFaq(null) }}
                >
                  <i className={cat.icon} />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(() => {
              const q = faqSearch.trim().toLowerCase()
              const results = q
                ? FAQ_CATEGORIES.flatMap(cat => cat.items).filter(item =>
                    item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
                  )
                : FAQ_CATEGORIES[faqTab].items
              if (results.length === 0) return (
                <div className="faq-no-results">No results found for "{faqSearch}".</div>
              )
              return results.map(({ q, a }) => {
                const isOpen = openFaq === q
                return (
                  <div
                    key={q}
                    className={`faq-item${isOpen ? ' faq-open' : ''}`}
                    onClick={() => setOpenFaq(isOpen ? null : q)}
                  >
                    <div className="faq-summary">
                      {q} <span className="faq-icon">{isOpen ? '×' : '+'}</span>
                    </div>
                    {isOpen && <div className="faq-body">{a}</div>}
                  </div>
                )
              })
            })()}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-main">

            {/* Brand column */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/logo.png" alt="PUP REVO 2026" />
              </div>

            </div>

            {/* About Us */}
            <div className="footer-col">
              <div className="footer-col-title">About Us</div>
              <ul className="footer-col-links">
                <li><button onClick={() => scrollTo('details')}>Event Details</button></li>
                <li><button onClick={() => scrollTo('beneficiaries')}>Beneficiaries</button></li>
                <li><button onClick={() => scrollTo('artists')}>Artists &amp; Lineup</button></li>
                <li><button onClick={() => scrollTo('sponsors')}>Sponsors &amp; Partners</button></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="footer-col">
              <div className="footer-col-title">Customer Care</div>
              <ul className="footer-col-links">
                <li><a href="https://puprevo2026.me/contact">Contact Us</a></li>
                <li><button onClick={() => scrollTo('faq')}>FAQs</button></li>
                <li><button onClick={() => scrollTo('tickets')}>Buy Tickets</button></li>
                <li><a href="/news">News &amp; Media Release</a></li>
              </ul>
            </div>

            {/* Terms & Conditions */}
            <div className="footer-col">
              <div className="footer-col-title">Terms &amp; Conditions</div>
              <ul className="footer-col-links">
                <li><button onClick={() => setPrivacyOpen(true)}>Privacy Policy</button></li>
                <li><button onClick={() => setTermsOpen(true)}>Terms of Use</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 PUP REVO — PUP Communication Society. All Rights Reserved.</p>
            <div className="footer-socials" style={{ marginTop: 0 }}>
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
          </div>
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

        {/* TERMS OF USE MODAL */}
        {termsOpen && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setTermsOpen(false) }}>
            <div className="modal">
              <h2>Terms of Use</h2>
              <p className="modal-subtitle">PUP REVO 2026: Sound Against Silence — Effective Date: January 2026</p>
              <p>By accessing this website and purchasing tickets to PUP REVO 2026, you agree to be bound by the following Terms of Use. Please read them carefully before proceeding.</p>

              <h3>1. General</h3>
              <p>This website is operated by the PUP Communication Society for the purpose of providing event information and facilitating ticket purchases for PUP REVO 2026: Sound Against Silence, a benefit concert organized in support of ABS-CBN Foundation – Bantay Bata 163 and World Vision Philippines. By using this site, you confirm that you are at least 13 years of age and agree to these terms.</p>

              <h3>2. Ticket Purchase</h3>
              <p>All ticket purchases are subject to availability. By completing a purchase, you agree to provide accurate and truthful personal information. Each ticket is valid for one (1) person only and is non-transferable unless expressly permitted by the organizers. Physical ticket claiming is required prior to event entry and must be done at designated booths upon presentation of your e-ticket or proof of purchase.</p>

              <h3>3. No Refund Policy</h3>
              <p>All sales are final. Tickets are non-refundable and non-exchangeable under any circumstances except as required by applicable law. In the unlikely event of event cancellation or major schedule change, the organizers will communicate the appropriate course of action through official channels.</p>

              <h3>4. Event Rules & Conduct</h3>
              <p>Attendees are expected to observe proper conduct throughout the event. The organizers reserve the right to refuse admission or remove any attendee who violates event rules, poses a safety risk, or engages in disruptive behavior — without entitlement to a refund. Outside food, drinks, and items prohibited by venue regulations may be confiscated at the gate.</p>

              <h3>5. Intellectual Property</h3>
              <p>All content on this website — including but not limited to the event name, logo, poster, artist materials, and written content — is the property of the PUP Communication Society or its respective rights holders. Unauthorized reproduction, distribution, or commercial use is prohibited.</p>

              <h3>6. Limitation of Liability</h3>
              <p>The PUP Communication Society and its organizing members shall not be held liable for any loss, injury, or damage incurred during the event, unless caused by gross negligence on the part of the organizers. Attendees participate at their own risk and are encouraged to take reasonable personal precautions.</p>

              <h3>7. Force Majeure</h3>
              <p>The organizers shall not be held liable for failure to fulfill obligations due to circumstances beyond their reasonable control, including but not limited to natural disasters, government directives, public health emergencies, or acts of God. In such cases, updates will be communicated through official PUP Communication Society social media pages.</p>

              <h3>8. Privacy</h3>
              <p>Your personal data is handled in accordance with our Privacy Policy and the Data Privacy Act of 2012 (R.A. 10173). By using this site and purchasing a ticket, you consent to the collection and processing of your information as described in our Privacy Policy.</p>

              <h3>9. Amendments</h3>
              <p>The PUP Communication Society reserves the right to update or modify these Terms of Use at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the revised terms. It is your responsibility to review this page periodically.</p>

              <h3>10. Contact</h3>
              <p>For questions or concerns regarding these Terms of Use, please reach out to us at <a href="mailto:puprevo.commsoc@gmail.com" style={{ color: 'var(--gold)' }}>puprevo.commsoc@gmail.com</a> or through the official PUP Communication Society social media pages.</p>

              <button className="modal-close" onClick={() => setTermsOpen(false)}>Close</button>
            </div>
          </div>
        )}
        {/* ANNOUNCEMENT TOAST */}
        {toastVisible && (
          <div className="toast-overlay" onClick={e => { if (e.target === e.currentTarget) setToastVisible(false) }}>
            <div className="toast-announcement">
              <button className="toast-close" onClick={() => setToastVisible(false)} aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
              {/* Header — darker bg with icon + label */}
              <div className="toast-header">
                <div className="toast-icon">
                  <i className="fa-solid fa-bullhorn" />
                </div>
                <div className="toast-label">Announcement</div>
              </div>
              {/* Body */}
              <div className="toast-body">
                <div className="toast-title">Psst... Takits tomorrow (May 30) at LUNAN for onsite ticket selling and physical ticket claiming.</div>
                <div className="toast-msg">
                  Mainit pa rin, bes, kaya magdala ng tubig at pamaypay. Pero don't worry, may <strong style={{color:'var(--cream)'}}>free Cobra Rise at Chatlet</strong> naman.
                  <br /><br />
                  <strong style={{color:'var(--cream)'}}>Ticket selling ends on May 31.</strong> Buy your tickets now habang may slots pa!
                  <br /><br />
                  Ano, tara? <em>(Hehe, binabasa niyo ba 'to?)</em>
                </div>
                <button className="toast-dismiss" onClick={() => { setToastVisible(false); scrollTo('tickets') }}>
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        )}

        {shareOpen && (
          <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShareOpen(false) }}>
            <div className="share-modal">
              <div className="share-title">Share the Event</div>
              <div className="share-sub">Spread the word — every share helps the cause.</div>
              <div className="share-buttons">
                <a
                  className="share-btn share-btn-fb"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpuprevo2026.me"
                  target="_blank" rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook-f" /> Share on Facebook
                </a>
                <a
                  className="share-btn share-btn-tw"
                  href="https://twitter.com/intent/tweet?text=PUP%20REVO%202026%3A%20Sound%20Against%20Silence%20%E2%80%94%20A%20Benefit%20Concert%20for%20Safer%20Kids%20%F0%9F%8E%B5%20June%2020%2C%202026%20at%20PUP%20Main%20Campus%20Oval%2C%20Manila.%20Get%20your%20tickets%20now!&url=https%3A%2F%2Fpuprevo2026.me"
                  target="_blank" rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-x-twitter" /> Share on X / Twitter
                </a>
                <button className="share-btn share-btn-copy" onClick={handleShare}>
                  <i className={`fa-solid ${shareCopied ? 'fa-check' : 'fa-link'}`} />
                  {shareCopied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
              <button className="share-btn-close" onClick={() => setShareOpen(false)}>Close</button>
            </div>
          </div>
        )}

        {/* ADD TO CALENDAR MODAL */}
        {calOpen && (() => {
          const title = encodeURIComponent('PUP REVO 2026: Sound Against Silence')
          const details = encodeURIComponent('A Benefit Concert for Safer Kids. Organized by PUP Communication Society.')
          const location = encodeURIComponent('PUP Main Campus Oval, Manila')
          const start = '20260620T010000Z' // 9AM PHT = 1AM UTC
          const end = '20260620T110000Z'   // 7PM PHT = 11AM UTC
          const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
          const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:PUP REVO 2026: Sound Against Silence\nDTSTART:${start}\nDTEND:${end}\nDESCRIPTION:A Benefit Concert for Safer Kids\nLOCATION:PUP Main Campus Oval, Manila\nEND:VEVENT\nEND:VCALENDAR`
          const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`
          const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=2026-06-20T09:00:00&enddt=2026-06-20T19:00:00&location=${location}&body=${details}`
          return (
            <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setCalOpen(false) }}>
              <div className="cal-modal">
                <div className="cal-title">Add to Calendar</div>
                <div className="cal-sub">June 20, 2026 · 9:00 AM · PUP Main Campus Oval</div>
                <div className="cal-buttons">
                  <a className="cal-btn cal-btn-google" href={googleUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-google" /> Google Calendar
                  </a>
                  <a className="cal-btn cal-btn-ical" href={icsUrl} download="puprevo2026.ics">
                    <i className="fa-solid fa-apple-whole" /> Apple Calendar (.ics)
                  </a>
                  <a className="cal-btn cal-btn-outlook" href={outlookUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-envelope" /> Outlook
                  </a>
                </div>
                <button className="cal-btn-close" onClick={() => setCalOpen(false)}>Close</button>
              </div>
            </div>
          )
        })()}

      </div>
    </>
  )
}
