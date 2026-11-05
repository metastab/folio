import Navbar from './components/Navbar/Navbar'
import SocialLinks from './components/SocialLinks/SocialLinks'
import './App.css'

export default function App() {
  return (
    <div className="folio-layout">
      <Navbar />
      <SocialLinks />

      <main className="folio-main">
        <section className="hero-section">
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
        </section>
      </main>
    </div>
  )
}
