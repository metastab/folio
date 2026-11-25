import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ABOUT_COLLAGE_ITEMS,
  type CollageMediaItem,
  type PlaceholderVariant,
} from './aboutMedia'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const CYCLING_PHRASES = ['a game', 'a tool', 'an idea'] as const

const INTRO_SENTENCE = 'my name is Bablu Kumar AKA metastab & this is who I am.'
const ACCENT_WORDS = new Set(['Bablu', 'Kumar', 'metastab'])

function renderPlaceholderVisual(variant: PlaceholderVariant, isVideo: boolean) {
  switch (variant) {
    case 'architecture':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 300 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.75" fill="none">
              <line x1="60" y1="0" x2="60" y2="400" />
              <line x1="150" y1="0" x2="150" y2="400" />
              <line x1="240" y1="0" x2="240" y2="400" />
              <line x1="0" y1="100" x2="300" y2="100" />
              <line x1="0" y1="200" x2="300" y2="200" />
              <line x1="0" y1="300" x2="300" y2="300" />
            </g>
            <g stroke="currentColor" strokeOpacity="0.34" strokeWidth="1" fill="none">
              <rect x="60" y="90" width="180" height="220" />
              <line x1="60" y1="90" x2="240" y2="310" strokeOpacity="0.18" />
              <circle cx="150" cy="200" r="56" strokeOpacity="0.28" />
              <circle cx="150" cy="200" r="3" fill="currentColor" fillOpacity="0.45" stroke="none" />
            </g>
          </svg>
        </div>
      )

    case 'wave':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 320 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-wave-group" stroke="currentColor" strokeWidth="1" fill="none">
              <path d="M -20 75 Q 60 35, 160 75 T 340 75" strokeOpacity="0.18" />
              <path d="M -20 92 Q 60 52, 160 92 T 340 92" strokeOpacity="0.35" />
              <path d="M -20 109 Q 60 69, 160 109 T 340 109" strokeOpacity="0.45" />
              <path d="M -20 126 Q 60 86, 160 126 T 340 126" strokeOpacity="0.22" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )

    case 'orbit':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 280 300"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" fill="none">
              <circle cx="140" cy="145" r="88" strokeOpacity="0.16" strokeWidth="0.8" />
              <circle cx="140" cy="145" r="58" strokeOpacity="0.32" strokeWidth="0.9" strokeDasharray="4 4" />
              <ellipse
                cx="140"
                cy="145"
                rx="96"
                ry="34"
                transform="rotate(-28 140 145)"
                strokeOpacity="0.26"
                strokeWidth="0.85"
              />
              <circle cx="140" cy="145" r="4" fill="currentColor" fillOpacity="0.55" stroke="none" />
            </g>
          </svg>
        </div>
      )

    case 'topography':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 240 300"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-topo-group" stroke="currentColor" fill="none" strokeWidth="0.9">
              <circle cx="120" cy="150" r="24" strokeOpacity="0.45" />
              <circle cx="120" cy="150" r="46" strokeOpacity="0.32" />
              <circle cx="120" cy="150" r="70" strokeOpacity="0.2" />
              <circle cx="120" cy="150" r="96" strokeOpacity="0.12" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )

    case 'lattice':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 320 260"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.75" fill="none">
              <path d="M 40 30 L 280 30 M 40 80 L 280 80 M 40 130 L 280 130 M 40 180 L 280 180 M 40 230 L 280 230" />
              <path d="M 60 15 L 60 245 M 110 15 L 110 245 M 160 15 L 160 245 M 210 15 L 210 245 M 260 15 L 260 245" />
              <rect x="110" y="80" width="100" height="100" strokeOpacity="0.48" strokeWidth="1" />
            </g>
          </svg>
        </div>
      )

    case 'aperture':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 280 280"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-orbit-rotator" stroke="currentColor" fill="none" strokeWidth="0.9">
              <polygon points="140,42 225,92 225,188 140,238 55,188 55,92" strokeOpacity="0.28" />
              <polygon points="140,70 200,140 140,210 80,140" strokeOpacity="0.42" />
              <circle cx="140" cy="140" r="22" strokeOpacity="0.3" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )

    case 'prism':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 300 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" fill="none" strokeWidth="0.95">
              <polygon points="150,70 245,250 55,250" strokeOpacity="0.34" />
              <polygon points="150,120 220,250 150,320 80,250" strokeOpacity="0.22" />
              <line x1="150" y1="70" x2="150" y2="320" strokeOpacity="0.26" />
            </g>
          </svg>
        </div>
      )

    case 'waveform':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 320 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-wave-group" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none">
              <line x1="56" y1="84" x2="56" y2="116" strokeOpacity="0.25" />
              <line x1="76" y1="68" x2="76" y2="132" strokeOpacity="0.35" />
              <line x1="96" y1="54" x2="96" y2="146" strokeOpacity="0.45" />
              <line x1="116" y1="76" x2="116" y2="124" strokeOpacity="0.3" />
              <line x1="136" y1="42" x2="136" y2="158" strokeOpacity="0.52" />
              <line x1="156" y1="62" x2="156" y2="138" strokeOpacity="0.38" />
              <line x1="176" y1="48" x2="176" y2="152" strokeOpacity="0.48" />
              <line x1="196" y1="70" x2="196" y2="130" strokeOpacity="0.32" />
              <line x1="216" y1="58" x2="216" y2="142" strokeOpacity="0.4" />
              <line x1="236" y1="78" x2="236" y2="122" strokeOpacity="0.28" />
              <line x1="256" y1="88" x2="256" y2="112" strokeOpacity="0.2" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )

    case 'blueprint':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 260 320"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" fill="none" strokeWidth="0.85">
              <rect x="44" y="54" width="172" height="212" strokeOpacity="0.24" strokeDasharray="3 3" />
              <rect x="74" y="94" width="112" height="132" strokeOpacity="0.4" />
              <path d="M 44 160 L 216 160 M 130 54 L 130 266" strokeOpacity="0.16" />
              <circle cx="130" cy="160" r="28" strokeOpacity="0.36" />
            </g>
          </svg>
        </div>
      )

    case 'pendulum':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 280 290"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-topo-group" stroke="currentColor" fill="none" strokeWidth="0.9">
              <path d="M 40 220 Q 140 80, 240 220" strokeOpacity="0.25" />
              <path d="M 40 200 Q 140 120, 240 200" strokeOpacity="0.38" />
              <line x1="140" y1="36" x2="140" y2="195" strokeOpacity="0.24" />
              <circle cx="140" cy="195" r="10" strokeOpacity="0.5" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )

    case 'mesh':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 320 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.8" fill="none">
              <path d="M 20 140 C 80 110, 120 160, 180 110 C 230 70, 270 100, 300 70" />
              <path d="M 20 160 C 80 130, 120 180, 180 130 C 230 90, 270 120, 300 90" strokeOpacity="0.42" />
              <path d="M 20 120 C 80 90, 120 140, 180 90 C 230 50, 270 80, 300 50" strokeOpacity="0.18" />
            </g>
          </svg>
        </div>
      )

    case 'pulse':
      return (
        <div className="collage-placeholder" aria-hidden="true">
          <svg
            className="collage-placeholder-svg"
            viewBox="0 0 240 300"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="collage-topo-group" stroke="currentColor" fill="none">
              <circle cx="120" cy="150" r="16" strokeOpacity="0.52" strokeWidth="1" />
              <circle cx="120" cy="150" r="42" strokeOpacity="0.34" strokeWidth="0.85" />
              <circle cx="120" cy="150" r="76" strokeOpacity="0.18" strokeWidth="0.75" strokeDasharray="2 4" />
              <circle cx="120" cy="150" r="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
            </g>
          </svg>
          {isVideo && <div className="collage-video-sweep" />}
        </div>
      )
  }
}

