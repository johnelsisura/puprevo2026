// src/pages/Checkout.jsx
// PUPREVO 2026 — Checkout Page
// Fonts needed in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
// Font Awesome needed in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
    --orange: #FF3B30;
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

  /* Landing-style background */
  .checkout-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,48,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,215,0,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.12) 0%, transparent 60%),
      var(--dark);
    animation: bgPulse 8s ease-in-out infinite;
  }
  .checkout-grid-overlay {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(26,79,214,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,79,214,0.06) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridDrift 20s linear infinite;
  }
  @keyframes bgPulse { 0%,100%{opacity:1} 50%{opacity:0.75} }
  @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

  .checkout-wrap {
    position: relative; z-index: 1;
    min-height: calc(100vh - 56px);
    display: grid;
    grid-template-columns: 1fr 420px;
  }

  @media (max-width: 900px) {
    .checkout-wrap { grid-template-columns: 1fr; }
    .sidebar { order: -1; border-bottom: 1px solid var(--border); border-left: none !important; }
  }

  .form-panel {
    padding: 2rem 3rem;
    max-width: 680px;
  }

  @media (max-width: 600px) { .form-panel { padding: 1.5rem 1.25rem; } }

  .back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); background: none; border: none;
    cursor: pointer; margin-bottom: 2.5rem; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--cream); }

  .form-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1; margin-bottom: 0.5rem;
    color: var(--cream);
  }

  .form-sub {
    font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem;
  }

  .steps {
    display: flex; gap: 0; margin-bottom: 1.75rem;
    border-bottom: 1px solid var(--border);
  }

  .step {
    padding: 0.75rem 0; margin-right: 2rem;
    font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); border-bottom: 2px solid transparent;
    margin-bottom: -1px; cursor: default;
  }
  .step.active { color: var(--cream); border-bottom-color: var(--orange); }
  .step.done { color: var(--gold); }

  .field-group { margin-bottom: 1rem; }

  .field-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  }

  @media (max-width: 500px) { .field-row { grid-template-columns: 1fr; } }

  label {
    display: block; font-family: 'Syne', sans-serif;
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 0.5rem;
  }

  input, select, textarea {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 6px; padding: 0.85rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    color: var(--cream); outline: none;
    transition: border-color 0.15s, background 0.15s;
    -webkit-appearance: none;
  }
  input:focus, select:focus {
    border-color: rgba(255,59,48,0.5);
    background: rgba(255,59,48,0.04);
  }
  input.error, select.error { border-color: var(--orange); }
  input::placeholder { color: rgba(250,245,233,0.2); }
  select option { background: #0D1530; color: var(--cream); }

  input[type="file"] {
    padding: 0.65rem 1rem; cursor: pointer;
    font-size: 0.82rem; color: var(--muted);
  }
  input[type="file"]::-webkit-file-upload-button {
    background: rgba(255,59,48,0.15);
    border: 1px solid rgba(255,59,48,0.3);
    color: var(--cream); font-family: 'Syne', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.4rem 0.85rem; border-radius: 4px;
    cursor: pointer; margin-right: 0.75rem;
  }

  .field-hint {
    font-size: 0.75rem; color: rgba(250,245,233,0.3);
    margin-top: 0.4rem; line-height: 1.5;
  }

  .field-error {
    font-size: 0.75rem; color: #ff6b6b; margin-top: 0.4rem;
  }

  /* ── Privacy / Consent box ── */
  .privacy-box {
    background: rgba(255,59,48,0.04);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 10px; padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .privacy-box-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.08em;
    color: var(--orange); margin-bottom: 0.75rem;
  }
  .privacy-box-text {
    font-size: 0.8rem; color: rgba(250,245,233,0.6);
    line-height: 1.7; margin-bottom: 1rem;
  }
  .privacy-checkbox-row {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 1rem;
    cursor: pointer; transition: border-color 0.15s;
  }
  .privacy-checkbox-row:hover { border-color: rgba(255,59,48,0.3); }
  .privacy-checkbox-row.checked { border-color: var(--orange); background: rgba(255,59,48,0.05); }
  .privacy-checkbox {
    width: 18px; height: 18px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.2); border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px; transition: border-color 0.15s, background 0.15s;
  }
  .privacy-checkbox-row.checked .privacy-checkbox {
    background: var(--orange); border-color: var(--orange);
  }
  .privacy-checkbox-label {
    font-size: 0.82rem; color: var(--cream); line-height: 1.5;
  }
  .privacy-checkbox-label span {
    font-weight: 700; color: var(--orange);
  }

  /* ── Consent & Waiver box ── */
  .waiver-box {
    background: rgba(255,215,0,0.04);
    border: 1px solid rgba(255,215,0,0.2);
    border-radius: 10px; padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .waiver-box-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.08em;
    color: var(--gold); margin-bottom: 0.75rem;
  }
  .waiver-box-text {
    font-size: 0.8rem; color: rgba(250,245,233,0.6);
    line-height: 1.7; margin-bottom: 1rem;
  }
  .waiver-box-text strong { color: var(--cream); }
  .waiver-box-text a { color: var(--gold); }
  .waiver-steps {
    font-size: 0.8rem; color: rgba(250,245,233,0.55);
    line-height: 1.7; margin-bottom: 1rem; padding-left: 0.5rem;
  }

  /* ── Payment Agreement box ── */
  .payment-agreement-box {
    background: rgba(255,59,48,0.04);
    border: 1px solid rgba(255,59,48,0.2);
    border-radius: 10px; padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .payment-agreement-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.08em;
    color: var(--orange); margin-bottom: 0.75rem;
  }
  .payment-agreement-text {
    font-size: 0.78rem; color: rgba(250,245,233,0.55);
    line-height: 1.75; margin-bottom: 1rem;
  }
  .payment-agreement-text strong { color: var(--cream); }
  .no-refund-list {
    background: rgba(255,59,48,0.06);
    border: 1px solid rgba(255,59,48,0.15);
    border-radius: 6px; padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    font-size: 0.78rem; color: rgba(250,245,233,0.6);
    line-height: 1.8;
  }
  .no-refund-list strong { color: var(--orange); }

  /* ── Attendee classification ── */
  .attendee-options {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem;
  }
  @media (max-width: 560px) { .attendee-options { grid-template-columns: 1fr 1fr; } }
  .attendee-opt {
    border: 1px solid var(--border); border-radius: 8px;
    padding: 0.85rem 0.5rem; cursor: pointer; text-align: center;
    transition: border-color 0.15s, background 0.15s;
    background: rgba(255,255,255,0.02);
  }
  .attendee-opt:hover { border-color: rgba(255,255,255,0.15); }
  .attendee-opt.selected { border-color: var(--orange); background: rgba(255,59,48,0.06); }
  .attendee-opt-icon { font-size: 1.25rem; margin-bottom: 0.3rem; }
  .attendee-opt-label {
    font-family: 'Syne', sans-serif; font-size: 0.62rem;
    font-weight: 700; letter-spacing: 0.05em; color: var(--cream);
  }

  /* ── Student / Public fields block ── */
  .ticket-fields {
    background: rgba(255,59,48,0.03);
    border: 1px solid rgba(255,59,48,0.12);
    border-radius: 10px; padding: 1.25rem; margin-top: 1rem;
  }
  .ticket-fields-title {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,59,48,0.7); margin-bottom: 1rem;
  }

  /* Section code preview */
  .section-preview {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.2);
    border-radius: 4px; padding: 0.35rem 0.75rem;
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    letter-spacing: 0.1em; color: var(--gold); margin-top: 0.5rem;
  }

  /* ── Payment method cards ── */
  .payment-options {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 500px) { .payment-options { grid-template-columns: 1fr; } }
  .payment-card {
    border: 1px solid var(--border); border-radius: 10px;
    padding: 1.1rem 0.85rem; cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    background: rgba(255,255,255,0.02); position: relative; text-align: center;
  }
  .payment-card:hover { border-color: rgba(255,255,255,0.15); }
  .payment-card.selected { border-color: var(--orange); background: rgba(255,59,48,0.06); }
  .payment-card-icon { font-size: 1.6rem; margin-bottom: 0.45rem; }
  .payment-card-name {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
    color: var(--cream); margin-bottom: 0.2rem;
  }
  .payment-card-desc { font-size: 0.7rem; color: var(--muted); line-height: 1.4; }
  .payment-card-fee {
    position: absolute; top: 0.6rem; right: 0.6rem;
    font-family: 'Syne', sans-serif; font-size: 0.55rem; font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(255,215,0,0.12); color: var(--gold);
    padding: 0.15rem 0.4rem; border-radius: 2rem;
    border: 1px solid rgba(255,215,0,0.25);
  }
  .payment-card-free {
    position: absolute; top: 0.6rem; right: 0.6rem;
    font-family: 'Syne', sans-serif; font-size: 0.55rem; font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(34,197,94,0.1); color: #4ade80;
    padding: 0.15rem 0.4rem; border-radius: 2rem;
    border: 1px solid rgba(34,197,94,0.2);
  }

  /* ── Payment proof fields ── */
  .payment-proof {
    background: rgba(255,255,255,0.02); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.25rem;
    margin-top: -0.5rem; margin-bottom: 1rem;
  }
  .payment-proof-title {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 1rem;
  }

  /* Walk-in info box */
  .walkin-info {
    background: rgba(255,215,0,0.06); border: 1px solid rgba(255,215,0,0.2);
    border-radius: 8px; padding: 1rem 1.25rem;
    font-size: 0.82rem; color: rgba(255,215,0,0.9);
    line-height: 1.6; margin-top: 0.5rem;
  }

  /* Step nav */
  .step-nav {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 2rem; gap: 1rem;
  }
  .prev-btn {
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.82rem;
    letter-spacing: 0.08em; text-transform: uppercase;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); padding: 0.85rem 1.5rem;
    border-radius: 6px; cursor: pointer;
    transition: color 0.15s, border-color 0.15s; flex-shrink: 0;
  }
  .prev-btn:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }
  .next-btn {
    flex: 1; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: var(--orange); color: white; border: none;
    padding: 0.85rem 1.5rem; border-radius: 6px; cursor: pointer;
    transition: opacity 0.15s; box-shadow: 0 4px 20px rgba(255,59,48,0.35);
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .next-btn:hover:not(:disabled) { opacity: 0.88; }
  .next-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RIGHT SIDEBAR ── */
  .sidebar {
    background: rgba(13,21,48,0.85); backdrop-filter: blur(12px);
    border-left: 1px solid var(--border); padding: 1.5rem 1.5rem;
    position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto;
    display: flex; flex-direction: column;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
  .sidebar::-webkit-scrollbar { width: 4px; }
  .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  @media (max-width: 900px) { .sidebar { position: static; height: auto; overflow-y: visible; } }
  .sidebar-title {
    font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 1rem;
  }

  .ticket-preview {
    background: linear-gradient(135deg, rgba(26,79,214,0.15) 0%, rgba(6,13,31,0.9) 100%);
    border: 1px solid rgba(255,59,48,0.25);
    border-radius: 12px; overflow: hidden; margin-bottom: 1.25rem;
  }
  .ticket-preview-top { background: var(--orange); padding: 0.75rem 1rem; }
  .ticket-preview-event {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.15rem; color: white; line-height: 1.1;
  }
  .ticket-preview-date {
    font-family: 'Syne', sans-serif; font-size: 0.58rem; font-weight: 600;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.75);
    text-transform: uppercase; margin-top: 0.15rem;
  }
  .ticket-preview-body { padding: 0.85rem 1rem; }
  .ticket-preview-type {
    font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.2rem;
  }
  .ticket-preview-name { font-size: 0.9rem; color: var(--cream); min-height: 1.2rem; }
  .ticket-preview-section {
    font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem;
    letter-spacing: 0.1em; color: rgba(255,215,0,0.6); margin-top: 0.2rem;
  }
  .ticket-preview-attendee {
    font-family: 'Syne', sans-serif; font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 0.5rem;
  }
  .ticket-divider {
    border: none; border-top: 1px dashed rgba(255,255,255,0.1); margin: 1rem 0;
  }

  .breakdown { margin-bottom: 1.25rem; }
  .breakdown-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.6rem 0; font-size: 0.88rem; color: var(--muted);
  }
  .breakdown-row.total {
    border-top: 1px solid var(--border); margin-top: 0.5rem; padding-top: 1rem;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: var(--cream);
  }
  .breakdown-fee { color: var(--gold); }
  .breakdown-total-price {
    font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--cream); line-height: 1;
  }

  .payment-note {
    margin-top: auto; padding: 1rem;
    background: rgba(255,255,255,0.02); border: 1px solid var(--border);
    border-radius: 8px; font-size: 0.75rem; color: var(--muted); line-height: 1.6;
  }
  .payment-note strong { color: var(--cream); }

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
  .footer-col-title {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--cream); margin-bottom: 1rem; text-align: left;
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
`

// ── File preview + format validation helper ───────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

function FilePreview({ file, maxMB = 10, fieldLabel = 'file', acceptPdf = false }) {
  if (!file) return null
  const sizeMB = file.size / (1024 * 1024)
  const isPdf = file.type === 'application/pdf'
  const wrongFormat = acceptPdf ? !isPdf : !ALLOWED_IMAGE_TYPES.includes(file.type)
  const tooBig = sizeMB > maxMB
  const ok = !wrongFormat && !tooBig

  let errorMsg = null
  if (wrongFormat) {
    const ext = file.name.split('.').pop().toUpperCase()
    errorMsg = acceptPdf
      ? `${ext} files are not accepted. Please upload a PDF of your ${fieldLabel}.`
      : `${ext} files are not accepted. Please upload a photo of your ${fieldLabel} (.jpg, .png, or .webp).`
  } else if (tooBig) {
    errorMsg = `File is too large (${sizeMB.toFixed(1)} MB). Max allowed is ${maxMB} MB. ${acceptPdf ? 'Try compressing the PDF.' : 'Try a lower-resolution photo.'}`
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: ok ? 'rgba(74,222,128,0.06)' : 'rgba(255,107,107,0.08)',
        border: `1px solid ${ok ? 'rgba(74,222,128,0.25)' : 'rgba(255,107,107,0.35)'}`,
        borderRadius: '6px', padding: '0.5rem 0.75rem',
        fontSize: '0.78rem',
        color: ok ? '#4ade80' : '#ff6b6b',
      }}>
        <i className={`fa-solid ${ok ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {file.name}
        </span>
        <span style={{ flexShrink: 0, opacity: 0.7 }}>{sizeMB.toFixed(2)} MB</span>
      </div>
      {errorMsg && (
        <div style={{ fontSize: '0.75rem', color: '#ff6b6b', marginTop: '0.35rem', lineHeight: 1.5 }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.35rem' }} />
          {errorMsg}
        </div>
      )}
    </div>
  )
}

