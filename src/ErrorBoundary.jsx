// src/ErrorBoundary.jsx
import { Component } from 'react'

const css = `
  .eb-wrap {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,48,0.16) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,215,0,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 10% 50%, rgba(26,79,214,0.14) 0%, transparent 60%),
      #060D1F;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    color: #FAF5E9;
    text-align: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .eb-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(26,79,214,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,79,214,0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: ebGridDrift 20s linear infinite;
    pointer-events: none;
  }
  @keyframes ebGridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

  .eb-content {
    position: relative;
    z-index: 1;
    max-width: 480px;
  }

  .eb-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(250,245,233,0.4);
    margin-bottom: 1rem;
  }

  .eb-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 1;
    color: #FF3B30;
    margin-bottom: 0.5rem;
  }

  .eb-sub {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    color: #FAF5E9;
    margin-bottom: 1.25rem;
    line-height: 1.1;
  }

  .eb-desc {
    font-size: 0.9rem;
    color: rgba(250,245,233,0.5);
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .eb-btn {
    background: #FF3B30;
    color: white;
    border: none;
    padding: 0.9rem 2.5rem;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(255,59,48,0.35);
    transition: opacity 0.15s;
  }
  .eb-btn:hover { opacity: 0.88; }

  .eb-divider {
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, #FF3B30, #FFD700);
    border-radius: 2px;
    margin: 0 auto 1.5rem;
  }
`

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <style>{css}</style>
          <div className="eb-wrap">
            <div className="eb-grid" />
            <div className="eb-content">
              <div className="eb-label">PUP REVO 2026 — System Error</div>
              <div className="eb-title">Oops!</div>
              <div className="eb-sub">Something Went Wrong</div>
              <div className="eb-divider" />
              <p className="eb-desc">
                An unexpected error occurred. Please click the button below to try again.
                If the problem persists, refresh the page or come back later.
              </p>
              <button className="eb-btn" onClick={() => window.location.reload()}>
                ↺ &nbsp; Try Again
              </button>
            </div>
          </div>
        </>
      )
    }

    return this.props.children
  }
}
