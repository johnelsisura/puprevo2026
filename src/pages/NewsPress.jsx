// src/pages/NewsPress.jsx
// PUPREVO 2026 — News & Press Release Page
// Requires same fonts/FA as Landing.jsx in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

if (!document.querySelector('link[href*="font-awesome"]')) {
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  document.head.appendChild(fa)
}

// ── Sample press releases / news items ─────────────────────────────────────
// Replace or fetch from Supabase as needed
const NEWS_ITEMS = [
  {
    id: 6,
    type: 'Press Release',
    date: 'May 28, 2026',
    headline: 'PUP REVO 2026 Returns in Benefit of Bantay Bata 163 and World Vision Philippines',
    excerpt:
      'After a six-year hiatus, the PUP Communication Society brings back its flagship advocacy event on June 20, 2026, at the PUP Main Campus Oval, rallying students and the public around child protection advocacy.',
    image: '/PR1.png',
    body: `Manila, Philippines — After six years, PUP REVO returns — and this time, its stage is set for the children. The Polytechnic University of the Philippines Communication Society (PUP CommSoc) is mounting PUP REVO 2026, one of the university's largest post-pandemic benefit concerts, with proceeds going directly to child protection programs run by ABS-CBN Foundation Bantay Bata 163 and World Vision Philippines.

A student-led initiative continuing PUP CommSoc's tradition of using creative platforms for grassroots advocacy, PUP REVO 2026 arrives at a critical moment. Across the Philippines, many children remain vulnerable to abuse, exploitation, and online harm, often in environments where they should feel safest. Many cases go unreported due to fear, stigma, and limited access to protection systems.

First held in 2020 in support of Lumad communities in Mindanao, PUP REVO has since evolved into a platform where music meets mobilization. Its 2026 edition shifts focus toward child protection and the creation of safer spaces for Filipino children.

One of PUP's largest post-pandemic benefit concerts for child protection advocacy

With the theme "Sound Against Silence," the concert confronts a reality the Philippines can no longer afford to ignore. The country has been consistently cited among those with the highest cases of online sexual exploitation of children (OSEC), and reports indicate that a significant number of Filipino children experience some form of violence in their lifetime. The initiative seeks to turn awareness into action, encouraging public participation in advocacy and direct support for protection programs.

The concert brings together 12 bands and artists, featuring a mix of established OPM performers and rising Filipino acts, including select Yellow Room Music (YRM) artists such as Mayonnaise, Soapdish, SUD, Julia Daniel, and Leila; alongside Frank Ely and Ian Quiruz of Evosound Philippines, Shanne Dandan, Brando Bal, Bita and the Botflies, and The Sun. Quest, ambassador of World Vision Philippines, will also perform at the event. The performances will be anchored on both artistry and advocacy, aiming to deepen public engagement on child protection issues.

Part of the proceeds from PUP REVO 2026 will directly support child protection programs and safe space initiatives implemented by ABS-CBN Bantay Bata 163 and World Vision Philippines, both recognized for their long-standing work in child welfare and protection.

Open to the public

PUP REVO 2026 invites students, alumni, and the wider community to take part through attendance, awareness sharing, and direct support for partner initiatives. Organizers say the concert's return reflects a renewed commitment to student-led action, transforming awareness into sustained social impact.

Tickets are now available at PUPREVO2026.ME.

For updates, artist announcements, and event details, follow the official Facebook page of the PUP Communication Society: https://www.facebook.com/pupcommsoc

About PUP REVO. PUP REVO is the flagship advocacy concert of the PUP Communication Society at the Polytechnic University of the Philippines. First launched in 2020, the event uses music and public engagement as instruments for social advocacy.

About ABS-CBN Foundation Bantay Bata 163. Bantay Bata 163 is a child protection hotline and program dedicated to the welfare, rights, and protection of Filipino children.

About World Vision Philippines. World Vision Philippines is a Christian humanitarian organization committed to child well-being, working alongside communities and families across the country.`,
    tags: ['Advocacy', 'Launch'],
    featured: true,
  },
  {
    id: 1,
    type: 'Press Release',
    date: 'May 15, 2026',
    headline: 'PUP Communication Society Unveils Full Artist Lineup for REVO 2026',
    excerpt:
      'The PUP Communication Society officially reveals the complete performing lineup for PUP REVO 2026: Sound Against Silence, headlined by Mayonnaise, SUD, and Soapdish.',
    body: `The PUP Communication Society is thrilled to announce the complete artist lineup for PUP REVO 2026: Sound Against Silence — a benefit concert to be held on June 20, 2026 at the PUP Main Campus Oval, Manila.

Headlining the event are fan favorites Mayonnaise, SUD, and Soapdish, joined by Frank Ely, Ian Quiruz, Julia Daniel, Shanne Dandan, Brando Bal, Bita and the Botflies, and The Sun.

Proceeds from ticket sales will benefit ABS-CBN Foundation – Bantay Bata 163 and World Vision Philippines.

"This lineup embodies everything REVO stands for — powerful voices, meaningful music, and collective action," said the organizing committee.

Tickets are available now at puprevo2026.me.`,
    tags: ['Lineup', 'Artists'],
    featured: false,
  },
  {
    id: 2,
    type: 'Announcement',
    date: 'May 8, 2026',
    headline: 'Ticket Sales Now Open — Limited Slots Available',
    excerpt:
      'Online ticket sales for PUP REVO 2026 are officially open. PUP students get a discounted rate; public and alumni tickets are also available while supplies last.',
    body: `PUP Communication Society announces that ticket sales for PUP REVO 2026: Sound Against Silence are now live at puprevo2026.me.

Two ticket tiers are available:
• PUP Student — discounted rate exclusively for enrolled PUP students
• Public / Alumni — open to the general public and PUP alumni

All tickets are non-refundable. Physical tickets must be claimed at designated booths prior to venue entry upon presentation of your e-ticket.

Slots are strictly limited. The committee encourages early purchase to secure your place at the event.`,
    tags: ['Tickets', 'Sales'],
    featured: false,
  },
  {
    id: 3,
    type: 'Press Release',
    date: 'April 28, 2026',
    headline: 'PUP REVO 2026 Partners with ABS-CBN Foundation and World Vision Philippines',
    excerpt:
      'The PUP Communication Society formalizes its charity partnerships, directing a portion of all ticket revenue to two leading child welfare organizations.',
    body: `The PUP Communication Society has officially confirmed its charitable partnerships for PUP REVO 2026: Sound Against Silence.

A portion of all ticket sales will be donated to:
• ABS-CBN Foundation – Bantay Bata 163, dedicated to protecting children from abuse and neglect
• World Vision Philippines, committed to the long-term well-being of children and communities in need

"Music has always been a vehicle for change," the organizing team stated. "REVO 2026 is our way of turning passion into purpose."

For media inquiries, contact puprevo.commsoc@gmail.com.`,
    tags: ['Advocacy', 'Charity'],
    featured: false,
  },
  {
    id: 4,
    type: 'Media Advisory',
    date: 'April 14, 2026',
    headline: 'Media Accreditation Open for PUP REVO 2026: Sound Against Silence',
    excerpt:
      'Journalists, bloggers, and content creators covering PUP REVO 2026 may now apply for media accreditation through the official PUP Communication Society channels.',
    body: `The PUP Communication Society invites media representatives and content creators to apply for accreditation to cover PUP REVO 2026: Sound Against Silence on June 20, 2026.

Accredited press will receive:
• Designated press area access
• Event media kit
• High-resolution photo assets

To apply, send an email to puprevo.commsoc@gmail.com with the subject line "Media Accreditation – [Your Outlet Name]" and include your name, publication/channel, and press ID or portfolio link.

Deadline for applications: June 5, 2026.`,
    tags: ['Media', 'Press'],
    featured: false,
  },
  {
    id: 5,
    type: 'Announcement',
    date: 'March 30, 2026',
    headline: 'PUP REVO 2026 Officially Announced — June 20 at PUP Main Campus Oval',
    excerpt:
      'The PUP Communication Society marks the launch of REVO 2026: Sound Against Silence, a day of OPM music, advocacy, and PUP pride at the Main Campus Oval in Manila.',
    body: `The PUP Communication Society proudly announces PUP REVO 2026: Sound Against Silence — a benefit concert celebrating OPM music, student advocacy, and PUP pride.

Event Details:
• Date: June 20, 2026
• Time: Gates open at 8:00 AM; Program starts at 9:00 AM
• Venue: PUP Main Campus Oval, Manila

The event will feature live OPM performances, sponsor booths, food concessionaires, and official merchandise. All proceeds support child welfare advocacy through partner organizations.

Follow the official PUP Communication Society social media pages for artist reveals, ticket updates, and event reminders.`,
    tags: ['Launch', 'Event'],
    featured: false,
  },
]

