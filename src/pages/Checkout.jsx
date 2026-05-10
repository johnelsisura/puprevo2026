// src/pages/Checkout.jsx
// PUPREVO 2026 — Checkout Page (Updated)
// Same fonts as Landing.jsx needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #E4001B;
    --gold: #F5C842;
    --cream: #FAF5E9;
    --dark: #0A0500;
    --card: #110900;
    --border: rgba(255,255,255,0.07);
    --muted: rgba(250,245,233,0.4);
  }

  body { background: var(--dark); color: var(--cream); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .checkout-wrap {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 420px;
    position: relative;
  }

  @media (max-width: 900px) {
    .checkout-wrap { grid-template-columns: 1fr; }
    .sidebar { order: -1; border-bottom: 1px solid var(--border); border-left: none !important; }
  }

  .form-panel {
    padding: 3rem 4rem;
    max-width: 640px;
  }

  @media (max-width: 600px) { .form-panel { padding: 2rem 1.5rem; } }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    margin-bottom: 2.5rem;
    transition: color 0.15s;
  }
  .back-btn:hover { color: var(--cream); }

  .form-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .form-sub {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 2.5rem;
  }

  .steps {
    display: flex;
    gap: 0;
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--border);
  }

  .step {
    padding: 0.75rem 0;
    margin-right: 2rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    cursor: default;
  }

  .step.active { color: var(--cream); border-bottom-color: var(--red); }
  .step.done { color: var(--gold); }

  .field-group { margin-bottom: 1.5rem; }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .field-row-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 500px) {
    .field-row { grid-template-columns: 1fr; }
    .field-row-3 { grid-template-columns: 1fr 1fr; }
  }

  label {
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.5rem;
  }

  input, select, textarea {
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
    -webkit-appearance: none;
  }

  input:focus, select:focus {
    border-color: rgba(228,0,27,0.5);
    background: rgba(228,0,27,0.04);
  }

  input.error, select.error { border-color: var(--red); }
  input::placeholder { color: rgba(250,245,233,0.2); }
  select option { background: #1a0a00; color: var(--cream); }

  /* File input styling */
  input[type="file"] {
    padding: 0.65rem 1rem;
    cursor: pointer;
    font-size: 0.82rem;
    color: var(--muted);
  }

  input[type="file"]::-webkit-file-upload-button {
    background: rgba(228,0,27,0.15);
    border: 1px solid rgba(228,0,27,0.3);
    color: var(--cream);
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.4rem 0.85rem;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.75rem;
  }

  .field-hint {
    font-size: 0.75rem;
    color: rgba(250,245,233,0.3);
    margin-top: 0.4rem;
    line-height: 1.5;
  }

  .field-error {
    font-size: 0.75rem;
    color: #ff6b6b;
    margin-top: 0.4rem;
  }

  /* Section code preview */
  .section-preview {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(245,200,66,0.08);
    border: 1px solid rgba(245,200,66,0.2);
    border-radius: 4px;
    padding: 0.35rem 0.75rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.1em;
    color: var(--gold);
    margin-top: 0.5rem;
  }

  .section-preview-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(245,200,66,0.5);
  }

  /* Attendee type selector */
  .attendee-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-bottom: 0;
  }

  @media (max-width: 560px) { .attendee-options { grid-template-columns: 1fr 1fr; } }

  .attendee-opt {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.85rem 0.5rem;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s, background 0.15s;
    background: rgba(255,255,255,0.02);
  }

  .attendee-opt:hover { border-color: rgba(255,255,255,0.15); }

  .attendee-opt.selected {
    border-color: var(--red);
    background: rgba(228,0,27,0.06);
  }

  .attendee-opt-icon { font-size: 1.25rem; margin-bottom: 0.3rem; }

  .attendee-opt-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--cream);
  }

  /* Student fields block */
  .student-fields {
    background: rgba(228,0,27,0.03);
    border: 1px solid rgba(228,0,27,0.12);
    border-radius: 10px;
    padding: 1.25rem;
    margin-top: 1rem;
  }

  .student-fields-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(228,0,27,0.7);
    margin-bottom: 1rem;
  }

  /* Payment method cards */
  .payment-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 500px) { .payment-options { grid-template-columns: 1fr; } }

  .payment-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.1rem 0.85rem;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    background: rgba(255,255,255,0.02);
    position: relative;
    text-align: center;
  }

  .payment-card:hover { border-color: rgba(255,255,255,0.15); }

  .payment-card.selected {
    border-color: var(--red);
    background: rgba(228,0,27,0.06);
  }

  .payment-card-icon { font-size: 1.6rem; margin-bottom: 0.45rem; }

  .payment-card-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--cream);
    margin-bottom: 0.2rem;
  }

  .payment-card-desc {
    font-size: 0.7rem;
    color: var(--muted);
    line-height: 1.4;
  }

  .payment-card-fee {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(245,200,66,0.12);
    color: var(--gold);
    padding: 0.15rem 0.4rem;
    border-radius: 2rem;
    border: 1px solid rgba(245,200,66,0.25);
  }

  .payment-card-free {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(34,197,94,0.1);
    color: #4ade80;
    padding: 0.15rem 0.4rem;
    border-radius: 2rem;
    border: 1px solid rgba(34,197,94,0.2);
  }

  /* Payment proof fields */
  .payment-proof {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
  }

  .payment-proof-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
  }

  /* Walk-in info box */
  .walkin-info {
    background: rgba(245,200,66,0.06);
    border: 1px solid rgba(245,200,66,0.2);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    font-size: 0.82rem;
    color: rgba(245,200,66,0.9);
    line-height: 1.6;
    margin-top: 0.5rem;
  }

  /* Step nav */
  .step-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }

  .prev-btn {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.85rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }

  .prev-btn:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }

  .next-btn {
    flex: 1;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: var(--red);
    color: white;
    border: none;
    padding: 0.85rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s;
    box-shadow: 0 4px 20px rgba(228,0,27,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .next-btn:hover:not(:disabled) { opacity: 0.88; }
  .next-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RIGHT SIDEBAR ── */
  .sidebar {
    background: var(--card);
    border-left: 1px solid var(--border);
    padding: 3rem 2rem;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 900px) {
    .sidebar { position: static; height: auto; }
  }

  .sidebar-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.5rem;
  }

  .ticket-preview {
    background: linear-gradient(135deg, #1a0800 0%, #0f0500 100%);
    border: 1px solid rgba(228,0,27,0.2);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .ticket-preview-top {
    background: var(--red);
    padding: 1rem 1.25rem;
  }

  .ticket-preview-event {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    color: white;
    line-height: 1;
  }

  .ticket-preview-date {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    margin-top: 0.2rem;
  }

  .ticket-preview-body { padding: 1.25rem; }

  .ticket-preview-type {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.2rem;
  }

  .ticket-preview-name {
    font-size: 0.9rem;
    color: var(--cream);
    min-height: 1.2rem;
  }

  .ticket-preview-section {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    color: rgba(245,200,66,0.6);
    margin-top: 0.2rem;
  }

  .ticket-preview-attendee {
    font-family: 'Syne', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 0.5rem;
  }

  .ticket-divider {
    border: none;
    border-top: 1px dashed rgba(255,255,255,0.1);
    margin: 1rem 0;
  }

  .breakdown { margin-bottom: 2rem; }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    font-size: 0.88rem;
    color: var(--muted);
  }

  .breakdown-row.total {
    border-top: 1px solid var(--border);
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: var(--cream);
  }

  .breakdown-fee { color: var(--gold); }

  .breakdown-total-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: var(--cream);
    line-height: 1;
  }

  .payment-note {
    margin-top: auto;
    padding: 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .payment-note strong { color: var(--cream); }
`

// ── Constants ──────────────────────────────────────────────────────────────
const CONVENIENCE_FEE_RATE = 0.06 // 6%

const ATTENDEE_OPTS = [
  { value: 'pup_student', icon: '🎓', label: 'PUP Student' },
  { value: 'alumni',      icon: '🏆', label: 'Alumni' },
  { value: 'faculty',     icon: '👨‍🏫', label: 'Faculty' },
  { value: 'outsider',    icon: '🌐', label: 'Outsider' },
]

const PAYMENT_OPTS = [
  {
    key: 'gcash',
    icon: '💚',
    name: 'GCash',
    desc: 'Send to our GCash number and upload screenshot.',
    hasFee: true,
  },
  {
    key: 'maya',
    icon: '💙',
    name: 'Maya',
    desc: 'Send to our Maya account and upload screenshot.',
    hasFee: true,
  },
  {
    key: 'walk_in',
    icon: '🏫',
    name: 'Walk-in',
    desc: 'Pay cash at PUP COC Lagoon before event day.',
    hasFee: false,
  },
]

// ── Validation ─────────────────────────────────────────────────────────────
function validateStep1(form) {
  const errors = {}
  if (!form.full_name.trim()) errors.full_name = 'Required'
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Valid email required'
  if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid PH number required'
  if (!form.attendee_type) errors.attendee_type = 'Please select your attendee type'
  return errors
}

function validateStep2(form) {
  const errors = {}
  if (!form.ticket_type_id) errors.ticket_type_id = 'Select a ticket type'
  if (form.attendee_type === 'pup_student') {
    if (!form.student_id.trim()) errors.student_id = 'Student ID is required'
    if (!form.college.trim()) errors.college = 'Required'
    if (!form.department.trim()) errors.department = 'Required'
    if (!form.year_level) errors.year_level = 'Required'
    if (!form.block.trim()) errors.block = 'Required'
    if (!form.id_photo_file) errors.id_photo_file = 'PUP ID photo is required'
  }
  return errors
}

function validateStep3(form) {
  const errors = {}
  if (!form.payment_method) errors.payment_method = 'Select a payment method'
  if (['gcash', 'maya'].includes(form.payment_method)) {
    if (!form.payment_reference.trim()) errors.payment_reference = 'Reference number is required'
    if (!form.payment_screenshot_file) errors.payment_screenshot_file = 'Payment screenshot is required'
  }
  return errors
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Checkout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [ticketTypes, setTicketTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    // Step 1 — Personal info
    full_name: '',
    email: '',
    phone: '',
    attendee_type: '', // 'pup_student' | 'alumni' | 'faculty' | 'outsider'

    // Step 2 — Ticket + PUP student fields
    ticket_type_id: '',
    ticket_name: '',
    ticket_price: 0,
    student_id: '',
    college: '',
    department: '',
    year_level: '',
    block: '',
    id_photo_file: null,

    // Step 3 — Payment
    payment_method: '', // 'gcash' | 'maya' | 'walk_in'
    payment_reference: '',
    payment_screenshot_file: null,
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Pre-select ticket type from URL param
  useEffect(() => {
    async function fetchTickets() {
      const { data } = await supabase
        .from('ticket_types')
        .select('id, name, price, total_slots, sold_count')
      if (data) {
        setTicketTypes(data)
        const type = searchParams.get('type')
        if (type === 'student') {
          const t = data.find(d => d.name === 'PUP Student')
          if (t) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
        } else if (type === 'public') {
          const t = data.find(d => d.name === 'Public')
          if (t) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
        }
      }
    }
    fetchTickets()
  }, [])

  // Computed
  const hasFee = ['gcash', 'maya'].includes(form.payment_method)
  const convenienceFee = hasFee
    ? parseFloat((form.ticket_price * CONVENIENCE_FEE_RATE).toFixed(2))
    : 0
  const totalAmount = form.ticket_price + convenienceFee

  const sectionCode = form.attendee_type === 'pup_student'
    ? [form.college, form.department, form.year_level, form.block].filter(Boolean).join('-')
    : ''

  // Navigation
  function nextStep() {
    let errs = {}
    if (step === 1) errs = validateStep1(form)
    if (step === 2) errs = validateStep2(form)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(s => s + 1)
  }

  // Upload helper
  async function uploadFile(bucket, file) {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    return data.path
  }

  // Submit
  async function handleSubmit() {
    const errs = validateStep3(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)

    try {
      // Upload files first
      const [student_id_photo_url, payment_screenshot_url] = await Promise.all([
        form.id_photo_file ? uploadFile('student-id-photos', form.id_photo_file) : null,
        form.payment_screenshot_file ? uploadFile('payment-screenshots', form.payment_screenshot_file) : null,
      ])

      // Insert order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          ticket_type_id:         form.ticket_type_id,
          full_name:               form.full_name,
          email:                   form.email,
          phone:                   form.phone,
          attendee_type:           form.attendee_type,
          student_id:              form.student_id || null,
          college:                 form.college || null,
          department:              form.department || null,
          year_level:              form.year_level ? parseInt(form.year_level) : null,
          block:                   form.block || null,
          student_id_photo_url,
          payment_method:          form.payment_method,
          payment_reference:       form.payment_reference || null,
          payment_screenshot_url,
          payment_status:          'pending',
          amount_paid:             totalAmount,
        })
        .select()
        .single()

      if (error) {
        // 1 ID = 1 ticket unique constraint
        if (error.code === '23505' && error.message.includes('student_id')) {
          setErrors({ student_id: 'This Student ID already has a ticket registered.' })
          setStep(2)
          setLoading(false)
          return
        }
        throw error
      }

      // Navigate to ticket page
      navigate(`/ticket/${order.ticket_code}`)

    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Something went wrong. Please try again.' })
      setLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="checkout-wrap">

        {/* ── LEFT PANEL ── */}
        <div className="form-panel">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Event
          </button>

          <h1 className="form-title">Get Your Ticket</h1>
          <p className="form-sub">Fill in your details to reserve your spot at PUP REVO 2026: SOUND AGAINST SILENCE.</p>

          {/* Step indicator */}
          <div className="steps">
            {['Your Info', 'Ticket', 'Payment'].map((label, i) => (
              <div
                key={label}
                className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
              >
                {step > i + 1 ? '✓ ' : ''}{label}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Personal Info + Attendee Type ── */}
          {step === 1 && (
            <div>
              <div className="field-row">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input
                    className={errors.full_name ? 'error' : ''}
                    placeholder="Juan Dela Cruz"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                  />
                  {errors.full_name && <div className="field-error">{errors.full_name}</div>}
                </div>
                <div className="field-group">
                  <label>Phone Number *</label>
                  <input
                    className={errors.phone ? 'error' : ''}
                    placeholder="09XXXXXXXXX"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>
              </div>

              <div className="field-group">
                <label>Email Address *</label>
                <input
                  className={errors.email ? 'error' : ''}
                  type="email"
                  placeholder="juan@email.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
                <div className="field-hint">Your booking confirmation will be sent here.</div>
              </div>

              <div className="field-group">
                <label>I am a *</label>
                <div className="attendee-options">
                  {ATTENDEE_OPTS.map(opt => (
                    <div
                      key={opt.value}
                      className={`attendee-opt ${form.attendee_type === opt.value ? 'selected' : ''}`}
                      onClick={() => set('attendee_type', opt.value)}
                    >
                      <div className="attendee-opt-icon">{opt.icon}</div>
                      <div className="attendee-opt-label">{opt.label}</div>
                    </div>
                  ))}
                </div>
                {errors.attendee_type && <div className="field-error">{errors.attendee_type}</div>}
              </div>

              <div className="step-nav">
                <button className="next-btn" onClick={nextStep}>
                  Continue → Ticket Type
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Ticket + PUP Student Fields ── */}
          {step === 2 && (
            <div>
              <div className="field-group">
                <label>Ticket Type *</label>
                <select
                  className={errors.ticket_type_id ? 'error' : ''}
                  value={form.ticket_type_id}
                  onChange={e => {
                    const t = ticketTypes.find(t => t.id === e.target.value)
                    if (t) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
                  }}
                >
                  <option value="">— Select ticket type —</option>
                  {ticketTypes.map(t => {
                    const remaining = t.total_slots - t.sold_count
                    const soldOut = remaining <= 0
                    return (
                      <option key={t.id} value={t.id} disabled={soldOut}>
                        {t.name} — ₱{t.price}{soldOut ? ' (SOLD OUT)' : ` (${remaining} left)`}
                      </option>
                    )
                  })}
                </select>
                {errors.ticket_type_id && <div className="field-error">{errors.ticket_type_id}</div>}
                {form.attendee_type !== 'pup_student' && (
                  <div className="field-hint">
                    Note: If you're bringing PUP student companions, they need their own ticket and must register individually.
                  </div>
                )}
              </div>

              {/* PUP Student specific fields */}
              {form.attendee_type === 'pup_student' && (
                <div className="student-fields">
                  <div className="student-fields-title">🎓 PUP Student Details</div>

                  <div className="field-group">
                    <label>Student ID Number *</label>
                    <input
                      className={errors.student_id ? 'error' : ''}
                      placeholder="YYYY-XXXXX-MN-0"
                      value={form.student_id}
                      onChange={e => set('student_id', e.target.value)}
                    />
                    {errors.student_id && <div className="field-error">{errors.student_id}</div>}
                    <div className="field-hint">1 Student ID = 1 ticket only. Bring your physical ID on event day.</div>
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label>College *</label>
                      <input
                        className={errors.college ? 'error' : ''}
                        placeholder="COC"
                        value={form.college}
                        onChange={e => set('college', e.target.value.toUpperCase())}
                      />
                      {errors.college && <div className="field-error">{errors.college}</div>}
                    </div>
                    <div className="field-group">
                      <label>Department *</label>
                      <input
                        className={errors.department ? 'error' : ''}
                        placeholder="DAPR"
                        value={form.department}
                        onChange={e => set('department', e.target.value.toUpperCase())}
                      />
                      {errors.department && <div className="field-error">{errors.department}</div>}
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label>Year Level *</label>
                      <select
                        className={errors.year_level ? 'error' : ''}
                        value={form.year_level}
                        onChange={e => set('year_level', e.target.value)}
                      >
                        <option value="">—</option>
                        {[1,2,3,4,5].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      {errors.year_level && <div className="field-error">{errors.year_level}</div>}
                    </div>
                    <div className="field-group">
                      <label>Block *</label>
                      <input
                        className={errors.block ? 'error' : ''}
                        placeholder="2D"
                        value={form.block}
                        onChange={e => set('block', e.target.value.toUpperCase())}
                      />
                      {errors.block && <div className="field-error">{errors.block}</div>}
                    </div>
                  </div>

                  {/* Section code live preview */}
                  {sectionCode && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                        Section Code Preview
                      </div>
                      <div className="section-preview">{sectionCode}</div>
                    </div>
                  )}

                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>PUP ID Photo *</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={errors.id_photo_file ? 'error' : ''}
                      onChange={e => set('id_photo_file', e.target.files[0] || null)}
                    />
                    {errors.id_photo_file && <div className="field-error">{errors.id_photo_file}</div>}
                    <div className="field-hint">
                      Clear photo of your PUP ID card (front). Max 5MB. JPEG or PNG.
                    </div>
                  </div>
                </div>
              )}

              <div className="step-nav">
                <button className="prev-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="next-btn" onClick={nextStep}>Continue → Payment</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Payment Method ── */}
          {step === 3 && (
            <div>
              <div className="field-group">
                <label>Payment Method *</label>
                <div className="payment-options">
                  {PAYMENT_OPTS.map(opt => (
                    <div
                      key={opt.key}
                      className={`payment-card ${form.payment_method === opt.key ? 'selected' : ''}`}
                      onClick={() => set('payment_method', opt.key)}
                    >
                      {opt.hasFee && <div className="payment-card-fee">+6% fee</div>}
                      {!opt.hasFee && <div className="payment-card-free">No fee</div>}
                      <div className="payment-card-icon">{opt.icon}</div>
                      <div className="payment-card-name">{opt.name}</div>
                      <div className="payment-card-desc">{opt.desc}</div>
                    </div>
                  ))}
                </div>
                {errors.payment_method && <div className="field-error">{errors.payment_method}</div>}
              </div>

              {/* GCash / Maya — payment proof fields */}
              {['gcash', 'maya'].includes(form.payment_method) && (
                <div className="payment-proof">
                  <div className="payment-proof-title">
                    {form.payment_method === 'gcash' ? '💚 GCash' : '💙 Maya'} — Payment Proof
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.8rem',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                  }}>
                    Send <strong style={{ color: 'var(--cream)' }}>₱{totalAmount.toFixed(2)}</strong> to{' '}
                    <strong style={{ color: 'var(--gold)' }}>
                      {form.payment_method === 'gcash' ? '09241031430 (J******* R***** T. E*******)' : 'puprevo.commsoc@gmail.com'}
                    </strong>
                    , then fill in the details below.
                  </div>

                  <div className="field-group">
                    <label>Reference Number *</label>
                    <input
                      className={errors.payment_reference ? 'error' : ''}
                      placeholder={form.payment_method === 'gcash' ? 'e.g. 1234567890' : 'e.g. MYA-XXXXXXXX'}
                      value={form.payment_reference}
                      onChange={e => set('payment_reference', e.target.value)}
                    />
                    {errors.payment_reference && <div className="field-error">{errors.payment_reference}</div>}
                    <div className="field-hint">
                      Found in your {form.payment_method === 'gcash' ? 'GCash' : 'Maya'} transaction history.
                    </div>
                  </div>

                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Payment Screenshot *</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={errors.payment_screenshot_file ? 'error' : ''}
                      onChange={e => set('payment_screenshot_file', e.target.files[0] || null)}
                    />
                    {errors.payment_screenshot_file && <div className="field-error">{errors.payment_screenshot_file}</div>}
                    <div className="field-hint">
                      Screenshot showing the amount, recipient, and reference number. Max 5MB.
                    </div>
                  </div>
                </div>
              )}

              {/* Walk-in instructions */}
              {form.payment_method === 'walk_in' && (
                <div className="walkin-info">
                  🏫 <strong>Walk-in Payment:</strong> Pay cash at <strong>PUP COC Lagoon</strong> before the event day. Your slot is reserved — bring your booking reference code when you pay. Slot is NOT confirmed until cash is received.
                </div>
              )}

              {errors.submit && (
                <div className="field-error" style={{ marginTop: '1rem' }}>{errors.submit}</div>
              )}

              <div className="step-nav">
                <button className="prev-btn" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="next-btn"
                  onClick={handleSubmit}
                  disabled={loading || !form.payment_method}
                >
                  {loading ? (
                    <><div className="spinner" /> Processing...</>
                  ) : form.payment_method === 'walk_in' ? (
                    'Reserve My Slot →'
                  ) : (
                    `Submit & Reserve — ₱${totalAmount.toFixed(2)} →`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="sidebar">
          <div className="sidebar-title">Order Summary</div>

          {/* Ticket preview */}
          <div className="ticket-preview">
            <div className="ticket-preview-top">
              <div className="ticket-preview-event">PUP REVO 2026: SOUND AGAINST SILENCE</div>
              <div className="ticket-preview-date">June 20, 2026 · 9:00 AM · PUP Sta. Mesa Manila</div>
            </div>
            <div className="ticket-preview-body">
              <div className="ticket-preview-type">
                {form.ticket_name || '— Select ticket type —'}
              </div>
              <div className="ticket-preview-name">
                {form.full_name || <span style={{ color: 'rgba(250,245,233,0.2)' }}>Your name here</span>}
              </div>
              {sectionCode && (
                <div className="ticket-preview-section">{sectionCode}</div>
              )}
              {form.attendee_type && !sectionCode && (
                <div className="ticket-preview-attendee">
                  {ATTENDEE_OPTS.find(o => o.value === form.attendee_type)?.label || ''}
                </div>
              )}
              <hr className="ticket-divider" />
              <div style={{ fontSize: '0.72rem', color: 'rgba(250,245,233,0.3)', fontFamily: 'Syne', letterSpacing: '0.08em' }}>
                Admin will verify payment before confirming
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="breakdown">
            <div className="breakdown-row">
              <span>Base ticket price</span>
              <span>₱{form.ticket_price > 0 ? form.ticket_price.toFixed(2) : '0.00'}</span>
            </div>
            <div className="breakdown-row">
              <span className={convenienceFee > 0 ? 'breakdown-fee' : ''}>
                Convenience fee
                {hasFee && ` (6% ${form.payment_method === 'gcash' ? 'GCash' : 'Maya'})`}
              </span>
              <span className={convenienceFee > 0 ? 'breakdown-fee' : ''}>
                {convenienceFee > 0
                  ? `+₱${convenienceFee.toFixed(2)}`
                  : form.payment_method === 'walk_in' ? 'FREE' : '—'}
              </span>
            </div>
            <div className="breakdown-row total">
              <span>Total</span>
              <span className="breakdown-total-price">
                ₱{totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <div className="payment-note">
            {form.payment_method === 'gcash' && (
              <>💚 <strong>GCash</strong> — Upload your screenshot and reference number. Admin will verify and confirm your ticket within 24 hours.</>
            )}
            {form.payment_method === 'maya' && (
              <>💙 <strong>Maya</strong> — Upload your screenshot and reference number. Admin will verify and confirm your ticket within 24 hours.</>
            )}
            {form.payment_method === 'walk_in' && (
              <>🏫 <strong>Walk-in</strong> — Slot reserved. Pay cash at PUP COC Lagoon before event day. Present your booking reference.</>
            )}
            {!form.payment_method && (
              <>Select a payment method to continue.</>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
