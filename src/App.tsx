import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar/Navbar'
import SocialLinks from './components/SocialLinks/SocialLinks'
import VinylPlayer from './components/VinylPlayer/VinylPlayer'
import Throbber from './components/Throbber/Throbber'
import AboutSection from './components/AboutSection/AboutSection'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

interface DockMetrics {
  fromX: number
  fromY: number
  toX: number
  toY: number
  toScale: number
}

export default function App() {
  const heroPageRef = useRef<HTMLElement | null>(null)
  const heroSlotRef = useRef<HTMLDivElement | null>(null)
  const dockStageRef = useRef<HTMLDivElement | null>(null)
  const metricsRef = useRef<DockMetrics>({
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    toScale: 1,
  })
  const refreshRafRef = useRef(0)

  useLayoutEffect(() => {
    const heroPage = heroPageRef.current
    const heroSlot = heroSlotRef.current
    const dockStage = dockStageRef.current
    if (!heroPage || !heroSlot || !dockStage) return

    const computeDockMetrics = (): DockMetrics => {
      const slotRect = heroSlot.getBoundingClientRect()
      const slotW = Math.max(1, slotRect.width)
      const slotH = Math.max(1, slotRect.height)

      // Match fixed stage container size to Hero slot once outside scroll scrub
      dockStage.style.width = `${slotW}px`
      dockStage.style.height = `${slotH}px`

      // Hero slot rest center at scrollY = 0
      const heroCenterX = slotRect.left + window.scrollX + slotW / 2
      const heroCenterY = slotRect.top + window.scrollY + slotH / 2
      const fromX = heroCenterX - slotW / 2
      const fromY = heroCenterY - slotH / 2

      const vw = document.documentElement.clientWidth || window.innerWidth
      const vh = document.documentElement.clientHeight || window.innerHeight
      const isMobile = vw <= 768

      // Align docked vinyl center X with the vertical social links axis on the right rail
      const rail = document.querySelector('.social-rail')
      let railCenterX = vw - (isMobile ? 24 : 76)
      let railBottom = isMobile ? 260 : 280

      if (rail) {
        const railRect = rail.getBoundingClientRect()
        railCenterX = railRect.left + railRect.width / 2
        railBottom = railRect.bottom
      }

      // Inside VinylPlayer (viewBox 480x480), platter diameter is 360px (75% of box),
      // with disk center at x=210/480 (0.4375) and tonearm extending +0.46875*box to the right.
      const targetDiskDia = isMobile
        ? 48
        : Math.min(62, Math.max(52, vw * 0.04))
      const targetBoxSize = targetDiskDia / 0.75
      const toScale = targetBoxSize / slotW

      // Ensure 100% of minimized turntable stays completely visible inside viewport
      const rightOverhang = targetBoxSize * 0.46875
      const safeEdgePad = isMobile ? 14 : 18
      const maxAllowedCenterX = vw - safeEdgePad - rightOverhang
      const dockDiskCenterX = Math.min(railCenterX, maxAllowedCenterX)

      // Dock cleanly near bottom of viewport (32px–48px margin on desktop) strictly below social icons
      const bottomPad = isMobile ? 22 : Math.min(48, Math.max(32, vh * 0.044))
      const diskRadius = targetDiskDia / 2
      const idealDiskCenterY = vh - bottomPad - diskRadius
      const minBelowRailY = railBottom + diskRadius + (isMobile ? 16 : 24)
      const dockDiskCenterY = Math.min(
        vh - 14 - diskRadius,
        Math.max(minBelowRailY, idealDiskCenterY)
      )

      // Offset SVG box center so the spinning disk center aligns with dockDiskCenterX
      const dockBoxCenterX = dockDiskCenterX + targetBoxSize * 0.0625
      const dockBoxCenterY = dockDiskCenterY

      const toX = dockBoxCenterX - slotW / 2
      const toY = dockBoxCenterY - slotH / 2

      return { fromX, fromY, toX, toY, toScale }
    }

    metricsRef.current = computeDockMetrics()

    const ctx = gsap.context(() => {
      const dockTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroPage,
          start: 'top top',
          end: () => `+=${Math.max(320, heroPage.offsetHeight * 0.85)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            metricsRef.current = computeDockMetrics()
          },
          onUpdate: (self) => {
            dockStage.classList.toggle('is-docked', self.progress > 0.85)
          },
        },
      })

      dockTl.fromTo(
        dockStage,
        {
          x: () => metricsRef.current.fromX,
          y: () => metricsRef.current.fromY,
          scale: 1,
          transformOrigin: 'center center',
        },
        {
          x: () => metricsRef.current.toX,
          y: () => metricsRef.current.toY,
          scale: () => metricsRef.current.toScale,
          ease: 'power2.inOut',
          immediateRender: true,
        }
      )
    })

    const scheduleRefresh = () => {
      if (refreshRafRef.current) cancelAnimationFrame(refreshRafRef.current)
      refreshRafRef.current = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }

    // Re-sync after fonts load or if hero/social rail dimensions shift
    const fontsReady = document.fonts?.ready
    if (fontsReady) {
      fontsReady.then(scheduleRefresh)
    }

    let observer: ResizeObserver | null = null
    let railMutationObserver: MutationObserver | null = null
    const socialRail = document.querySelector('.social-rail')

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleRefresh)
      observer.observe(heroSlot)
      if (socialRail) observer.observe(socialRail)
    }

    if (socialRail && typeof MutationObserver !== 'undefined') {
      railMutationObserver = new MutationObserver(scheduleRefresh)
      railMutationObserver.observe(socialRail, {
        attributes: true,
        attributeFilter: ['style'],
      })
    }

    return () => {
      if (refreshRafRef.current) cancelAnimationFrame(refreshRafRef.current)
      observer?.disconnect()
      railMutationObserver?.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div className="folio-layout">
      {/* Architectural preloader screen with outline tracer */}
      <Throbber minDurationMs={1000} />

      <Navbar />
      <SocialLinks />

      {/* Persistent VinylPlayer mount — never unmounts or resets playback across scroll */}
      <div className="vinyl-dock-stage" ref={dockStageRef}>
        <VinylPlayer />
      </div>

      <main className="folio-main">
        {/* Page 1: Hero Viewport */}
        <section className="hero-page" ref={heroPageRef}>
          <div className="hero-page-inner">
            <div className="hero-section">
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

              {/* Right Column Layout Slot: reserves exact Hero space for persistent VinylPlayer */}
              <div className="hero-player-wrap">
                <div
                  className="hero-player-slot"
                  ref={heroSlotRef}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Centered Scroll Indicator anchored to bottom of Page 1 */}
          <div className="scroll-indicator" role="presentation" aria-hidden="true">
            <div className="scroll-indicator-line" />
            <span className="scroll-indicator-text">scroll to reveal</span>
          </div>
        </section>

        {/* Page 2: About Me Section */}
        <AboutSection />
      </main>
    </div>
  )
}
