import { useEffect, useState } from 'react'
import './Throbber.css'

interface ThrobberProps {
  minDurationMs?: number
  onComplete?: () => void
}

export default function Throbber({ minDurationMs = 1000, onComplete }: ThrobberProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    let unmountTimer: ReturnType<typeof setTimeout> | undefined

    // Helper to safely preload critical visual assets
    const preloadImage = (src: string): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = src
        if (img.complete) {
          resolve()
        } else {
          img.onload = () => resolve()
          img.onerror = () => resolve() // Continue gracefully even if image fails
        }
      })

    // 1. Font loading check
    const fontsPromise =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve()

    // 2. Critical asset checks (Metastab hero SVGs)
    const imagesPromise = Promise.all([
      preloadImage('/metastab.svg'),
      preloadImage('/metastab_v2.svg'),
    ])

    // 3. Document readiness
    const domReadyPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', () => resolve(), { once: true })
      }
    })

    // Timeout safety net (max 4.5s) to prevent indefinite blocking
    const safetyNetPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, 4500)
    })

    // Await either all elements loaded or safety timeout
    const assetsReadyPromise = Promise.race([
      Promise.all([fontsPromise, imagesPromise, domReadyPromise]),
      safetyNetPromise,
    ])

    assetsReadyPromise.then(() => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDurationMs - elapsed)

      fadeTimer = setTimeout(() => {
        setIsFading(true)

        // Allow smooth CSS fade-out transition before unmounting
        unmountTimer = setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 600)
      }, remainingTime)
    })

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer)
      if (unmountTimer) clearTimeout(unmountTimer)
    }
  }, [minDurationMs, onComplete])

  if (!isVisible) return null

  // Closed architectural "M" loop: 10 precision line segments
  const iconPath =
    'M 16 66 L 16 18 L 40 42 L 64 18 L 64 66 L 52 66 L 52 36 L 40 48 L 28 36 L 28 66 Z'

  return (
    <div
      className={`throbber-overlay ${isFading ? 'is-fading' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Metastab"
    >
      <div className="throbber-content">
        <div className="throbber-icon-wrap">
          <svg
            className="throbber-svg"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base static outline track */}
            <path
              d={iconPath}
              className="throbber-track"
              pathLength={100}
            />

            {/* Traveling color segment tracing the outline */}
            <path
              d={iconPath}
              className="throbber-tracer"
              pathLength={100}
            />
          </svg>
        </div>

        <span className="throbber-label">Metastab</span>
      </div>
    </div>
  )
}
