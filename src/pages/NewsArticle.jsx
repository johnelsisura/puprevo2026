// src/pages/NewsArticle.jsx
// PUPREVO 2026 — Individual Press Release / News Article Page
// Route: /news/:slug  (e.g. /news/pup-revo-2026-returns-benefit-bantay-bata-world-vision)
//
// Requires in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NEWS_ITEMS, TYPE_COLORS } from '../data/newsData'

if (!document.querySelector('link[href*="font-awesome"]')) {
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  document.head.appendChild(fa)
}

export default function NewsArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [navScrolled, setNavScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const navRef = useRef(null)

  const article = NEWS_ITEMS.find(n => n.slug === slug)
  const others = NEWS_ITEMS.filter(n => n.slug !== slug).slice(0, 3)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Inject OG / Twitter meta tags for social sharing previews
  useEffect(() => {
    if (!article) return
    const BASE_URL = 'https://puprevo2026.me'
    const pageUrl = `${BASE_URL}/news/${article.slug}`
    const ogImage = article.image ? `${BASE_URL}${article.image}` : `${BASE_URL}/PR1.png`

    const setMeta = (property, content, isName = false) => {
      const attr = isName ? 'name' : 'property'
      let el = document.querySelector(`meta[${attr}="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Save original title to restore on unmount
    const originalTitle = document.title
    document.title = `${article.headline} — PUP REVO 2026`

    // Open Graph
    setMeta('og:type', 'article')
    setMeta('og:title', article.headline)
    setMeta('og:description', article.excerpt)
    setMeta('og:url', pageUrl)
    setMeta('og:image', ogImage)
    setMeta('og:image:width', '1200')
    setMeta('og:image:height', '630')
    setMeta('og:site_name', 'PUP REVO 2026')

    // Twitter / X Card
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', article.headline, true)
    setMeta('twitter:description', article.excerpt, true)
    setMeta('twitter:image', ogImage, true)

    return () => {
      document.title = originalTitle
    }
  }, [article])

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!article) {
    return (
      <>
        <style>{baseCSS}</style>
        <nav ref={navRef} className={`na-nav${navScrolled ? ' nav-scrolled' : ''}`}>
          <div className="na-nav-logo" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="PUP REVO 2026" onError={e => { e.target.style.display = 'none' }} />
          </div>
          <button className="na-nav-back" onClick={() => navigate('/news')}>
            <i className="fa-solid fa-arrow-left" /> News &amp; Press
          </button>
        </nav>
        <div className="na-not-found">
          <i className="fa-solid fa-newspaper" />
          <h2>Article not found.</h2>
          <p>This release may have been removed or the link is incorrect.</p>
          <button onClick={() => navigate('/news')}>← Back to News</button>
        </div>
      </>
    )
  }

  const typeStyle = TYPE_COLORS[article.type] || { bg: '#666', color: '#fff' }

  return (
    <>
      <style>{baseCSS}</style>

      {/* NAV */}
      <nav ref={navRef} className={`na-nav${navScrolled ? ' nav-scrolled' : ''}`}>
        <div className="na-nav-logo" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="PUP REVO 2026" onError={e => { e.target.style.display = 'none' }} />
        </div>
        <button className="na-nav-back" onClick={() => navigate('/news')}>
          <i className="fa-solid fa-arrow-left" /> News &amp; Press
        </button>
        <button className="na-nav-cta" onClick={() => navigate('/checkout')}>
          Get Tickets
        </button>
      </nav>

      {/* BG */}
      <div className="na-bg" />

      <main className="na-page">

        {/* BREADCRUMB */}
        <div className="na-breadcrumb">
          <span onClick={() => navigate('/')} className="na-bc-link">Home</span>
          <i className="fa-solid fa-chevron-right" />
          <span onClick={() => navigate('/news')} className="na-bc-link">News &amp; Press</span>
          <i className="fa-solid fa-chevron-right" />
          <span className="na-bc-current">{article.type}</span>
        </div>

        {/* ARTICLE */}
        <article className="na-article">

          {/* TYPE BADGE + DATE */}
          <div className="na-meta">
            <span className="na-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
              {article.type}
            </span>
            <span className="na-date">
              <i className="fa-regular fa-calendar" /> {article.date}
            </span>
          </div>

          {/* HEADLINE */}
          <h1 className="na-headline">{article.headline}</h1>

          {/* EXCERPT */}
          <p className="na-excerpt">{article.excerpt}</p>

          {/* TAGS */}
          <div className="na-tags">
            {article.tags.map(t => (
              <span key={t} className="na-tag">{t}</span>
            ))}
          </div>

          <div className="na-divider" />

          {/* HERO IMAGE */}
          {article.image && (
            <div className="na-img-wrap">
              <img src={article.image} alt={article.headline} className="na-img" />
            </div>
          )}

          {/* BODY */}
          <div className="na-body">
            {article.body.split('\n').map((para, i) => {
              if (para.trim() === '') return <div key={i} className="na-spacer" />

              // Section subheadings: short lines that don't start with bullet
              const isSubhead = para.trim().length < 80 && !para.startsWith('•') && !para.includes('@') && !para.includes('http') && para === para.trim() && !para.includes(',') && para.split(' ').length <= 10
              if (isSubhead && i > 0) return <h3 key={i} className="na-subhead">{para}</h3>

              if (para.startsWith('•')) return (
                <div key={i} className="na-bullet">
                  <span className="na-bullet-dot">•</span>
                  <span>{para.slice(1).trim()}</span>
                </div>
              )

              return <p key={i} className="na-para">{para}</p>
            })}
          </div>

          <div className="na-divider" />

          {/* SHARE + CONTACT */}
          <div className="na-footer-row">
            <div className="na-contact">
              <span>For media inquiries:</span>
              <a href="mailto:puprevo.commsoc@gmail.com">puprevo.commsoc@gmail.com</a>
            </div>
            <div className="na-share">
              <a
                className="na-share-btn na-share-fb"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                className="na-share-btn na-share-x"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.headline)}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="Share on X"
              >
                <i className="fa-brands fa-x-twitter" />
              </a>
              <button
                className={`na-share-btn na-share-copy${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy link"
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`} />
              </button>
            </div>
          </div>

        </article>

        {/* MORE RELEASES */}
        {others.length > 0 && (
          <section className="na-more">
            <div className="na-more-label">
              <span>More Releases</span>
            </div>
            <div className="na-more-grid">
              {others.map(item => {
                const ts = TYPE_COLORS[item.type] || { bg: '#666', color: '#fff' }
                return (
                  <div key={item.id} className="na-more-card" onClick={() => navigate(`/news/${item.slug}`)}>                    <div className="na-more-card-top">
                      <span className="na-more-type" style={{ background: ts.bg, color: ts.color }}>{item.type}</span>
                      <span className="na-more-date">{item.date}</span>
                    </div>
                    <h4 className="na-more-headline">{item.headline}</h4>
                    <p className="na-more-excerpt">{item.excerpt}</p>
                    <div className="na-more-read">
                      Read Release <i className="fa-solid fa-arrow-right" />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="na-page-footer">
          © 2026 PUP Communication Society &nbsp;·&nbsp;
          <a href="mailto:puprevo.commsoc@gmail.com">puprevo.commsoc@gmail.com</a>
        </footer>

      </main>
    </>
  )
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const baseCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    width: 100%; max-width: 100%; overflow-x: hidden;
    background: #060D1F; color: #FAF5E9;
  }
  :root {
    --red: #FF3B30; --gold: #FFD700; --blue: #1A4FD6;
    --cream: #FAF5E9; --dark: #060D1F; --card-bg: #0D1530;
  }

  /* BG */
  .na-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,59,48,0.14) 0%, transparent 70%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.10) 0%, transparent 60%),
      #060D1F;
  }

  /* NAV */
  .na-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 2rem;
    transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
    border-bottom: 1px solid transparent;
  }
  .na-nav.nav-scrolled {
    background: rgba(6,13,31,0.88);
    backdrop-filter: blur(14px);
    border-color: rgba(255,255,255,0.07);
    box-shadow: 0 2px 24px rgba(0,0,0,0.4);
  }
  .na-nav-logo { cursor: pointer; display: flex; align-items: center; }
  .na-nav-logo img { height: 36px; width: auto; object-fit: contain; }
  .na-nav-back {
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(250,245,233,0.6); background: none; border: none;
    cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
    transition: color 0.15s;
  }
  .na-nav-back:hover { color: var(--cream); }
  .na-nav-cta {
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    background: var(--gold); color: #000; border: none;
    padding: 0.5rem 1.2rem; border-radius: 4px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .na-nav-cta:hover { opacity: 0.85; }

  /* PAGE */
  .na-page {
    position: relative; z-index: 1;
    max-width: 780px; margin: 0 auto;
    padding: 7rem 2rem 4rem;
  }

  /* BREADCRUMB */
  .na-breadcrumb {
    display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
    margin-bottom: 2rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    color: rgba(250,245,233,0.35);
  }
  .na-breadcrumb i { font-size: 0.55rem; }
  .na-bc-link {
    cursor: pointer; transition: color 0.15s;
  }
  .na-bc-link:hover { color: var(--gold); }
  .na-bc-current { color: rgba(250,245,233,0.6); }

  /* ARTICLE */
  .na-article { display: flex; flex-direction: column; gap: 0; }

  .na-meta {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }
  .na-type-badge {
    font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.3rem 0.75rem; border-radius: 2px;
  }
  .na-date {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 300;
    color: rgba(250,245,233,0.45); display: flex; align-items: center; gap: 0.4rem;
  }

  .na-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: var(--cream); line-height: 1.2;
    margin-bottom: 1rem;
  }

  .na-excerpt {
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 400;
    color: rgba(250,245,233,0.65); line-height: 1.7;
    margin-bottom: 1.25rem;
    border-left: 3px solid var(--red);
    padding-left: 1rem;
  }

  .na-tags {
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    margin-bottom: 1.75rem;
  }
  .na-tag {
    font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(250,245,233,0.4); border: 1px solid rgba(255,255,255,0.1);
    padding: 0.2rem 0.6rem; border-radius: 2px;
  }

  .na-divider {
    height: 1px; background: rgba(255,255,255,0.08);
    margin: 1.75rem 0;
  }

  /* IMAGE */
  .na-img-wrap {
    width: 100%; border-radius: 6px; overflow: hidden;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .na-img {
    width: 100%; display: block; object-fit: cover;
    max-height: 460px;
  }

  /* BODY TEXT */
  .na-body { display: flex; flex-direction: column; gap: 0; }
  .na-para {
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 300;
    color: rgba(250,245,233,0.8); line-height: 1.85;
    margin-bottom: 1rem;
    text-align: left;
  }
  .na-spacer { height: 0.5rem; }
  .na-subhead {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
    color: var(--cream); margin: 1.5rem 0 0.75rem;
    letter-spacing: 0.02em;
  }
  .na-bullet {
    display: flex; gap: 0.75rem; align-items: flex-start;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 300;
    color: rgba(250,245,233,0.8); line-height: 1.75;
    margin-bottom: 0.5rem;
  }
  .na-bullet-dot { color: var(--red); flex-shrink: 0; margin-top: 0.1rem; }

  /* FOOTER ROW */
  .na-footer-row {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .na-contact {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    color: rgba(250,245,233,0.4); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  }
  .na-contact a { color: var(--gold); text-decoration: none; }
  .na-contact a:hover { text-decoration: underline; }

  .na-share { display: flex; gap: 0.5rem; }
  .na-share-btn {
    width: 36px; height: 36px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.15); background: transparent;
    color: rgba(250,245,233,0.6); font-size: 0.8rem;
    cursor: pointer; text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .na-share-btn:hover { background: rgba(255,255,255,0.08); color: var(--cream); }
  .na-share-btn.copied { background: var(--red); border-color: var(--red); color: #fff; }

  /* MORE RELEASES */
  .na-more { margin-top: 4rem; }
  .na-more-label {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .na-more-label::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,215,0,0.15);
  }
  .na-more-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
  .na-more-card {
    background: #0D1530; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px; padding: 1.25rem;
    cursor: pointer; display: flex; flex-direction: column; gap: 0.65rem;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .na-more-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.15);
    box-shadow: 0 8px 30px rgba(0,0,0,0.35);
  }
  .na-more-card-top { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .na-more-type {
    font-family: 'Syne', sans-serif; font-size: 0.55rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.2rem 0.5rem; border-radius: 2px;
  }
  .na-more-date {
    font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 300;
    color: rgba(250,245,233,0.35);
  }
  .na-more-headline {
    font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 800;
    color: var(--cream); line-height: 1.35;
  }
  .na-more-excerpt {
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 300;
    color: rgba(250,245,233,0.45); line-height: 1.6; flex: 1;
  }
  .na-more-read {
    font-family: 'Syne', sans-serif; font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); display: flex; align-items: center; gap: 0.35rem;
    transition: gap 0.15s;
  }
  .na-more-card:hover .na-more-read { gap: 0.6rem; }

  /* PAGE FOOTER */
  .na-page-footer {
    margin-top: 4rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    text-align: center;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 300;
    color: rgba(250,245,233,0.25);
  }
  .na-page-footer a { color: rgba(250,245,233,0.4); text-decoration: none; }
  .na-page-footer a:hover { color: var(--gold); }

  /* NOT FOUND */
  .na-not-found {
    min-height: 80vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    text-align: center; padding: 2rem;
  }
  .na-not-found i { font-size: 3rem; color: rgba(250,245,233,0.15); }
  .na-not-found h2 {
    font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--cream);
  }
  .na-not-found p {
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: rgba(250,245,233,0.4);
  }
  .na-not-found button {
    margin-top: 0.5rem;
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    background: var(--red); color: #fff; border: none;
    padding: 0.65rem 1.5rem; border-radius: 4px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .na-not-found button:hover { opacity: 0.85; }

  @media (max-width: 480px) {
    .na-page { padding: 6rem 1.25rem 3rem; }
    .na-headline { font-size: 1.5rem; }
    .na-more-grid { grid-template-columns: 1fr; }
  }
`