// ── Constants ──────────────────────────────────────────────────────────────
const SERVICE_FEE_RATE = 0.06

// Non-PUPian classifications
const PUBLIC_ATTENDEE_OPTS = [
  { value: 'alumni',   icon: 'fa-solid fa-graduation-cap', label: 'Alumni' },
  { value: 'faculty',  icon: 'fa-solid fa-chalkboard-user', label: 'Faculty' },
  { value: 'outsider', icon: 'fa-solid fa-globe', label: 'Outsider' },
]

const PAYMENT_OPTS = [
  {
    key: 'gcash',
    icon: 'fa-solid fa-mobile-screen-button',
    name: 'GCash',
    desc: 'Send to our GCash number and upload screenshot.',
    hasFee: true,
  },
  {
    key: 'walk_in',
    icon: 'fa-solid fa-school',
    name: 'Walk-in',
    desc: 'Pay cash at PUP Lagoon before the event day.',
    hasFee: false,
  },
]

// ── Validation ─────────────────────────────────────────────────────────────
function validateStep1(form) {
  const errors = {}
  if (!form.full_name.trim()) errors.full_name = 'Required'
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Valid email required'
  if (!form.confirm_email.trim()) errors.confirm_email = 'Please confirm your email'
  else if (form.confirm_email.trim().toLowerCase() !== form.email.trim().toLowerCase()) errors.confirm_email = 'Emails do not match'
  if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid PH number required'
  if (!form.school_affiliation.trim()) errors.school_affiliation = 'Required'
  if (!form.privacy_consent) errors.privacy_consent = 'You must agree to the Data Privacy Notice to continue'
  return errors
}

