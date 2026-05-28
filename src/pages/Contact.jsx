// src/pages/Contact.jsx
// PUPREVO 2026 — Contact / Feedback & Inquiry Page
// Fonts needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// Font Awesome needed in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Inject Font Awesome if not already loaded
if (!document.querySelector('link[href*="font-awesome"]')) {
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  document.head.appendChild(fa)
}

const SUBJECTS = [
  'General Inquiry',
  'Ticket Purchase',
  'Ticket Concern / Issue',
  'Payment Concern',
  'Refund / Cancellation',
  'Event Details',
  'Sponsorship / Partnership',
  'Media & Press',
  'Other',
]

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #FF3B30;
    --gold: #FFD700;
    --blue: #1A4FD6;
    --cream: #FAF5E9;
    --dark: #060D1F;
    --card-bg: #0D1530;
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body {
    background: var(--dark); color: var(--cream);
    font-family: 'DM Sans', sans-serif; min-height: 100vh;
  }

  /* Background */
  .contact-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,48,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,215,0,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.12) 0%, transparent 60%),
      var(--dark);
  }
  .contact-grid-overlay {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* Page wrapper */
  .contact-page {
    position: relative; z-index: 1;
    padding: 2rem 1.5rem 4rem;
  }
  .contact-content {
    max-width: 900px;
    margin: 0 auto;
  }

  /* Back button */
  .back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); padding: 0; margin-bottom: 2.5rem;
    display: inline-flex; align-items: center; gap: 0.4rem;
    transition: color 0.15s;
  }
  .back-btn:hover { color: var(--cream); }

  /* ---- STICKY NAV (same as Landing) ---- */
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
  .nav-links {
    display: flex; align-items: center; gap: 2rem; list-style: none;
  }
  @media(max-width: 640px) { .nav-links { display: none; } }
  .nav-link {
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(250,245,233,0.5); cursor: pointer;
    transition: color 0.15s; border: none; background: none; padding: 0;
  }
  .nav-link:hover { color: var(--cream); }
  .nav-link.active { color: var(--gold); }
  .nav-cta {
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    background: var(--gold); color: #000; border: none;
    padding: 0.5rem 1.2rem; border-radius: 4px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .nav-cta:hover { opacity: 0.85; }

  /* Page header */
  .contact-header { margin-bottom: 2.5rem; text-align: center; }
  .contact-label {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--red); margin-bottom: 0.5rem;
  }
  .contact-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    letter-spacing: 0.06em; color: var(--cream);
    line-height: 1; margin-bottom: 0.6rem;
  }
  .contact-sub {
    font-size: 0.88rem; color: var(--muted); line-height: 1.6; max-width: 520px;
    margin: 0 auto;
  }

  /* Two-column layout */
  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    align-items: start;
  }
  @media (max-width: 680px) {
    .contact-layout { grid-template-columns: 1fr; }
  }

  /* Info panel (left) */
  .info-panel {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .info-section-title {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.75rem; text-align: left;
  }
  .info-item {
    display: flex; align-items: flex-start; gap: 0.75rem;
    text-align: left;
  }
  .info-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: rgba(255,59,48,0.12); border: 1px solid rgba(255,59,48,0.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); font-size: 0.8rem; margin-top: 0.15rem;
  }
  .info-item-label {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 0.2rem;
  }
  .info-item-value {
    font-size: 0.82rem; color: var(--cream); line-height: 1.5;
  }
  .info-item-value a {
    color: var(--gold); text-decoration: none;
  }
  .info-item-value a:hover { text-decoration: underline; }
  .info-divider {
    border: none; border-top: 1px solid var(--border); margin: 0;
  }
  .social-row {
    display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center;
  }
  .social-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    color: var(--cream); text-decoration: none;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 50%;
    font-size: 0.9rem;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .social-btn:hover {
    background: rgba(255,215,0,0.1);
    border-color: rgba(255,215,0,0.35);
    color: var(--gold);
  }

  /* Form panel (right) */
  .form-panel {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
  }
  .form-panel-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem;
    letter-spacing: 0.06em; color: var(--cream); margin-bottom: 1.5rem;
  }

  /* Fields */
  .field-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;
  }
  @media (max-width: 520px) {
    .field-row { grid-template-columns: 1fr; }
  }
  .field-group { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
  .field-group:last-child { margin-bottom: 0; }
  .field-group label {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted);
  }
  .field-group input,
  .field-group select,
  .field-group textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 0.9rem;
    color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    transition: border-color 0.15s;
    outline: none;
    width: 100%;
  }
  .field-group input::placeholder,
  .field-group textarea::placeholder { color: rgba(250,245,233,0.2); }
  .field-group input:focus,
  .field-group select:focus,
  .field-group textarea:focus {
    border-color: rgba(255,215,0,0.4);
    background: rgba(255,255,255,0.06);
  }
  .field-group input.error,
  .field-group select.error,
  .field-group textarea.error { border-color: rgba(255,59,48,0.6); }
  .field-group select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(250,245,233,0.3)'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.9rem center;
    padding-right: 2.2rem;
    cursor: pointer;
  }
  .field-group select option { background: #0D1530; color: var(--cream); }
  .field-group textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .field-error {
    font-size: 0.75rem; color: #FF6B60;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .field-hint {
    font-size: 0.73rem; color: var(--muted); line-height: 1.5;
  }

  /* Note banner */
  .note-banner {
    background: rgba(255,215,0,0.07);
    border: 1px solid rgba(255,215,0,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.78rem; color: rgba(255,215,0,0.85); line-height: 1.6;
    display: flex; align-items: flex-start; gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  /* Submit button */
  .submit-btn {
    width: 100%; margin-top: 1.5rem;
    background: var(--gold); color: #000;
    font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    border: none; border-radius: 8px;
    padding: 1rem; cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Success state */
  .success-wrap {
    text-align: center; padding: 3rem 1.5rem;
  }
  .success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3);
    display: flex; align-items: center; justify-content: center;
    color: #4ade80; font-size: 1.6rem;
    margin: 0 auto 1.25rem;
  }
  .success-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
    letter-spacing: 0.06em; color: var(--cream); margin-bottom: 0.5rem;
  }
  .success-sub {
    font-size: 0.85rem; color: var(--muted); line-height: 1.6; max-width: 360px; margin: 0 auto 1.5rem;
  }
  .success-back-btn {
    background: none; border: 1px solid var(--border); border-radius: 8px;
    padding: 0.7rem 1.5rem; color: var(--cream); cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    transition: background 0.15s;
  }
  .success-back-btn:hover { background: rgba(255,255,255,0.06); }

  /* ---- FOOTER ---- */
  .footer {
    font-family: 'DM Sans', sans-serif;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: var(--dark);
    position: relative; z-index: 1;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .footer-main {
    display: grid;
    grid-template-columns: 220px repeat(3, 1fr);
    gap: 2.5rem;
    padding: 3rem 3rem 2.5rem;
  }
  @media (max-width: 900px) {
    .footer-main { grid-template-columns: 1fr 1fr; padding: 2rem 1.5rem; }
  }
  @media (max-width: 520px) {
    .footer-main { grid-template-columns: 1fr; }
  }
  .footer-brand { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
  .footer-logo img { height: 96px; width: auto; object-fit: contain; }
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
    flex-wrap: wrap; gap: 1rem;
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

  /* ---- MODALS ---- */
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

  /* ---- FAQ ACCORDION (inside info panel) ---- */
  .faq-list { display: flex; flex-direction: column; gap: 0; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-item:last-child { border-bottom: none; }
  .faq-btn {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
    padding: 0.85rem 0; text-align: left;
    color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500;
    line-height: 1.5; transition: color 0.15s;
  }
  .faq-btn:hover { color: var(--gold); }
  .faq-chevron {
    flex-shrink: 0; margin-top: 0.15rem; font-size: 0.65rem; color: var(--muted);
    transition: transform 0.2s, color 0.15s;
  }
  .faq-btn:hover .faq-chevron { color: var(--gold); }
  .faq-chevron.open { transform: rotate(180deg); color: var(--gold); }
  .faq-answer {
    overflow: hidden; max-height: 0;
    transition: max-height 0.28s ease, padding-bottom 0.2s;
    padding-bottom: 0;
  }
  .faq-answer.open { max-height: 600px; padding-bottom: 0.9rem; }
  .faq-answer p { font-size: 0.78rem; color: var(--muted); line-height: 1.7; }
`

const FAQ_ITEMS = [
  { q: 'I accidentally exited the tab and tried to register again, but it says my Student ID number is already registered.', a: 'Only one registration is allowed per Student ID number. If you accidentally exited the tab during registration, kindly email or message us your details, including your reference number, so we can either delete the incomplete registration from the database for you to register again or assist you in retrieving your ticket code and link. Even if you were unable to fully submit the form or were unsure if your registration went through, the system automatically saved your details in the database.' },
  { q: 'I selected Walk-in Payment, but I want to switch to GCash payment (or vice versa).', a: 'Kindly email or message us your details, including your reference number and full name. Your current registration will need to be deleted from the database first. Once your email or message has been acknowledged, you may register again using your preferred payment method.' },
  { q: 'The uploaded file says "inbound" and the actual file name is not showing.', a: 'That is completely okay as long as the uploaded file is not in PDF format. You may proceed to the next step.' },
  { q: 'I entered incorrect details during registration.', a: 'Kindly email or message us your details, including your reference number, so we can review and update your registration concern. Depending on the situation, your current registration may need to be deleted from the database for you to register again using the correct information. You might also receive an email regarding the incorrect detail(s). In this case, you will only need to send your updated detail(s) through the same email thread.' },
  { q: 'I did not receive a confirmation email and forgot to screenshot my details or proof.', a: 'Please note that the verification process may take around 1–3 days due to the volume of registrations. Kindly email or message us your details so we can check the status of your registration. Kindly check your spam or junk folder from time to time for possible updates regarding the confirmation of your registration.' },
  { q: 'I cannot personally claim my tickets on-site.', a: 'You may arrange a courier pick-up for your tickets instead. Kindly send us your courier details through our Facebook page, @PUPcommsoc. Please note that the delivery fee will be shouldered by the customer. Make sure to provide your PUP REVO code from the website and the full name of the ticket owner to the courier. A representative may also claim the tickets on your behalf as long as they can provide the reference code and a valid ID of the ticket owner. Tickets cannot be released on the day of the event itself as we are trying to ensure a smooth claiming process and avoid delays or long lines during the event day.' },
]

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  order_id: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendError, setSendError] = useState('')
  const [navScrolled, setNavScrolled] = useState(false)
  const [navHeight, setNavHeight] = useState(56)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const navRef = useRef(null)

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

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.phone.trim()) e.phone = 'Contact number is required.'
    else if (!/^(09|\+639)\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid PH number (e.g. 09XXXXXXXXX).'
    if (!form.subject) e.subject = 'Please select a subject.'
    if (!form.message.trim()) e.message = 'Message is required.'
    else if (form.message.trim().length < 10) e.message = 'Message is too short.'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setLoading(true)
    setSendError('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '89706857-588e-4170-8b81-0b3741c4975a',
          subject: `[PUP REVO 2026] ${form.subject}${form.order_id ? ` — Order #${form.order_id}` : ''}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          order_id: form.order_id || 'N/A',
          inquiry_subject: form.subject,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setForm(EMPTY)
      } else {
        setSendError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setSendError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="contact-bg" />
      <div className="contact-grid-overlay" />

      {/* STICKY NAV — same as Landing */}
      <nav ref={navRef} className={`sticky-nav${navScrolled ? ' nav-scrolled' : ''}`}>
        <span className="nav-logo" onClick={() => navigate('/')}>
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
                className="nav-link"
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100) }}
              >{label}</button>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
          Buy Tickets
        </button>
      </nav>

      <div className="contact-page" style={{ paddingTop: (navHeight + 16) + 'px' }}>
        <div className="contact-content">

        <div className="contact-header">
          <h1 className="contact-title">Feedback &amp; Inquiry</h1>
          <p className="contact-sub">
            Got questions about tickets, the event, or anything else? Send us a message and we'll get back to you as soon as we can.
          </p>
        </div>

        <div className="contact-layout">

          {/* ── LEFT: Info panel ── */}
          <div className="info-panel">
            <div>
              <div className="info-section-title">Contact Info</div>
              <div className="info-item">
                <div className="info-icon"><i className="fa-solid fa-envelope" /></div>
                <div>
                  <div className="info-item-label">Email</div>
                  <div className="info-item-value">
                    <a href="mailto:puprevo.commsoc@gmail.com">puprevo.commsoc@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <hr className="info-divider" />

            <div>
              <div className="info-section-title">Event Details</div>
              <div className="info-item" style={{ marginBottom: '0.9rem' }}>
                <div className="info-icon"><i className="fa-regular fa-calendar" /></div>
                <div>
                  <div className="info-item-label">Date</div>
                  <div className="info-item-value">June 20, 2026<br />Gates open at 8:00 AM</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><i className="fa-solid fa-location-dot" /></div>
                <div>
                  <div className="info-item-label">Venue</div>
                  <div className="info-item-value">PUP Main Campus Oval<br />Sta. Mesa, Manila</div>
                </div>
              </div>
            </div>

            <hr className="info-divider" />

            <div>
              <div className="info-section-title">Response Time</div>
              <div className="info-item">
                <div className="info-icon"><i className="fa-regular fa-clock" /></div>
                <div>
                  <div className="info-item-value" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    We typically respond within <strong style={{ color: 'var(--cream)' }}>1–3 business days</strong>. For urgent concerns, please message us directly on Facebook.
                  </div>
                </div>
              </div>
            </div>

            <hr className="info-divider" />

            <div>
              <div className="info-section-title">Frequently Asked Questions</div>
              <div className="faq-list">
                {FAQ_ITEMS.map((item, i) => (
                  <div className="faq-item" key={i}>
                    <button
                      className="faq-btn"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{item.q}</span>
                      <i className={`fa-solid fa-chevron-down faq-chevron${openFaq === i ? ' open' : ''}`} />
                    </button>
                    <div className={`faq-answer${openFaq === i ? ' open' : ''}`}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="form-panel">
            {submitted ? (
              <div className="success-wrap">
                <div className="success-icon"><i className="fa-solid fa-check" /></div>
                <div className="success-title">Message Sent!</div>
                <p className="success-sub">
                  Your message has been sent! We'll get back to you within 1–3 business days at <strong>{form.email || 'your email'}</strong>. For urgent concerns, message us on Facebook.
                </p>
                <button className="success-back-btn" onClick={() => { setForm(EMPTY); setSubmitted(false) }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="form-panel-title">Send a Message</div>

                <div className="note-banner">
                  <i className="fa-solid fa-circle-info" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  <span>
                    We'll receive your message directly. All ticket sales are <strong>final and non-refundable</strong>.
                  </span>
                </div>
                {sendError && (
                  <div className="note-banner" style={{ borderColor: 'rgba(255,59,48,0.3)', background: 'rgba(255,59,48,0.07)', color: 'rgba(255,100,90,0.9)' }}>
                    <i className="fa-solid fa-circle-exclamation" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <span>{sendError}</span>
                  </div>
                )}

                {/* Name + Phone */}
                <div className="field-row">
                  <div className="field-group">
                    <label>Full Name *</label>
                    <input
                      className={errors.name ? 'error' : ''}
                      placeholder="Juan Dela Cruz"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                    />
                    {errors.name && <div className="field-error"><i className="fa-solid fa-circle-exclamation" />{errors.name}</div>}
                  </div>
                  <div className="field-group">
                    <label>Contact Number *</label>
                    <input
                      className={errors.phone ? 'error' : ''}
                      placeholder="09XXXXXXXXX"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                    {errors.phone && <div className="field-error"><i className="fa-solid fa-circle-exclamation" />{errors.phone}</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="field-group">
                  <label>Email Address *</label>
                  <input
                    className={errors.email ? 'error' : ''}
                    type="email"
                    placeholder="juan@email.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                  />
                  {errors.email && <div className="field-error"><i className="fa-solid fa-circle-exclamation" />{errors.email}</div>}
                </div>

                {/* Subject */}
                <div className="field-group">
                  <label>Subject *</label>
                  <select
                    className={errors.subject ? 'error' : ''}
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                  >
                    <option value="">Select a subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <div className="field-error"><i className="fa-solid fa-circle-exclamation" />{errors.subject}</div>}
                </div>

                {/* Order ID — only show if ticket-related subject */}
                {['Ticket Purchase', 'Ticket Concern / Issue', 'Payment Concern', 'Refund / Cancellation'].includes(form.subject) && (
                  <div className="field-group">
                    <label>Order / Ticket ID <span style={{ color: 'var(--muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem' }}>(if applicable)</span></label>
                    <input
                      placeholder="e.g. REVO-2026-XXXXX"
                      value={form.order_id}
                      onChange={e => set('order_id', e.target.value)}
                    />
                    <div className="field-hint">Check your confirmation email for your Order ID.</div>
                  </div>
                )}

                {/* Message */}
                <div className="field-group">
                  <label>Message *</label>
                  <textarea
                    className={errors.message ? 'error' : ''}
                    placeholder="Describe your concern or question in detail..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                  />
                  {errors.message && <div className="field-error"><i className="fa-solid fa-circle-exclamation" />{errors.message}</div>}
                  <div className="field-hint">{form.message.length} characters</div>
                  <div className="field-hint" style={{ marginTop: '0.3rem' }}>
                    <i className="fa-brands fa-google-drive" style={{ marginRight: '0.3rem', color: 'rgba(255,215,0,0.5)' }} />
                    May screenshot? I-upload sa Google Drive → Share → "Anyone with the link" → i-paste ang link dito sa message.
                  </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <><i className="fa-solid fa-spinner fa-spin" /> Sending...</>
                    : <><i className="fa-solid fa-paper-plane" /> Send Message</>
                  }
                </button>
              </>
            )}
          </div>

        </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="PUP REVO 2026" />
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">About Us</div>
            <ul className="footer-col-links">
              <li><a href="/#details">Event Details</a></li>
              <li><a href="/#beneficiaries">Beneficiaries</a></li>
              <li><a href="/#artists">Artists &amp; Lineup</a></li>
              <li><a href="/#sponsors">Sponsors &amp; Partners</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Customer Care</div>
            <ul className="footer-col-links">
              <li><a href="/contact">Feedback &amp; Inquiry</a></li>
              <li><a href="/#faq">FAQs</a></li>
              <li><a href="/#tickets">Buy Tickets</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Terms &amp; Conditions</div>
            <ul className="footer-col-links">
              <li><button onClick={() => setPrivacyOpen(true)}>Privacy Policy</button></li>
              <li><button onClick={() => setTermsOpen(true)}>Terms of Use</button></li>
            </ul>
          </div>
        </div>
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
            <h3>4. Event Rules &amp; Conduct</h3>
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

    </>
  )
}