interface CollageFrameProps {
  item: CollageMediaItem
}

function CollageFrame({ item }: CollageFrameProps) {
  const [hasError, setHasError] = useState(false)
  const hasRealSrc = Boolean(item.src) && !hasError

  return (
    <figure
      className={`collage-frame ${item.slotClass}`}
      data-enter-y={item.enterOffsetY}
      data-parallax-y={item.parallaxEndY}
    >
      {hasRealSrc ? (
        item.type === 'video' ? (
          <video
            className="collage-media"
            src={item.src}
            poster={item.poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            aria-label={item.alt}
            onError={() => setHasError(true)}
          />
        ) : (
          <img
            className="collage-media"
            src={item.src}
            alt={item.alt}
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )
      ) : (
        renderPlaceholderVisual(item.placeholder, item.type === 'video')
      )}

      <figcaption className="collage-frame-tag">
        {item.type === 'video' && <span className="collage-live-dot" aria-hidden="true" />}
        <span>{item.tag}</span>
      </figcaption>
    </figure>
  )
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const collageStageRef = useRef<HTMLDivElement | null>(null)
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const introParagraphRef = useRef<HTMLParagraphElement | null>(null)

  // Zone 2: Independent GSAP kinetic shuffling loop (NO ScrollTrigger effect)
  useEffect(() => {
    const phraseEls = phraseRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null
    )
    if (phraseEls.length < 2) return

    const ctx = gsap.context(() => {
      let currentIdx = 0
      let loopCall: gsap.core.Tween | null = null

      phraseEls.forEach((el, idx) => {
        gsap.set(el, {
          yPercent: idx === 0 ? 0 : 115,
          opacity: idx === 0 ? 1 : 0,
        })
      })

      const scheduleNextSwap = () => {
        loopCall = gsap.delayedCall(2.4, () => {
          const nextIdx = (currentIdx + 1) % phraseEls.length
          const outgoingEl = phraseEls[currentIdx]
          const incomingEl = phraseEls[nextIdx]

          gsap
            .timeline({
              onComplete: () => {
                currentIdx = nextIdx
                scheduleNextSwap()
              },
            })
            .to(outgoingEl, {
              yPercent: -115,
              opacity: 0,
              duration: 0.65,
              ease: 'power3.inOut',
            })
            .fromTo(
              incomingEl,
              { yPercent: 115, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power3.out',
              },
              '<0.08'
            )
        })
      }

      scheduleNextSwap()

      return () => {
        loopCall?.kill()
      }
    })

    return () => {
      ctx.revert()
    }
  }, [])

  // Zones 1 & 3: GSAP ScrollTrigger staggered parallax & intro reveal across 235vh+
  useLayoutEffect(() => {
    const section = sectionRef.current
    const collageStage = collageStageRef.current
    const introParagraph = introParagraphRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Zone 1: Per-card staggered vertical entrance & parallax glide across 235vh+
      if (collageStage) {
        const frames = Array.from(
          collageStage.querySelectorAll<HTMLElement>('.collage-frame')
        )

        frames.forEach((frame) => {
          const enterY = Number(frame.dataset.enterY ?? 95)
          const parallaxEndY = Number(frame.dataset.parallaxY ?? -55)

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: 'top 96%',
              end: 'bottom 10%',
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          })

          cardTl
            .fromTo(
              frame,
              { y: () => enterY },
              { y: () => parallaxEndY, ease: 'none', duration: 1 },
              0
            )
            .fromTo(
              frame,
              { opacity: 0 },
              { opacity: 1, ease: 'power1.out', duration: 0.28 },
              0
            )
        })
      }

      // Zone 3: Word-by-word scrubbed opacity reveal tied to Page 2 entrance scroll progress
      if (introParagraph) {
        const words = introParagraph.querySelectorAll<HTMLElement>('.intro-word')
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                end: 'top 12%',
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          )
        }
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  const introWords = INTRO_SENTENCE.split(' ')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-inner">
        {/* Zone 1: Left Column — 12-Item Asymmetrical Collage Runway (215vh+) */}
        <div className="about-collage-col">
          <div className="collage-stage" ref={collageStageRef}>
            {ABOUT_COLLAGE_ITEMS.map((item) => (
              <CollageFrame key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Typography Stack staying framed during 235vh+ scroll */}
        <div className="about-copy-col">
          <div className="about-copy-sticky">
            {/* Zone 2: Top Right — Independent Kinetic Shuffling Headline */}
            <div className="about-headline-zone">
              <span className="about-eyebrow">About</span>

              <h2 id="about-heading" className="about-kinetic-headline">
                <span className="sr-only">
                  Sometimes it&apos;s a game, a tool, or an idea.
                </span>
                <span className="kinetic-prefix" aria-hidden="true">
                  Sometimes it&apos;s
                </span>
                <span className="kinetic-mask" aria-hidden="true">
                  <span className="kinetic-sizer">an idea</span>
                  {CYCLING_PHRASES.map((phrase, idx) => (
                    <span
                      key={phrase}
                      ref={(el) => {
                        phraseRefs.current[idx] = el
                      }}
                      className="kinetic-phrase"
                    >
                      {phrase}
                    </span>
                  ))}
                </span>
              </h2>
            </div>

            {/* Zone 3: Bottom Right — ScrollTrigger Personal Intro */}
            <div className="about-intro-zone">
              <p
                ref={introParagraphRef}
                className="about-intro-copy"
                aria-label={INTRO_SENTENCE}
              >
                {introWords.map((word, idx) => {
                  const isAccent = ACCENT_WORDS.has(word)
                  return (
                    <span key={`${word}-${idx}`}>
                      <span
                        className={`intro-word ${isAccent ? 'intro-word-accent' : ''}`}
                        aria-hidden="true"
                      >
                        {word}
                      </span>
                      {idx < introWords.length - 1 ? ' ' : ''}
                    </span>
                  )
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
