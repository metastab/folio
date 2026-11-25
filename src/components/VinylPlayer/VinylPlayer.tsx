import { useState } from 'react'
import './VinylPlayer.css'

interface VinylPlayerProps {
  className?: string
}

export default function VinylPlayer({ className = '' }: VinylPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div
      className={`vinyl-player-root ${!isPlaying ? 'is-paused' : ''} ${className}`}
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? 'Pause vinyl turntable' : 'Play vinyl turntable'}
      title={isPlaying ? 'Click to pause' : 'Click to spin'}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          togglePlay()
        }
      }}
    >
      <svg
        className="vinyl-player-svg"
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient drop shadow beneath platter */}
          <filter id="platter-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="26"
              floodColor="#000000"
              floodOpacity="0.85"
            />
          </filter>

          {/* Depth shadow cast by elevated tonearm onto the vinyl surface */}
          <filter id="tonearm-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="-4"
              dy="7"
              stdDeviation="4.5"
              floodColor="#000000"
              floodOpacity="0.7"
            />
          </filter>

          {/* Metallic cylindrical gradient for tonearm tube */}
          <linearGradient id="arm-metal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7e808a" />
            <stop offset="30%" stopColor="#e2e4ed" />
            <stop offset="60%" stopColor="#acafb9" />
            <stop offset="100%" stopColor="#555660" />
          </linearGradient>

          {/* Dark gunmetal gradient for gimbal housing and headshell */}
          <linearGradient id="arm-metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#383942" />
            <stop offset="50%" stopColor="#222329" />
            <stop offset="100%" stopColor="#15161a" />
          </linearGradient>

          {/* Spindle chrome pin specular metallic sheen */}
          <radialGradient id="spindle-metal" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#b8b9c2" />
            <stop offset="80%" stopColor="#4a4b54" />
            <stop offset="100%" stopColor="#202126" />
          </radialGradient>

          {/* Center label disc background */}
          <radialGradient id="label-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a2c35" />
            <stop offset="60%" stopColor="#17181e" />
            <stop offset="92%" stopColor="#0f1014" />
            <stop offset="100%" stopColor="#07080a" />
          </radialGradient>

          {/* Vinyl base tone: deep luster graphite */}
          <radialGradient id="vinyl-base-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#17181c" />
            <stop offset="60%" stopColor="#0f1013" />
            <stop offset="92%" stopColor="#08090b" />
            <stop offset="100%" stopColor="#030304" />
          </radialGradient>

          {/* Primary anisotropic specular sheen gradient (butterfly / bowtie reflection) */}
          <linearGradient id="sheen-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="42%" stopColor="rgba(225, 230, 240, 0.28)" />
            <stop offset="50%" stopColor="rgba(250, 252, 255, 0.44)" />
            <stop offset="58%" stopColor="rgba(215, 222, 235, 0.26)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Secondary anisotropic reflection fan */}
          <linearGradient id="sheen-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="40%" stopColor="rgba(200, 206, 218, 0.16)" />
            <stop offset="50%" stopColor="rgba(235, 240, 252, 0.26)" />
            <stop offset="60%" stopColor="rgba(195, 201, 212, 0.14)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Mask ensuring anisotropic sheen only illuminates the grooved surface */}
          <radialGradient id="groove-fade" cx="50%" cy="50%" r="50%">
            <stop offset="32%" stopColor="#fff" stopOpacity="0" />
            <stop offset="36%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="98%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <mask id="grooves-area-mask">
            <circle cx="210" cy="240" r="176" fill="url(#groove-fade)" />
          </mask>
        </defs>

        {/* ==========================================
            1. BASE TURNTABLE PLATTER & RIM
            ========================================== */}
        <circle cx="210" cy="240" r="180" fill="#08080a" filter="url(#platter-shadow)" />
        <circle cx="210" cy="240" r="179" stroke="#25262c" strokeWidth="1.5" />
        <circle cx="210" cy="240" r="177.5" stroke="#121316" strokeWidth="1" />

        {/* ==========================================
            2. CONTINUOUSLY SPINNING VINYL RECORD
            ========================================== */}
        <g className={`vinyl-disk ${!isPlaying ? 'is-paused' : ''}`}>
          {/* Vinyl base disc */}
          <circle cx="210" cy="240" r="176" fill="url(#vinyl-base-grad)" />

          {/* Anisotropic Specular Sheen (Vinyl Butterfly Bowtie Highlights) */}
          <g mask="url(#grooves-area-mask)" style={{ mixBlendMode: 'screen' }}>
            {/* Primary reflection lobe: North-West to South-East */}
            <path
              d="M 210 240 L 131.4 408.6 A 186 186 0 0 1 24.7 256.2 Z"
              fill="url(#sheen-grad-1)"
              opacity="0.92"
            />
            <path
              d="M 210 240 L 288.6 71.4 A 186 186 0 0 1 395.3 223.8 Z"
              fill="url(#sheen-grad-1)"
              opacity="0.92"
            />

            {/* Secondary reflection lobe: North-East to South-West */}
            <path
              d="M 210 240 L 378.6 318.6 A 186 186 0 0 1 288.6 408.6 Z"
              fill="url(#sheen-grad-2)"
              opacity="0.75"
            />
            <path
              d="M 210 240 L 41.4 161.4 A 186 186 0 0 1 131.4 71.4 Z"
              fill="url(#sheen-grad-2)"
              opacity="0.75"
            />
          </g>

          {/* Precision Micro-Grooves & Sound Track Bands */}
          <g fill="none">
            {/* Outermost rim & Lead-in groove */}
            <circle cx="210" cy="240" r="175" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" />
            <circle cx="210" cy="240" r="173" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="171" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.4" />

            {/* Track 1 Sound Grooves */}
            <circle cx="210" cy="240" r="169" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="167" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="165" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="163" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="161" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="159" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="157" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="155" stroke="rgba(255, 255, 255, 0.13)" strokeWidth="0.4" />

            {/* Inter-track band gap 1 */}
            <circle cx="210" cy="240" r="153.5" stroke="rgba(0, 0, 0, 0.75)" strokeWidth="1.8" />
            <circle cx="210" cy="240" r="152.5" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="0.5" />

            {/* Track 2 Sound Grooves */}
            <circle cx="210" cy="240" r="150" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="148" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="146" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="144" stroke="rgba(255, 255, 255, 0.17)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="142" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="140" stroke="rgba(255, 255, 255, 0.13)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="138" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="136" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="134" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.4" />

            {/* Inter-track band gap 2 */}
            <circle cx="210" cy="240" r="132.5" stroke="rgba(0, 0, 0, 0.8)" strokeWidth="2" />
            <circle cx="210" cy="240" r="131.5" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.6" />

            {/* Track 3 Sound Grooves */}
            <circle cx="210" cy="240" r="129" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="127" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="125" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="123" stroke="rgba(255, 255, 255, 0.19)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="121" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="119" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="117" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="115" stroke="rgba(255, 255, 255, 0.21)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="113" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />

            {/* Inter-track band gap 3 */}
            <circle cx="210" cy="240" r="111.5" stroke="rgba(0, 0, 0, 0.82)" strokeWidth="2.2" />
            <circle cx="210" cy="240" r="110.5" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.6" />

            {/* Track 4 Sound Grooves */}
            <circle cx="210" cy="240" r="108" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="106" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="104" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="102" stroke="rgba(255, 255, 255, 0.19)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="100" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="98" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="96" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.4" />
            <circle cx="210" cy="240" r="94" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.4" />

            {/* Runout Deadwax Groove Band with Etched Spiral */}
            <circle cx="210" cy="240" r="91.5" stroke="rgba(0, 0, 0, 0.88)" strokeWidth="3.5" />
            <circle cx="210" cy="240" r="87" stroke="rgba(255, 255, 255, 0.13)" strokeWidth="0.5" />
            <path
              d="M 210 153 A 87 87 0 0 1 270 297 A 77 77 0 0 1 155 299 A 67 67 0 0 1 210 173"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.6"
              strokeDasharray="120 4"
            />
            <circle cx="210" cy="240" r="66" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.75" />
            <circle cx="210" cy="240" r="64" stroke="rgba(0, 0, 0, 0.92)" strokeWidth="2.5" />
          </g>

          {/* Center Label Disc & Chrome Spindle */}
          <g>
            <circle cx="210" cy="240" r="62" fill="url(#label-bg)" stroke="#22232a" strokeWidth="1.2" />
            <circle cx="210" cy="240" r="60" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="52" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="44" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
            <circle cx="210" cy="240" r="34" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.5" />

            {/* Inner label accent ring */}
            <circle cx="210" cy="240" r="26" fill="#0d0e11" stroke="#25262e" strokeWidth="0.8" />

            {/* Spindle hole rim & 3D chrome pin */}
            <circle cx="210" cy="240" r="14" fill="#050506" stroke="#4a4b55" strokeWidth="1.5" />
            <circle cx="210" cy="240" r="7.5" fill="url(#spindle-metal)" stroke="#1a1a20" strokeWidth="0.75" />
            <circle cx="208.5" cy="238.5" r="2" fill="#ffffff" opacity="0.85" />
          </g>
        </g>

        {/* ==========================================
            3. STATIONARY METALLIC TONE ARM ASSEMBLY
            ========================================== */}
        <g className="tonearm-assembly" filter="url(#tonearm-shadow)">
          {/* Gimbal Base & Bearing (Top-Right: cx=390, cy=115) */}
          <circle cx="390" cy="115" r="30" fill="url(#arm-metal-dark)" stroke="#3c3d46" strokeWidth="1.5" />
          <circle cx="390" cy="115" r="28" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="0.75" />
          <circle cx="390" cy="115" r="22" fill="#121316" stroke="#282930" strokeWidth="1" />
          <circle cx="390" cy="115" r="18" fill="url(#arm-metal)" />

          {/* Counterweight stub extending upward-right */}
          <path d="M 390 115 L 424 81" stroke="#2a2b32" strokeWidth="7" strokeLinecap="round" />

          {/* Cylindrical Counterweight with calibration rings */}
          <g transform="translate(412, 93) rotate(45)">
            <rect x="-14" y="-8" width="28" height="16" rx="2" fill="url(#arm-metal-dark)" stroke="#454652" strokeWidth="1" />
            <line x1="-8" y1="-8" x2="-8" y2="8" stroke="#888994" strokeWidth="1.2" />
            <line x1="-2" y1="-8" x2="-2" y2="8" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.8" />
            <line x1="4" y1="-8" x2="4" y2="8" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
          </g>

          {/* Cueing mechanism / arm rest bar */}
          <path d="M 370 135 A 24 24 0 0 1 366 115" stroke="#222329" strokeWidth="4" strokeLinecap="round" />
          <circle cx="366" cy="115" r="3" fill="#666772" />

          {/* Pivot Center Dome */}
          <circle cx="390" cy="115" r="11" fill="url(#spindle-metal)" stroke="#1a1b20" strokeWidth="1" />
          <circle cx="388" cy="113" r="2.5" fill="#fff" opacity="0.75" />

          {/* Tone Arm Wand Tube */}
          <path
            d="M 386 122 Q 380 185, 372 230 Q 366 260, 348 285"
            stroke="url(#arm-metal)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Highlight spine along arm wand for 3D tubular reflection */}
          <path
            d="M 386.5 122 Q 380.5 185, 372.5 230 Q 366.5 260, 348.5 285"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Headshell & Cartridge (Resting on record grooves at x=348, y=285) */}
          <g transform="translate(348, 285) rotate(-38)">
            {/* Connector collar */}
            <rect x="-4" y="-3.5" width="8" height="7" rx="1.5" fill="url(#arm-metal)" stroke="#111" strokeWidth="0.75" />

            {/* Headshell Plate */}
            <path d="M 4 -4 L 32 -5.5 L 34 5.5 L 4 4 Z" fill="url(#arm-metal-dark)" stroke="#383944" strokeWidth="1" />
            <line x1="6" y1="0" x2="28" y2="0" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1" />

            {/* Cartridge Body beneath headshell */}
            <rect x="10" y="-3.5" width="22" height="7" rx="1" fill="#0d0e12" stroke="#22232a" strokeWidth="0.8" />

            {/* Stylus needle */}
            <path d="M 28 0 L 33 0" stroke="#dcdde6" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="33" cy="0" r="1.2" fill="#fff" />

            {/* Finger lift lever */}
            <path d="M 24 -5.5 Q 28 -12, 34 -11" stroke="url(#arm-metal)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  )
}
