import { useState, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import gsap from 'gsap'
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

  // Sync theme changes with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  // --- Creative GSAP micro-interactions for nav links ---
  const handleLinkMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia('(hover: none)').matches) return

    const link = e.currentTarget
    const rect = link.getBoundingClientRect()
    // Direction awareness: did cursor enter from left or right?
    const isFromLeft = e.clientX - rect.left < rect.width / 2

    const line = link.querySelector<HTMLElement>('.nav-link-line')

    // 1. Directional hairline drawing
    if (line) {
      gsap.killTweensOf(line)
      gsap.set(line, { transformOrigin: isFromLeft ? 'left center' : 'right center' })
      gsap.to(line, {
        scaleX: 1,
        duration: 0.32,
        ease: 'power2.out',
      })
    }

    // 2. Sibling focus attenuation
    if (navListRef.current) {
      const siblings = Array.from(
        navListRef.current.querySelectorAll<HTMLElement>('.nav-link')
      ).filter((item) => item !== link)
      gsap.killTweensOf(siblings)
      gsap.to(siblings, {
        opacity: 0.35,
        duration: 0.28,
        ease: 'power2.out',
      })
      gsap.to(link, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }

  const handleLinkMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia('(hover: none)').matches) return

    const link = e.currentTarget
    const rect = link.getBoundingClientRect()
    // Direction awareness: exit towards left or right
    const isToRight = e.clientX - rect.left >= rect.width / 2

    const line = link.querySelector<HTMLElement>('.nav-link-line')

    // Directional hairline collapse forward
    if (line) {
      gsap.killTweensOf(line)
      gsap.set(line, { transformOrigin: isToRight ? 'right center' : 'left center' })
      gsap.to(line, {
        scaleX: 0,
        duration: 0.26,
        ease: 'power2.inOut',
      })
    }
  }

  const handleNavListMouseLeave = () => {
    if (window.matchMedia('(hover: none)').matches) return
    if (!navListRef.current) return

    const links = navListRef.current.querySelectorAll<HTMLElement>('.nav-link')
    gsap.killTweensOf(links)
    gsap.to(links, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveId(id)
    setMobileMenuOpen(false)

    // Tactile micro-spring on selection
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.35, ease: 'back.out(2)' }
    )
  }

  return (
    <header className="navbar-header" role="banner">
      <div className="navbar-inner">
        {/* Leftmost side: metastab SVG signature logo */}
        <a
          href="#"
          className="navbar-logo-link"
          aria-label="Metastab Home"
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

        {/* Right side: navigation and action controls */}
        <div className="navbar-actions">
          <nav
            className={`navbar-nav ${mobileMenuOpen ? 'is-open' : ''}`}
            role="navigation"
            aria-label="Main Navigation"
          >
            <ul
              ref={navListRef}
              className="navbar-list"
              onMouseLeave={handleNavListMouseLeave}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id
                return (
                  <li key={item.id} className="navbar-item">
                    <a
                      href={item.href}
                      data-nav-id={item.id}
                      data-active={isActive}
                      className={`nav-link ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={handleLinkMouseEnter}
                      onMouseLeave={handleLinkMouseLeave}
                      onClick={(e) => handleLinkClick(e, item.id)}
                    >
                      <span className="nav-link-index" aria-hidden="true">
                        {item.index}
                      </span>
                      <span className="nav-link-label-wrap">
                        <span className="nav-link-label">{item.label}</span>
                        <span className="nav-link-line" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Controls: theme toggle and mobile menu toggle */}
          <div className="navbar-controls">
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

            {/* Mobile hamburger trigger */}
            <button
              className={`nav-mobile-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
