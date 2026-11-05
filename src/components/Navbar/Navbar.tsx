import { useState, useRef, useEffect, type MouseEvent } from 'react'
import gsap from 'gsap'
import ShaderCanvas from './ShaderCanvas'
import './Navbar.css'

interface NavItem {
  id: string
  label: string
  href: string
  index: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'works', label: 'Works', href: '#works', index: '01' },
  { id: 'studio', label: 'Studio', href: '#studio', index: '02' },
  { id: 'archive', label: 'Archive', href: '#archive', index: '03' },
  { id: 'contact', label: 'Contact', href: '#contact', index: '04' },
]

export default function Navbar() {
  const [activeId, setActiveId] = useState('works')
  const [isHovered, setIsHovered] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }
    return true
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navListRef = useRef<HTMLUListElement | null>(null)
  const logoRef = useRef<HTMLAnchorElement | null>(null)

  // Sync theme changes with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // GSAP Hover Handlers for Links: Text sliding up animation & sibling focus
  const handleLinkMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    setIsHovered(true)
    const targetLink = e.currentTarget
    const primaryText = targetLink.querySelector('.nav-link-text.primary')
    const secondaryText = targetLink.querySelector('.nav-link-text.secondary')

    // Kinetic dual-text sliding up roll
    if (primaryText && secondaryText) {
      gsap.killTweensOf([primaryText, secondaryText])
      gsap.to(primaryText, {
        y: '-100%',
        opacity: 0.15,
        duration: 0.38,
        ease: 'power3.inOut',
      })
      gsap.to(secondaryText, {
        y: '0%',
        opacity: 1,
        duration: 0.38,
        ease: 'power3.inOut',
      })
    }

    // Attenuate sibling links for refined focus
    if (navListRef.current) {
      const allLinks = navListRef.current.querySelectorAll('.nav-link')
      allLinks.forEach((link) => {
        if (link !== targetLink) {
          gsap.to(link, {
            opacity: 0.35,
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      })
    }
  }

  const handleLinkMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    setIsHovered(false)
    const targetLink = e.currentTarget
    const primaryText = targetLink.querySelector('.nav-link-text.primary')
    const secondaryText = targetLink.querySelector('.nav-link-text.secondary')

    // Reset kinetic text slide
    if (primaryText && secondaryText) {
      gsap.killTweensOf([primaryText, secondaryText])
      gsap.to(primaryText, {
        y: '0%',
        opacity: 1,
        duration: 0.38,
        ease: 'power3.inOut',
      })
      gsap.to(secondaryText, {
        y: '100%',
        opacity: 0,
        duration: 0.38,
        ease: 'power3.inOut',
      })
    }

    // Reset all sibling links to full opacity
    if (navListRef.current) {
      const allLinks = navListRef.current.querySelectorAll('.nav-link')
      gsap.to(allLinks, {
        opacity: 1.0,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }

  // Refined logo hover
  const handleLogoMouseEnter = () => {
    setIsHovered(true)
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        opacity: 0.72,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }

  const handleLogoMouseLeave = () => {
    setIsHovered(false)
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        opacity: 1.0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  return (
    <>
      {/* Background GLSL Shader Canvas for subtle radial optical displacement */}
      <ShaderCanvas isHovered={isHovered} isDarkMode={isDark} />

      <header className="navbar-header" role="banner">
        <div className="navbar-inner">
          {/* Leftmost side: Enlarged metastab SVG signature logo */}
          <a
            ref={logoRef}
            href="#"
            className="navbar-logo-link"
            aria-label="Metastab Home"
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
          >
            <img
              src="/metastab.svg"
              alt="metastab"
              className="navbar-logo-img logo-light"
            />
            <img
              src="/metastab_v2.svg"
              alt="metastab"
              className="navbar-logo-img logo-dark"
            />
          </a>

          {/* Mobile hamburger trigger */}
          <button
            className={`nav-mobile-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
          </button>

          {/* Right side: Navigation links aligned horizontally */}
          <nav
            className={`navbar-nav ${mobileMenuOpen ? 'is-open' : ''}`}
            role="navigation"
            aria-label="Main Navigation"
          >
            <ul ref={navListRef} className="navbar-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="navbar-item">
                  <a
                    href={item.href}
                    data-nav-id={item.id}
                    data-active={activeId === item.id}
                    className={`nav-link ${activeId === item.id ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveId(item.id)
                      setMobileMenuOpen(false)
                    }}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                  >
                    <span className="nav-link-index" aria-hidden="true">
                      {item.index}
                    </span>
                    <span className="nav-link-track">
                      <span className="nav-link-text primary">{item.label}</span>
                      <span className="nav-link-text secondary" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}

              {/* Discreet theme toggle */}
              <li className="navbar-item">
                <button
                  type="button"
                  className="nav-theme-toggle"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                  title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