const ALLOWED_IMG = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const ALLOWED_PDF = ['application/pdf']
function badImgFormat(file) { return file && !ALLOWED_IMG.includes(file.type) }
function badPdfFormat(file) { return file && !ALLOWED_PDF.includes(file.type) }

function validateStep2(form) {
  const errors = {}
  if (!form.ticket_type_id) errors.ticket_type_id = 'Select a ticket type'

  if (form.ticket_name === 'PUP Student') {
    if (!form.student_id.trim()) errors.student_id = 'Student Number is required'
    if (!form.department.trim()) errors.department = 'Required'
    if (!form.year_level) errors.year_level = 'Required'
    if (!form.block.trim()) errors.block = 'Required'
    if (!form.id_photo_file) errors.id_photo_file = 'COR upload is required'
    else if (badImgFormat(form.id_photo_file)) errors.id_photo_file = 'Invalid file type. Please upload a .jpg, .png, or .webp photo of your COR — PDF is not accepted.'
    else if (form.id_photo_file.size > 10 * 1024 * 1024) errors.id_photo_file = 'File too large. Max 10MB. Try a lower quality photo.'
    if (!form.waiver_file) errors.waiver_file = 'Consent/Waiver form is required'
    else if (badPdfFormat(form.waiver_file)) errors.waiver_file = 'Invalid file type. Please upload a .pdf of the completed form — image files are not accepted.'
    else if (form.waiver_file.size > 10 * 1024 * 1024) errors.waiver_file = 'File too large. Max 10MB.'
  } else {
    if (!form.attendee_type) errors.attendee_type = 'Please select your classification'
    if (!form.valid_id_file) errors.valid_id_file = 'Valid ID is required'
    else if (badImgFormat(form.valid_id_file)) errors.valid_id_file = 'Invalid file type. Please upload a .jpg, .png, or .webp photo of your ID — PDF is not accepted.'
    else if (form.valid_id_file.size > 10 * 1024 * 1024) errors.valid_id_file = 'File too large. Max 10MB. Try a lower quality photo.'
    if (!form.waiver_file) errors.waiver_file = 'Consent/Waiver form is required'
    else if (badPdfFormat(form.waiver_file)) errors.waiver_file = 'Invalid file type. Please upload a .pdf of the completed form — image files are not accepted.'
    else if (form.waiver_file.size > 10 * 1024 * 1024) errors.waiver_file = 'File too large. Max 10MB.'
  }
  return errors
}

