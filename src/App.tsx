import Navbar from './components/Navbar/Navbar'
import SocialLinks from './components/SocialLinks/SocialLinks'
import VinylPlayer from './components/VinylPlayer/VinylPlayer'
import './App.css'

export default function App() {
  return (
    <div className="folio-layout">
      <Navbar />
      <SocialLinks />

      <main className="folio-main">
        <section className="hero-section">
          {/* Left Column: Brand & Editorial Statement */}
          <div className="hero-content">
            <span className="hero-eyebrow">Design & Engineering</span>

            <div className="hero-logo-container">
              <h1 className="sr-only">Metastab</h1>
              <img
                src="/metastab.svg"
                alt="Metastab"
                className="hero-logo-img logo-light"
              />
              <img
                src="/metastab_v2.svg"
                alt="Metastab"
                className="hero-logo-img logo-dark"
              />
            </div>

            <p className="hero-subline">
              Specializing in high-craft interactive systems, game development, and system architecture.
            </p>
          </div>

          {/* Right Column: Slow-spinning SVG Vinyl Turntable Player */}
          <div className="hero-player-wrap">
            <VinylPlayer />
          </div>
        </section>
      </main>

      {/* Centered Scroll Indicator at bottom of screen */}
      <div className="scroll-indicator" role="presentation" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span className="scroll-indicator-text">scroll to reveal</span>
      </div>
    </div>
  )
}
