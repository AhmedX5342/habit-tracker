import { useState } from 'react'
import { getRandomQuote, type Quote } from '../utils/quotes'

export default function Support() {
  const [copied, setCopied] = useState(false)
  const [footerQuote] = useState(getRandomQuote())

  const copyEmail = () => {
    navigator.clipboard.writeText('ahmed.aaaeg@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="support-container">
      <div className="support-header">
        <h2>Support & Contact</h2>
        <p>Building better habits, one day at a time</p>
      </div>

      {/* Mission Statement */}
      <div className="support-card mission">
        <div className="support-card-icon">🎯</div>
        <h3>Our Mission</h3>
        <p>
          Discipline Tracker is designed to help you break free from addictions
          and build lasting, positive habits. Every small victory is a step
          toward becoming the best version of yourself.
        </p>
      </div>

      {/* Contact Section */}
      <div className="support-card">
        <div className="support-card-icon">📧</div>
        <h3>Report an Issue</h3>
        <p>
          Found a bug or have a suggestion? We'd love to hear from you.
          Send us an email and we'll get back to you as soon as possible.
        </p>
        <div className="email-box">
          <span className="email-address">ahmed.aaaeg@gmail.com</span>
          <button className="copy-btn" onClick={copyEmail}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="support-card">
        <div className="support-card-icon">🌟</div>
        <h3>Open Source</h3>
        <p>
          Discipline Tracker is completely open source and free to use.
          Anyone can contribute to make it better.
        </p>
        <a
          href="https://github.com/AhmedX5342/discipline-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
            <img src="/github.svg" alt="GitHub" width={20} height={20} />
          github.com/AhmedX5342/discipline-tracker
        </a>
      </div>

      {/* Status Section */}
      <div className="support-card">
        <div className="support-card-icon">🔨</div>
        <h3>Status</h3>
        <p>
          Discipline Tracker is currently in active development. We are currently working on adding the app to the google play store. Your feedback and contributions are invaluable to us.
        </p>
      </div>

      {/* Why This App */}
      <div className="support-card">
        <div className="support-card-icon">❤️</div>
        <h3>Why Discipline Tracker?</h3>
        <ul className="features-list">
          <li>✨ Completely free — no ads, no subscriptions</li>
          <li>🔒 Private — your data stays on your device</li>
          <li>📱 Works offline — track anywhere, anytime</li>
          <li>📊 Detailed insights — see your progress over time</li>
          <li>🔄 Cross-platform — web and Android</li>
        </ul>
      </div>

      {/* Quote Footer */}
      <div className="quote-footer">
        <p>“{footerQuote?.text}”</p>
        <span>— {footerQuote?.author}</span>
      </div>
    </div>
  )
}