function validateStep3(form) {
  const errors = {}
  if (!form.payment_method) errors.payment_method = 'Select a payment method'
  if (!form.payment_agreement) errors.payment_agreement = 'You must agree to the payment terms'
  if (form.payment_method === 'gcash') {
    if (!form.payment_reference.trim()) errors.payment_reference = 'Reference number is required'
    if (!form.payment_screenshot_file) errors.payment_screenshot_file = 'Payment screenshot is required'
    else if (form.payment_screenshot_file.size > 10 * 1024 * 1024) errors.payment_screenshot_file = 'File too large. Max 10MB. Try a screenshot instead of a raw photo.'
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
  const [navScrolled, setNavScrolled] = useState(false)
  const [navHeight, setNavHeight] = useState(56)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef(null)
  const turnstileWidgetId = useRef(null)
  const navRef = useRef(null)

  const [form, setForm] = useState({
    // Step 1
    full_name: '',
    email: '',
    confirm_email: '',
    phone: '',
    school_affiliation: '',
    privacy_consent: false,

    // Step 2
    ticket_type_id: '',
    ticket_name: '',
    ticket_price: 0,
    // PUPian fields
    student_id: '',
    department: '',
    year_level: '',
    block: '',
    campus: '',
    id_photo_file: null,  // COR
    waiver_file: null,
    // Public fields
    attendee_type: '',    // alumni | faculty | outsider
    id_number: '',
    valid_id_file: null,  // ← non-PUPian valid ID

    // Step 3
    payment_method: '',
    payment_agreement: false,
    payment_reference: '',
    payment_screenshot_file: null,
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const isPUPian = form.ticket_name === 'PUP Student'

  // Pre-select ticket type from URL param
  useEffect(() => {
    async function fetchTickets() {
      // Use cache if fresh (within 60s) — avoids re-fetching on every page open
      try {
        const raw = sessionStorage.getItem('ticket_types_cache')
        if (raw) {
          const { data: cached, ts } = JSON.parse(raw)
          if (Date.now() - ts < 60_000) {
            setTicketTypes(cached)
            const type = searchParams.get('type')
            if (type === 'student') {
              const t = cached.find(d => d.name === 'PUP Student')
              if (t && t.sold_count < t.total_slots) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
            } else if (type === 'public') {
              const t = cached.find(d => d.name === 'Public')
              if (t && t.sold_count < t.total_slots) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
            }
            return
          }
        }
      } catch (_) { /* ignore bad cache */ }

      const { data: slotData } = await supabase
        .from('slot_counts')
        .select('ticket_type_id, ticket_type, price, total_slots, sold_count')

      if (slotData) {
        const enriched = slotData.map(t => ({
          id: t.ticket_type_id,
          name: t.ticket_type,
          price: t.price,
          total_slots: t.total_slots,
          sold_count: t.sold_count,
        }))

        sessionStorage.setItem('ticket_types_cache', JSON.stringify({
          data: enriched,
          ts: Date.now(),
        }))

        setTicketTypes(enriched)

        const type = searchParams.get('type')
        if (type === 'student') {
          const t = enriched.find(d => d.name === 'PUP Student')
          if (t && t.sold_count < t.total_slots) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
        } else if (type === 'public') {
          const t = enriched.find(d => d.name === 'Public')
          if (t && t.sold_count < t.total_slots) setForm(f => ({ ...f, ticket_type_id: t.id, ticket_name: t.name, ticket_price: t.price }))
        }
      }
    }
    fetchTickets()
  }, [])

  // Load Cloudflare Turnstile script
  useEffect(() => {
    if (document.getElementById('cf-turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Render Turnstile widget when Step 1 is active
  useEffect(() => {
    if (step !== 1) return
    const tryRender = () => {
      if (!turnstileRef.current || !window.turnstile) return
      if (turnstileWidgetId.current != null) return
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA', // replace with your real key
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
        theme: 'dark',
      })
    }
    const interval = setInterval(() => {
      if (window.turnstile) { tryRender(); clearInterval(interval) }
    }, 200)
    return () => clearInterval(interval)
  }, [step])

  // Reset Turnstile when leaving Step 1
  useEffect(() => {
    if (step !== 1 && turnstileWidgetId.current != null) {
      try { window.turnstile?.reset(turnstileWidgetId.current) } catch (_) {}
      turnstileWidgetId.current = null
      setTurnstileToken('')
    }
  }, [step])

  // Nav scroll effect
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

  // Computed
  const hasFee = form.payment_method === 'gcash'
  const serviceFee = hasFee
    ? parseFloat((form.ticket_price * SERVICE_FEE_RATE).toFixed(2))
    : 0
  const totalAmount = form.ticket_price + serviceFee

  const sectionCode = isPUPian
    ? [form.department, form.year_level, form.block].filter(Boolean).join('-')
    : ''

  function nextStep() {
    let errs = {}
    if (step === 1) errs = validateStep1(form)
    if (step === 2) errs = validateStep2(form)
    if (step === 1 && !turnstileToken) {
      errs.turnstile = 'Please complete the CAPTCHA verification before continuing.'
    }
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(s => s + 1)
  }

  // ── Image compressor ────────────────────────────────────────────────────
  async function compressImage(file, maxSizeMB = 2) {
    if (!file.type.startsWith('image/')) return file
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          const MAX_DIM = 1600
          if (width > MAX_DIM || height > MAX_DIM) {
            const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(img, 0, 0, width, height)
          canvas.toBlob(async (blob85) => {
            let finalBlob = blob85
            if (blob85.size > maxSizeMB * 1024 * 1024) {
              await new Promise(res => canvas.toBlob(b => { finalBlob = b; res() }, 'image/jpeg', 0.7))
            }
            resolve(new File([finalBlob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          }, 'image/jpeg', 0.85)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  async function uploadFile(bucket, file) {
    if (!file) return null
    const isPdf = file.type === 'application/pdf'
    const fileToUpload = isPdf ? file : await compressImage(file)
    const maxSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    const maxLabel = isPdf ? '10MB' : '5MB'
    if (fileToUpload.size > maxSize) {
      throw new Error(`File too large. Please use a smaller file (max ${maxLabel}).`)
    }
    const ext = fileToUpload.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from(bucket).upload(path, fileToUpload)
    if (error) {
      console.error('UPLOAD ERROR — bucket:', bucket, '| error:', error)
      throw error
    }
    return data.path
  }

  async function handleSubmit() {
    if (loading) return
    console.log('Turnstile token:', turnstileToken)

    const errs = validateStep3(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const [cor_or_id_url, valid_id_url, payment_screenshot_url, waiver_url] = await Promise.all([
        form.id_photo_file          ? uploadFile('student-id-photos',    form.id_photo_file)          : null,
        form.valid_id_file          ? uploadFile('student-id-photos',    form.valid_id_file)          : null,
        form.payment_screenshot_file? uploadFile('payment-screenshots',  form.payment_screenshot_file): null,
        form.waiver_file            ? uploadFile('waiver-forms',         form.waiver_file)            : null,
      ])

      const orderData = {
        ticket_type_id:        form.ticket_type_id,
        full_name:             form.full_name,
        email:                 form.email,
        phone:                 form.phone,
        school_affiliation:    form.school_affiliation,
        attendee_type:         isPUPian ? 'pup_student' : form.attendee_type,
        student_id:            form.student_id   || null,
        department:            form.department   || null,
        year_level:            form.year_level   || null,
        block:                 form.block        || null,
        campus:                form.campus       || null,
        id_number:             form.id_number    || null,
        cor_or_id_url,
        valid_id_url,
        waiver_url,
        payment_method:        form.payment_method,
        payment_reference:     form.payment_reference      || null,
        payment_screenshot_url,
        payment_status:        'pending',
        amount_paid:           totalAmount,
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke('verify-turnstile', {
          body: { token: turnstileToken, orderData },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      })

      if (fnError || fnData?.error) {
        const msg = fnData?.error || fnError?.message || 'Something went wrong. Please try again.'
        if (msg.includes('student_id') || msg.includes('23505')) {
          setErrors({ student_id: 'This Student Number already has a ticket registered.' })
          setStep(2)
          setLoading(false)
          return
        }
        throw new Error(msg)
      }

      navigate(`/ticket/${fnData.ticket_code}`)
    } catch (err) {
      console.error(err)
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' })
      setLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="checkout-bg" />
      <div className="checkout-grid-overlay" />

      {/* STICKY NAV */}
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

      <div style={{ paddingTop: navHeight + 'px', position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="checkout-wrap">

          {/* ── LEFT PANEL ── */}
          <div className="form-panel">
          <h1 className="form-title">Get Your Ticket</h1>
          <p className="form-sub">Fill in your details to reserve your spot at PUP REVO 2026: SOUND AGAINST SILENCE.</p>
          <div style={{
            background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: '8px', padding: '0.75rem 1rem',
            fontSize: '0.78rem', color: 'rgba(255,215,0,0.9)', lineHeight: 1.6,
            marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <span><strong>Do not refresh or close this page</strong> while filling out the form — all entered information will be lost and you will need to start over.</span>
          </div>

          <div className="steps">
            {['Your Info', 'Ticket', 'Payment'].map((label, i) => (
              <div key={label} className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
                {step > i + 1 ? '✓ ' : ''}{label}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div>
              <div className="field-row">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input
                    className={errors.full_name ? 'error' : ''}
                    placeholder="Ex. Juan L. Dela Cruz"
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
                <label>Confirm Email Address *</label>
                <input
                  className={errors.confirm_email ? 'error' : ''}
                  type="email"
                  placeholder="Re-enter your email"
                  value={form.confirm_email}
                  onChange={e => set('confirm_email', e.target.value)}
                  onPaste={e => e.preventDefault()}
                />
                {errors.confirm_email && <div className="field-error">{errors.confirm_email}</div>}
                <div className="field-hint">Must match the email above. Paste is disabled.</div>
              </div>

              <div className="field-group">
                <label>{isPUPian ? 'Campus * (Required — No N/A)' : 'School / Affiliation * (Required — No N/A)'}</label>
                <input
                  className={errors.school_affiliation ? 'error' : ''}
                  placeholder={isPUPian ? 'Ex. Main Campus, Sta. Mesa' : 'Ex. Polytechnic University of the Philippines | PUP'}
                  value={form.school_affiliation}
                  onChange={e => set('school_affiliation', e.target.value)}
                />
                {errors.school_affiliation && <div className="field-error">{errors.school_affiliation}</div>}
                <div className="field-hint">
                  {isPUPian
                    ? 'State your PUP campus only (e.g. Main Campus, Lopez, Quezon City, etc.)'
                    : <>Full Name | Abbreviation — e.g. ABC Marketing Solutions Inc. | AMSI<br />If not a student, indicate your workplace or organization.</>
                  }
                </div>
              </div>

              {/* Data Privacy Consent */}
              <div className="privacy-box">
                <div className="privacy-box-title">Data Privacy Consent</div>
                <div className="privacy-box-text">
                  In line with the Data Privacy Act of 2012, all information collected through this form will be used exclusively for the organization, coordination, and implementation of <strong>PUP REVO 2026: Sound Against Silence — A Benefit Concert for Safer Kids.</strong>
                  <br /><br />
                  Your personal data will be handled with utmost confidentiality and will only be accessed by authorized members of the organizing team for purposes directly related to PUP REVO 2026. It will not be shared with any unauthorized third parties.
                  <br /><br />
                  By accomplishing this form, you voluntarily give your consent to the collection and use of your information in support of this event.
                </div>
                <div
                  className={`privacy-checkbox-row ${form.privacy_consent ? 'checked' : ''}`}
                  onClick={() => set('privacy_consent', !form.privacy_consent)}
                >
                  <div className="privacy-checkbox">
                    {form.privacy_consent && <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="privacy-checkbox-label">
                    I have read and understand the Data Privacy Notice and <span>consent to the collection and use of my information</span> for this event.
                  </div>
                </div>
                {errors.privacy_consent && <div className="field-error" style={{ marginTop: '0.5rem' }}>{errors.privacy_consent}</div>}
              </div>

              {/* Cloudflare Turnstile CAPTCHA */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div ref={turnstileRef} />
                {errors.turnstile && <div className="field-error" style={{ marginTop: '0.5rem' }}>{errors.turnstile}</div>}
              </div>

              <div className="step-nav">
                <button className="next-btn" onClick={nextStep}>
                  Continue → Ticket Type
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Ticket ── */}
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
              </div>

              {/* ── PUP Student Fields ── */}
              {isPUPian && (
                <div className="ticket-fields">
                  <div className="ticket-fields-title"><i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.5rem' }} />PUP Student Details</div>
                  <div className="field-hint" style={{ marginBottom: '1rem', color: 'rgba(250,245,233,0.45)' }}>
                    PUP students enrolled in other campuses aside from the Main Campus may still identify as PUPians.
                  </div>

                  <div className="field-group">
                    <label>Student Number *</label>
                    <input
                      className={errors.student_id ? 'error' : ''}
                      placeholder="Ex. 2023-00000-MN-0"
                      value={form.student_id}
                      onChange={e => set('student_id', e.target.value)}
                      maxLength={16}
                    />
                    {errors.student_id && <div className="field-error">{errors.student_id}</div>}
                    <div className="field-hint">1 Student Number = 1 ticket only. Must be exactly 12 characters (excluding dashes).</div>
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label>Program *</label>
                      <input
                        className={errors.department ? 'error' : ''}
                        placeholder="Ex. BAPR"
                        value={form.department}
                        onChange={e => set('department', e.target.value.toUpperCase())}
                      />
                      {errors.department && <div className="field-error">{errors.department}</div>}
                    </div>
                    <div className="field-group">
                      <label>Block *</label>
                      <input
                        className={errors.block ? 'error' : ''}
                        placeholder="Ex. 2D"
                        value={form.block}
                        onChange={e => set('block', e.target.value.toUpperCase())}
                      />
                      {errors.block && <div className="field-error">{errors.block}</div>}
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Year Level *</label>
                    <input
                      className={errors.year_level ? 'error' : ''}
                      placeholder="Ex. 1, 2, 3, 4 (Number only)"
                      value={form.year_level}
                      onChange={e => set('year_level', e.target.value)}
                    />
                    {errors.year_level && <div className="field-error">{errors.year_level}</div>}
                  </div>

                  {sectionCode && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                        Section Code Preview
                      </div>
                      <div className="section-preview">{sectionCode}</div>
                    </div>
                  )}

                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Upload Certificate of Registration (COR) *</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className={errors.id_photo_file ? 'error' : ''}
                      key={form.id_photo_file ? 'has-file' : 'empty'}
                      onChange={e => set('id_photo_file', e.target.files[0] || null)}
                    />
                    {errors.id_photo_file && <div className="field-error">{errors.id_photo_file}</div>}
                    <FilePreview file={form.id_photo_file} maxMB={10} fieldLabel="COR" />
                    <div className="field-hint">
                      Accepted: .png, .jpg, .jpeg, .webp only — no PDF. Max 10 MB. 1 file only.<br />
                      Upload a clear photo of your COR for S.Y. 2025–2026, 2nd Semester.
                    </div>
                  </div>
                </div>
              )}

              {/* ── Non-PUPian / Public Fields ── */}
              {!isPUPian && form.ticket_type_id && (
                <div className="ticket-fields">
                  <div className="ticket-fields-title"><i className="fa-solid fa-user" style={{ marginRight: '0.5rem' }} />Non-PUPian / Public Details</div>

                  <div className="field-group">
                    <label>Classification *</label>
                    <div className="attendee-options">
                      {PUBLIC_ATTENDEE_OPTS.map(opt => (
                        <div
                          key={opt.value}
                          className={`attendee-opt ${form.attendee_type === opt.value ? 'selected' : ''}`}
                          onClick={() => set('attendee_type', opt.value)}
                        >
                          <div className="attendee-opt-icon"><i className={opt.icon} /></div>
                          <div className="attendee-opt-label">{opt.label}</div>
                        </div>
                      ))}
                    </div>
                    {errors.attendee_type && <div className="field-error">{errors.attendee_type}</div>}
                  </div>

                  <div className="field-group">
                    <label>ID Number *</label>
                    <input
                      className={errors.id_number ? 'error' : ''}
                      placeholder="Your ID number"
                      value={form.id_number}
                      onChange={e => set('id_number', e.target.value)}
                    />
                    {errors.id_number && <div className="field-error">{errors.id_number}</div>}
                  </div>

                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Upload Valid ID *</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className={errors.valid_id_file ? 'error' : ''}
                      key={form.valid_id_file ? 'has-id' : 'empty-id'}
                      onChange={e => set('valid_id_file', e.target.files[0] || null)}
                    />
                    {errors.valid_id_file && <div className="field-error">{errors.valid_id_file}</div>}
                    <FilePreview file={form.valid_id_file} maxMB={10} fieldLabel="Valid ID" />
                    <div className="field-hint">
                      Accepted: .png, .jpg, .jpeg, .webp only — no PDF. Max 10 MB. 1 file only.<br />
                      Upload a clear photo of your valid ID (front only, ID number visible). Present the same ID at the entrance on event day.
                    </div>
                  </div>
                </div>
              )}

              {/* ── Consent & Waiver ── */}
              {form.ticket_type_id && (
                <div className="waiver-box" style={{ marginTop: '1.5rem' }}>
                  <div className="waiver-box-title">Consent and Waiver</div>
                  <div className="waiver-box-text">
                    Please carefully read and complete the <strong>consent, waiver,</strong> and <strong>payment form</strong> before proceeding. <strong>All information provided</strong> must be <strong>HONEST</strong> and <strong>COMPLETE</strong>, as <strong>failure to comply may result</strong> in the <strong>FORFEITURE OF YOUR REGISTRATION,</strong> even if payment has already been made, and <strong>NO REFUND WILL BE ISSUED.</strong>
                    <br /><br />
                    <i className="fa-solid fa-link" style={{ marginRight: '0.35rem' }} /><a href="https://docs.google.com/document/d/1GDeKp0xexvj3g53Zhp-7PI9wgvMOcbZ67LCflV2AWX8/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Consent Form and Waiver Form</a>
                  </div>
                  <div className="waiver-steps">
                    <i className="fa-solid fa-arrow-right" style={{ marginRight: '0.4rem', color: 'var(--gold)' }} />Make a copy of the document, insert your signature with printed name, and upload the completed file below.
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Upload Consent & Waiver Form *</label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className={errors.waiver_file ? 'error' : ''}
                      key={form.waiver_file ? 'has-waiver' : 'empty-waiver'}
                      onChange={e => set('waiver_file', e.target.files[0] || null)}
                    />
                    {errors.waiver_file && <div className="field-error">{errors.waiver_file}</div>}
                    <FilePreview file={form.waiver_file} maxMB={10} fieldLabel="Consent/Waiver form" acceptPdf={true} />
                    <div className="field-hint">Accepted: .pdf only. Max 10 MB. 1 file only.</div>
                  </div>
                </div>
              )}

              <div className="step-nav">
                <button className="prev-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="next-btn" onClick={nextStep}>Continue → Payment</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === 3 && (
            <div>
              {/* Payment Agreement */}
              <div className="payment-agreement-box">
                <div className="payment-agreement-title">Payment Agreement</div>
                <div className="payment-agreement-text">
                  I acknowledge and agree to the payment requirements associated with my participation in the event <strong>"PUP Revo 2026: Sound Against Silence — A Benefit Concert for Safer Kids."</strong> I understand that I am given only <strong>twenty-four (24) hours</strong> from registration to complete my payment.
                  <br /><br />
                  I agree to upload a clear screenshot or proof of payment through the official channel designated by the organizers within the given time frame. <strong>Failure to submit proof of payment</strong> may result in my registration being considered incomplete and may <strong>lead to the forfeiture of my reserved slot.</strong>
                  <br /><br />
                  I further understand that <strong>ALL payments</strong> made are <strong>strictly non-refundable</strong>, except under circumstances expressly approved by the PUP Communication Society. I also acknowledge that the <strong>organizers will not be held liable for any fraudulent transactions</strong> made outside the official payment channels by the PUP Communication Society.
                  <br /><br />
                  I agree to comply with all payment guidelines, procedures, and instructions set by the organizers.
                </div>
                <div className="no-refund-list">
                  <strong>Strictly NO REFUND and NO TICKET if:</strong><br />
                  • Incorrect amount<br />
                  • Invalid reference number<br />
                  • Invalid proof of being a PUPian<br />
                  • Invalid or unclear screenshot
                </div>
                <div
                  className={`privacy-checkbox-row ${form.payment_agreement ? 'checked' : ''}`}
                  onClick={() => set('payment_agreement', !form.payment_agreement)}
                >
                  <div className="privacy-checkbox">
                    {form.payment_agreement && <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="privacy-checkbox-label">
                    I agree to the payment requirements, guidelines, and strict <span>no refund / no ticket policy</span>
                  </div>
                </div>
                {errors.payment_agreement && <div className="field-error" style={{ marginTop: '0.5rem' }}>{errors.payment_agreement}</div>}
              </div>

              <div className="field-group">
                <label>Payment Method *</label>
                <div className="payment-options">
                  {PAYMENT_OPTS.map(opt => (
                    <div
                      key={opt.key}
                      className={`payment-card ${form.payment_method === opt.key ? 'selected' : ''}`}
                      onClick={() => set('payment_method', opt.key)}
                    >
                      {opt.hasFee && <div className="payment-card-fee">+6% service fee</div>}
                      {!opt.hasFee && <div className="payment-card-free">No fee</div>}
                      <div className="payment-card-icon"><i className={opt.icon} /></div>
                      <div className="payment-card-name">{opt.name}</div>
                      <div className="payment-card-desc">{opt.desc}</div>
                    </div>
                  ))}
                </div>
                {errors.payment_method && <div className="field-error">{errors.payment_method}</div>}
              </div>

              {/* GCash payment proof */}
              {form.payment_method === 'gcash' && (
                <div className="payment-proof">
                  <div className="payment-proof-title"><i className="fa-solid fa-mobile-screen-button" style={{ marginRight: '0.4rem', color: '#4ade80' }} />GCash — Payment Proof</div>

                  <div style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.8rem',
                    color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.75rem',
                  }}>
                    Send <strong style={{ color: 'var(--cream)' }}>₱{totalAmount.toFixed(2)}</strong> to{' '}
                    <strong style={{ color: 'var(--gold)' }}>0995 418 5939 (John Benedict S.)</strong>
                    , then fill in the details below.
                    <br />
                    <span style={{ color: 'rgba(250,245,233,0.35)', fontSize: '0.75rem' }}>
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.3rem' }} />Upload your screenshot and reference number. Admin will verify and confirm your ticket within 24–48 hours.
                    </span>
                  </div>

                  <div style={{
                    background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)',
                    borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.78rem',
                    color: 'rgba(255,215,0,0.85)', lineHeight: 1.7, marginBottom: '1rem',
                  }}>
                    <div style={{ marginBottom: '0.3rem' }}><i className="fa-solid fa-circle-exclamation" style={{ marginRight: '0.4rem' }} /><strong>Please ensure that the reference number is clearly visible.</strong> Only image file submissions will be accepted.</div>
                    <div style={{ marginBottom: '0.3rem' }}><i className="fa-solid fa-file-signature" style={{ marginRight: '0.4rem' }} />Please rename your file using the format: <strong>PAYMENT_Last Name, First Name</strong></div>
                    <div style={{ color: 'rgba(255,215,0,0.65)', fontSize: '0.74rem', marginTop: '0.4rem', borderTop: '1px solid rgba(255,215,0,0.15)', paddingTop: '0.5rem' }}>
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }} />Note: The ticket price for online selling remains at {isPUPian ? 'Php 250' : 'Php 350'}. The additional 6% service fee serves as the fee for web services and convenience fee charged by GCash for online transactions.
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img
                      src={isPUPian ? '/gcashpuprevopupian.png' : '/gcashpuprevononpupian.png'}
                      alt="GCash QR Code"
                      style={{
                        width: '180px', height: '180px', objectFit: 'contain',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                        background: 'white', padding: '6px',
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'rgba(250,245,233,0.35)', marginTop: '0.4rem', fontFamily: 'Syne', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Scan to pay via GCash
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Reference Number *</label>
                    <input
                      className={errors.payment_reference ? 'error' : ''}
                      placeholder="e.g. 1234567890"
                      value={form.payment_reference}
                      onChange={e => set('payment_reference', e.target.value)}
                    />
                    {errors.payment_reference && <div className="field-error">{errors.payment_reference}</div>}
                    <div className="field-hint">Found in your GCash transaction history.</div>
                  </div>

                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label>Payment Screenshot *</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className={errors.payment_screenshot_file ? 'error' : ''}
                      key={form.payment_screenshot_file ? `ss-${form.payment_screenshot_file.name}` : 'ss-empty'}
                      onChange={e => set('payment_screenshot_file', e.target.files[0] || null)}
                    />
                    {errors.payment_screenshot_file && <div className="field-error">{errors.payment_screenshot_file}</div>}
                    <FilePreview file={form.payment_screenshot_file} maxMB={10} fieldLabel="payment screenshot" />
                    <div className="field-hint">Accepted: .png, .jpg, .jpeg, .webp only. Max 10 MB. 1 file only. Reference number must be clearly visible.</div>
                  </div>
                </div>
              )}

              {/* Walk-in instructions */}
              {form.payment_method === 'walk_in' && (
                <div className="walkin-info">
                  <div style={{ marginBottom: '0.75rem' }}>
                    <i className="fa-solid fa-school" style={{ marginRight: '0.5rem' }} /><strong>Walk-in Payment:</strong> Pay cash at the <strong>PUP REVO ticket booth</strong> before the event day. Your slot is reserved — bring your booking reference code when you pay. Slot is <strong>NOT confirmed</strong> until cash is received and confirmed. Payment must be settled within the <strong>SAME WEEK</strong> you selected this option; otherwise, your registration slot will be forfeited.
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,215,0,0.2)', paddingTop: '0.75rem' }}>
                    <i className="fa-brands fa-facebook-f" style={{ marginRight: '0.5rem' }} />
                    For the latest ticket selling dates and locations, follow our official Facebook page:{' '}
                    <a
                      href="https://www.facebook.com/pupcommsoc"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--gold)', fontWeight: 600 }}
                    >
                      facebook.com/pupcommsoc
                    </a>
                  </div>
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
                  disabled={loading || !form.payment_method || !form.payment_agreement}
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

          <div className="ticket-preview">
            <div className="ticket-preview-top">
              <div className="ticket-preview-event">PUP REVO 2026: SOUND AGAINST SILENCE</div>
              <div className="ticket-preview-date">June 20, 2026 · 9:00 AM · PUP Main Campus Oval, Manila</div>
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
              {!isPUPian && form.attendee_type && (
                <div className="ticket-preview-attendee">
                  {PUBLIC_ATTENDEE_OPTS.find(o => o.value === form.attendee_type)?.label || ''}
                </div>
              )}
              <hr className="ticket-divider" />
              <div style={{ fontSize: '0.72rem', color: 'rgba(250,245,233,0.3)', fontFamily: 'Syne', letterSpacing: '0.08em' }}>
                Admin will verify payment before confirming
              </div>
            </div>
          </div>

          <div className="breakdown">
            <div className="breakdown-row">
              <span>Base ticket price</span>
              <span>₱{form.ticket_price > 0 ? form.ticket_price.toFixed(2) : '0.00'}</span>
            </div>
            <div className="breakdown-row">
              <span className={serviceFee > 0 ? 'breakdown-fee' : ''}>
                Service fee
                {hasFee && ` (6% GCash)`}
              </span>
              <span className={serviceFee > 0 ? 'breakdown-fee' : ''}>
                {serviceFee > 0
                  ? `+₱${serviceFee.toFixed(2)}`
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
              <><i className="fa-solid fa-mobile-screen-button" style={{ marginRight: '0.4rem', color: '#4ade80' }} /><strong>GCash</strong> — Upload your screenshot and reference number. Admin will verify and confirm your ticket within 24–48 hours.</>
            )}
            {form.payment_method === 'walk_in' && (
              <><i className="fa-solid fa-school" style={{ marginRight: '0.4rem', color: 'var(--gold)' }} /><strong>Walk-in</strong> — Slot reserved. Pay cash at the PUP REVO ticket booth before event day. Present your booking reference. Slot is NOT confirmed until payment is received.</>
            )}
            {!form.payment_method && (
              <>Select a payment method to continue.</>
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
            <p>By registering and purchasing a ticket for PUP REVO 2026, you voluntarily consent to the collection, use, and processing of your personal data in accordance with this Privacy Policy.</p>
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
            <p>By accessing this website and purchasing tickets to PUP REVO 2026, you agree to be bound by the following Terms of Use.</p>
            <h3>1. General</h3>
            <p>This website is operated by the PUP Communication Society for the purpose of providing event information and facilitating ticket purchases for PUP REVO 2026: Sound Against Silence. By using this site, you confirm that you are at least 13 years of age and agree to these terms.</p>
            <h3>2. Ticket Purchase</h3>
            <p>All ticket purchases are subject to availability. By completing a purchase, you agree to provide accurate and truthful personal information. Each ticket is valid for one (1) person only and is non-transferable unless expressly permitted by the organizers.</p>
            <h3>3. No Refund Policy</h3>
            <p>All sales are final. Tickets are non-refundable and non-exchangeable under any circumstances except as required by applicable law.</p>
            <h3>4. Event Rules &amp; Conduct</h3>
            <p>Attendees are expected to observe proper conduct throughout the event. The organizers reserve the right to refuse admission or remove any attendee who violates event rules, poses a safety risk, or engages in disruptive behavior — without entitlement to a refund.</p>
            <h3>5. Intellectual Property</h3>
            <p>All content on this website is the property of the PUP Communication Society or its respective rights holders. Unauthorized reproduction, distribution, or commercial use is prohibited.</p>
            <h3>6. Limitation of Liability</h3>
            <p>The PUP Communication Society and its organizing members shall not be held liable for any loss, injury, or damage incurred during the event, unless caused by gross negligence on the part of the organizers.</p>
            <h3>7. Force Majeure</h3>
            <p>The organizers shall not be held liable for failure to fulfill obligations due to circumstances beyond their reasonable control, including but not limited to natural disasters, government directives, or public health emergencies.</p>
            <h3>8. Privacy</h3>
            <p>Your personal data is handled in accordance with our Privacy Policy and the Data Privacy Act of 2012 (R.A. 10173).</p>
            <h3>9. Amendments</h3>
            <p>The PUP Communication Society reserves the right to update or modify these Terms of Use at any time without prior notice.</p>
            <h3>10. Contact</h3>
            <p>For questions or concerns, please reach out to us at <a href="mailto:puprevo.commsoc@gmail.com" style={{ color: 'var(--gold)' }}>puprevo.commsoc@gmail.com</a>.</p>
            <button className="modal-close" onClick={() => setTermsOpen(false)}>Close</button>
          </div>
        </div>
      )}

    </>
  )
}