const ALL_TAGS = ['All', ...Array.from(new Set(NEWS_ITEMS.flatMap(n => n.tags)))]
const TYPE_COLORS = {
  'Press Release': { bg: '#FF3B30', color: '#fff' },
  'Announcement': { bg: '#FFD700', color: '#000' },
  'Media Advisory': { bg: '#1A4FD6', color: '#fff' },
}

// ── Modal ────────────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const typeStyle = TYPE_COLORS[article.type] || { bg: '#666', color: '#fff' }

  return (
    <div className="np-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="np-modal">
        <button className="np-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="np-modal-type" style={{ background: typeStyle.bg, color: typeStyle.color }}>
          {article.type}
        </div>
        <div className="np-modal-date">{article.date}</div>
        <h2 className="np-modal-headline">{article.headline}</h2>
        <div className="np-modal-divider" />
        {article.image && <img src={article.image} alt={article.headline} className="np-modal-img" />}
        <div className="np-modal-body">
          {article.body.split('\n').map((para, i) =>
            para.trim() === '' ? <br key={i} /> : <p key={i}>{para}</p>
          )}
        </div>
        <div className="np-modal-footer">
          <span>For media inquiries:</span>
          <a href="mailto:puprevo.commsoc@gmail.com">puprevo.commsoc@gmail.com</a>
        </div>
      </div>
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────
function NewsCard({ item, featured, onClick }) {
  const typeStyle = TYPE_COLORS[item.type] || { bg: '#666', color: '#fff' }
  const [imgFailed, setImgFailed] = useState(false)
  const showImg = featured && item.image && !imgFailed

  return (
    <div className={`np-card ${featured ? 'np-card-featured' : ''} ${showImg ? 'np-card-has-image' : ''}`} onClick={() => onClick(item)}>
      {showImg && (
        <div className="np-card-image-wrap">
          <img src={item.image} alt={item.headline} className="np-card-image" onError={() => setImgFailed(true)} />
        </div>
      )}
      <div className="np-card-content">
        <div className="np-card-top">
          <span className="np-card-type" style={{ background: typeStyle.bg, color: typeStyle.color }}>
            {item.type}
          </span>
          <span className="np-card-date">{item.date}</span>
        </div>
        <h3 className="np-card-headline">{item.headline}</h3>
        <p className="np-card-excerpt">{item.excerpt}</p>
        <div className="np-card-tags">
          {item.tags.map(t => <span key={t} className="np-tag">{t}</span>)}
        </div>
        <div className="np-card-read">
          Read Full Release <i className="fa-solid fa-arrow-right" />
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function NewsPress() {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [navHeight, setNavHeight] = useState(56)
  const navRef = useRef(null)
  const revealRefs = useRef([])

  useEffect(() => {
    const measureNav = () => {
      if (navRef.current) setNavHeight(navRef.current.getBoundingClientRect().height)
    }
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60)
      measureNav()
    }
    measureNav()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measureNav)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measureNav)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('reveal-visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addReveal = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

  const filtered = NEWS_ITEMS.filter(item => {
    const matchTag = activeTag === 'All' || item.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || item.headline.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
    return matchTag && matchSearch
  })

  const featured = filtered.find(n => n.featured)
  const rest = filtered.filter(n => !n.featured)

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root {
          width: 100%; max-width: 100%; overflow-x: hidden;
          background: var(--dark); margin: 0; padding: 0;
        }
        :root {
          --red: #FF3B30;
          --gold: #FFD700;
          --blue: #1A4FD6;
          --cream: #FAF5E9;
          --dark: #060D1F;
          --card-bg: #0D1530;
        }

        /* NAV — identical to Landing */
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
        .nav-logo { cursor: pointer; display: flex; align-items: center; }
        .nav-logo img { height: 36px; width: auto; object-fit: contain; }
        .nav-back {
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(250,245,233,0.6); cursor: pointer;
          background: none; border: none; display: flex; align-items: center; gap: 0.5rem;
          transition: color 0.15s;
        }
        .nav-back:hover { color: var(--cream); }
        .nav-cta {
          font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: var(--gold); color: #000; border: none;
          padding: 0.5rem 1.2rem; border-radius: 4px; cursor: pointer;
          transition: opacity 0.15s;
        }
        .nav-cta:hover { opacity: 0.85; }

        /* PAGE WRAPPER */
        .np-page {
          min-height: 100vh;
          background: var(--dark);
          padding-bottom: 6rem;
        }

        /* HERO HEADER */
        .np-hero {
          position: relative;
          padding: 7rem 2rem 4rem;
          text-align: center;
          overflow: hidden;
        }
        .np-hero::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,59,48,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(26,79,214,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .np-hero-eyebrow {
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1rem;
        }
        .np-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 9vw, 7rem);
          color: var(--cream);
          line-height: 0.95;
          letter-spacing: 0.03em;
        }
        .np-hero-title span { color: var(--red); }
        .np-hero-sub {
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 300;
          color: rgba(250,245,233,0.55); margin-top: 1.25rem; max-width: 520px; margin-inline: auto;
          line-height: 1.7;
        }
        .np-hero-divider {
          width: 48px; height: 3px; background: var(--red);
          margin: 1.5rem auto 0;
        }

        /* CONTROLS */
        .np-controls {
          max-width: 1100px; margin: 2.5rem auto 0; padding: 0 2rem;
          display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
        }
        .np-filter-row {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
        }
        .np-filter-btn {
          font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          background: transparent; border: 1px solid rgba(250,245,233,0.2);
          color: rgba(250,245,233,0.5); padding: 0.4rem 1rem; border-radius: 2px;
          cursor: pointer; transition: all 0.15s;
        }
        .np-filter-btn:hover { border-color: var(--cream); color: var(--cream); }
        .np-filter-btn.active {
          background: var(--red); border-color: var(--red); color: #fff;
        }
        .np-search-wrap {
          position: relative;
        }
        .np-search-wrap i {
          position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
          color: rgba(250,245,233,0.3); font-size: 0.75rem;
        }
        .np-search {
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          color: var(--cream); padding: 0.5rem 1rem 0.5rem 2.25rem;
          border-radius: 4px; outline: none; width: 240px;
          transition: border-color 0.2s;
        }
        .np-search::placeholder { color: rgba(250,245,233,0.3); }
        .np-search:focus { border-color: var(--gold); }

        /* REVEAL */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal-visible { opacity: 1; transform: none; }

        /* FEATURED CARD */
        .np-featured-wrap {
          max-width: 1100px; margin: 3rem auto 0; padding: 0 2rem;
        }
        .np-featured-label {
          font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem;
        }
        .np-featured-label::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,215,0,0.2);
        }

        /* GRID */
        .np-grid {
          max-width: 1100px; margin: 2.5rem auto 0; padding: 0 2rem;
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        /* CARD SHARED */
        .np-card {
          background: var(--card-bg);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          padding: 1.75rem;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          display: flex; flex-direction: column; gap: 0.9rem;
          position: relative; overflow: hidden;
        }
        .np-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .np-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .np-card:hover::before { opacity: 1; }

        /* FEATURED CARD OVERRIDES */
        .np-card-featured {
          grid-column: 1 / -1;
          flex-direction: row;
          background: linear-gradient(135deg, #0D1530 60%, rgba(255,59,48,0.08));
          border-color: rgba(255,59,48,0.25);
          padding: 0; gap: 0; overflow: hidden;
        }
        .np-card-featured::before { opacity: 1; background: linear-gradient(90deg, var(--red), var(--gold)); }

        /* Image layout */
        .np-card-image-wrap {
          width: 45%; flex-shrink: 0; overflow: hidden; min-height: 280px;
        }
        .np-card-image {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .np-card-has-image:hover .np-card-image { transform: scale(1.03); }

        /* Content wrapper inside featured */
        .np-card-content {
          flex: 1; padding: 2.25rem;
          display: flex; flex-direction: column; gap: 0.9rem;
        }
        /* Non-featured: content wrapper is transparent */
        .np-card:not(.np-card-featured) .np-card-content { display: contents; }

        /* Featured without image: old two-column layout */
        .np-card-featured:not(.np-card-has-image) .np-card-content {
          flex-direction: row; flex-wrap: wrap; gap: 0;
        }
        .np-card-featured:not(.np-card-has-image) .np-card-top { width: 100%; margin-bottom: 1rem; }
        .np-card-featured:not(.np-card-has-image) .np-card-headline {
          font-size: clamp(1.4rem, 3vw, 2rem);
          width: 60%; min-width: 280px; padding-right: 2rem;
        }
        .np-card-featured:not(.np-card-has-image) .np-card-excerpt {
          width: 40%; min-width: 240px; align-self: flex-start;
        }
        .np-card-featured:not(.np-card-has-image) .np-card-tags { width: 100%; margin-top: 1.25rem; }
        .np-card-featured:not(.np-card-has-image) .np-card-read { width: 100%; }

        @media (max-width: 700px) {
          .np-card-featured { flex-direction: column; }
          .np-card-image-wrap { width: 100%; min-height: 220px; }
          .np-card-featured:not(.np-card-has-image) .np-card-headline,
          .np-card-featured:not(.np-card-has-image) .np-card-excerpt { width: 100%; padding-right: 0; }
        }

        /* CARD PARTS */
        .np-card-top {
          display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
        }
        .np-card-type {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.25rem 0.65rem; border-radius: 2px;
        }
        .np-card-date {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 300;
          color: rgba(250,245,233,0.4);
        }
        .np-card-headline {
          font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800;
          color: var(--cream); line-height: 1.35;
        }
        .np-card-excerpt {
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 300;
          color: rgba(250,245,233,0.55); line-height: 1.65; flex: 1;
        }
        .np-card-tags {
          display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: auto;
        }
        .np-tag {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(250,245,233,0.4); border: 1px solid rgba(255,255,255,0.1);
          padding: 0.2rem 0.55rem; border-radius: 2px;
        }
        .np-card-read {
          font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 0.4rem;
          transition: gap 0.15s;
        }
        .np-card:hover .np-card-read { gap: 0.7rem; }

        /* EMPTY STATE */
        .np-empty {
          max-width: 1100px; margin: 4rem auto; padding: 0 2rem;
          text-align: center;
        }
        .np-empty i {
          font-size: 2.5rem; color: rgba(250,245,233,0.15); margin-bottom: 1rem;
        }
        .np-empty p {
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: rgba(250,245,233,0.35);
        }

        /* PRESS KIT STRIP */
        .np-presskit {
          max-width: 1100px; margin: 4rem auto 0; padding: 0 2rem;
        }
        .np-presskit-inner {
          background: var(--card-bg);
          border: 1px solid rgba(255,215,0,0.2);
          border-radius: 6px;
          padding: 2rem 2.5rem;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 1.5rem;
        }
        .np-presskit-text h4 {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem;
          letter-spacing: 0.05em; color: var(--cream);
        }
        .np-presskit-text p {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 300;
          color: rgba(250,245,233,0.5); margin-top: 0.35rem;
        }
        .np-presskit-actions {
          display: flex; gap: 0.75rem; flex-wrap: wrap;
        }
        .np-presskit-btn {
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.6rem 1.4rem; border-radius: 4px; cursor: pointer;
          transition: opacity 0.15s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .np-presskit-btn-primary {
          background: var(--gold); color: #000; border: none;
        }
        .np-presskit-btn-secondary {
          background: transparent; color: var(--cream);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .np-presskit-btn:hover { opacity: 0.8; }

        /* MODAL */
        .np-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(6,13,31,0.92); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .np-modal {
          background: var(--card-bg);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          max-width: 680px; width: 100%;
          max-height: 85vh; overflow-y: auto;
          padding: 2.5rem;
          position: relative;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .np-modal-img {
          width: 100%; border-radius: 4px; margin-bottom: 1.5rem;
          object-fit: cover; max-height: 320px; display: block;
        }
        .np-modal-close {
          position: absolute; top: 1rem; right: 1rem;
          background: rgba(255,255,255,0.07); border: none; border-radius: 50%;
          width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(250,245,233,0.6); font-size: 0.9rem;
          transition: background 0.15s, color 0.15s;
        }
        .np-modal-close:hover { background: var(--red); color: #fff; }
        .np-modal-type {
          display: inline-block;
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.25rem 0.65rem; border-radius: 2px; margin-bottom: 0.75rem;
        }
        .np-modal-date {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 300;
          color: rgba(250,245,233,0.4); margin-bottom: 0.75rem;
        }
        .np-modal-headline {
          font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800;
          color: var(--cream); line-height: 1.3; margin-bottom: 1.25rem;
        }
        .np-modal-divider {
          height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 1.5rem;
        }
        .np-modal-body {
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 300;
          color: rgba(250,245,233,0.7); line-height: 1.8;
          display: flex; flex-direction: column; gap: 0.1rem;
        }
        .np-modal-body p { margin-bottom: 0.75rem; }
        .np-modal-footer {
          margin-top: 2rem; padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          color: rgba(250,245,233,0.4);
          display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
        }
        .np-modal-footer a {
          color: var(--gold); text-decoration: none;
        }
        .np-modal-footer a:hover { text-decoration: underline; }

        /* FOOTER */
        .np-footer {
          margin-top: 5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 2rem 2rem;
          text-align: center;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 300;
          color: rgba(250,245,233,0.25);
        }
        .np-footer a { color: rgba(250,245,233,0.4); text-decoration: none; }
        .np-footer a:hover { color: var(--gold); }
      `}</style>

      {/* STICKY NAV */}
      <nav ref={navRef} className={`sticky-nav${navScrolled ? ' nav-scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="PUP REVO 2026" onError={e => { e.target.style.display = 'none' }} />
        </div>
        <button className="nav-back" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left" /> Back to Event
        </button>
        <button className="nav-cta" onClick={() => navigate('/tickets')}>
          Get Tickets
        </button>
      </nav>

      <div className="np-page">
        {/* HERO */}
        <header className="np-hero">
          <div className="np-hero-eyebrow">PUP Communication Society</div>
          <h1 className="np-hero-title">News &amp; <span>Press</span></h1>
          <p className="np-hero-sub">
            Official announcements, press releases, and media advisories for PUP REVO 2026: Sound Against Silence.
          </p>
          <div className="np-hero-divider" />
        </header>

        {/* CONTROLS */}
        <div className="np-controls">
          <div className="np-filter-row">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`np-filter-btn${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="np-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              className="np-search"
              type="text"
              placeholder="Search releases..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="np-empty">
            <i className="fa-solid fa-newspaper" />
            <p>No results found. Try a different search or filter.</p>
          </div>
        ) : (
          <>
            {/* FEATURED */}
            {featured && (
              <div className="np-featured-wrap reveal" ref={addReveal}>
                <div className="np-featured-label">
                  <i className="fa-solid fa-star" style={{ color: 'var(--gold)', fontSize: '0.65rem' }} />
                  Latest Release
                </div>
                <NewsCard item={featured} featured onClick={setSelected} />
              </div>
            )}

            {/* GRID */}
            {rest.length > 0 && (
              <div className="np-grid">
                {rest.map((item, i) => (
                  <div key={item.id} className="reveal" ref={addReveal} style={{ transitionDelay: `${i * 80}ms` }}>
                    <NewsCard item={item} featured={false} onClick={setSelected} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PRESS KIT */}
        <div className="np-presskit reveal" ref={addReveal}>
          <div className="np-presskit-inner">
            <div className="np-presskit-text">
              <h4>Media &amp; Press Kit</h4>
              <p>Assets, logos, high-res photos, and official event copy for accredited media.</p>
            </div>
            <div className="np-presskit-actions">
              <a href="mailto:puprevo.commsoc@gmail.com?subject=Press%20Kit%20Request%20%E2%80%94%20PUP%20REVO%202026"
                className="np-presskit-btn np-presskit-btn-primary">
                <i className="fa-solid fa-envelope" /> Request Kit
              </a>
              <a href="mailto:puprevo.commsoc@gmail.com?subject=Media%20Accreditation%20%E2%80%94%20PUP%20REVO%202026"
                className="np-presskit-btn np-presskit-btn-secondary">
                <i className="fa-solid fa-id-card" /> Apply for Accreditation
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="np-footer">
          © 2026 PUP Communication Society &nbsp;·&nbsp;
          <a href="mailto:puprevo.commsoc@gmail.com">puprevo.commsoc@gmail.com</a> &nbsp;·&nbsp;
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>puprevo2026.me</span>
        </footer>
      </div>

      {/* ARTICLE MODAL */}
      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
