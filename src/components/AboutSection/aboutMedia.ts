export type CollageMediaType = 'image' | 'video'

export type PlaceholderVariant =
  | 'architecture'
  | 'wave'
  | 'orbit'
  | 'topography'
  | 'lattice'
  | 'aperture'
  | 'prism'
  | 'waveform'
  | 'blueprint'
  | 'pendulum'
  | 'mesh'
  | 'pulse'

export interface CollageMediaItem {
  id: string
  type: CollageMediaType
  /**
   * Drop real media files into `public/media/` and set the path below
   * (e.g. '/media/project-01.jpg' or '/media/reel-02.mp4').
   * Leave empty (`''`) to display the curated monochrome placeholder frame.
   */
  src: string
  /** Optional poster image path for video slots */
  poster?: string
  alt: string
  /** Subtle architectural index label displayed in the frame corner */
  tag: string
  /** CSS positioning / aspect-ratio modifier inside the asymmetrical collage track */
  slotClass: string
  /** Initial Y offset (px) when entering the bottom of viewport */
  enterOffsetY: number
  /** Final Y offset (px) at exit for staggered ScrollTrigger parallax depth */
  parallaxEndY: number
  /** Fallback visual motif rendered cleanly when `src` is empty */
  placeholder: PlaceholderVariant
}

/**
 * Editable configuration array for Page 2 Zone 1 (12-Item Asymmetrical Collage).
 * Flows vertically across a 220vh+ scroll runway; swap `src` values anytime with real images/videos.
 */
export const ABOUT_COLLAGE_ITEMS: CollageMediaItem[] = [
  {
    id: 'collage-01',
    type: 'image',
    src: '', // Replace with e.g. '/media/01-architecture.jpg'
    alt: 'Minimal monochrome spatial architecture elevation study',
    tag: '01 / FORM',
    slotClass: 'collage-slot-01',
    enterOffsetY: 55,
    parallaxEndY: -25,
    placeholder: 'architecture',
  },
  {
    id: 'collage-02',
    type: 'video',
    src: '', // Replace with e.g. '/media/02-motion-wave.mp4'
    poster: '',
    alt: 'Muted looping wave interference showcase capture',
    tag: '02 / MOTION',
    slotClass: 'collage-slot-02',
    enterOffsetY: 110,
    parallaxEndY: -70,
    placeholder: 'wave',
  },
  {
    id: 'collage-03',
    type: 'image',
    src: '', // Replace with e.g. '/media/03-systems-orbit.jpg'
    alt: 'Orbital mechanics interactive diagram frame',
    tag: '03 / SYSTEMS',
    slotClass: 'collage-slot-03',
    enterOffsetY: 135,
    parallaxEndY: -95,
    placeholder: 'orbit',
  },
  {
    id: 'collage-04',
    type: 'video',
    src: '', // Replace with e.g. '/media/04-topo-shader.mp4'
    poster: '',
    alt: 'Looping concentric topography field capture',
    tag: '04 / ENGINE',
    slotClass: 'collage-slot-04',
    enterOffsetY: 85,
    parallaxEndY: -40,
    placeholder: 'topography',
  },
  {
    id: 'collage-05',
    type: 'image',
    src: '', // Replace with e.g. '/media/05-grid-lattice.jpg'
    alt: 'Monochrome structural lattice geometry',
    tag: '05 / STRUCTURE',
    slotClass: 'collage-slot-05',
    enterOffsetY: 145,
    parallaxEndY: -85,
    placeholder: 'lattice',
  },
  {
    id: 'collage-06',
    type: 'video',
    src: '', // Replace with e.g. '/media/06-aperture-reel.mp4'
    poster: '',
    alt: 'Optical aperture kinetic prototype loop',
    tag: '06 / OPTICS',
    slotClass: 'collage-slot-06',
    enterOffsetY: 115,
    parallaxEndY: -60,
    placeholder: 'aperture',
  },
  {
    id: 'collage-07',
    type: 'image',
    src: '', // Replace with e.g. '/media/07-isometric-prism.jpg'
    alt: 'Isometric wireframe prism composition',
    tag: '07 / GEOMETRY',
    slotClass: 'collage-slot-07',
    enterOffsetY: 75,
    parallaxEndY: -35,
    placeholder: 'prism',
  },
  {
    id: 'collage-08',
    type: 'video',
    src: '', // Replace with e.g. '/media/08-audio-waveform.mp4'
    poster: '',
    alt: 'Reactive signal spectrum modulation loop',
    tag: '08 / SIGNAL',
    slotClass: 'collage-slot-08',
    enterOffsetY: 155,
    parallaxEndY: -100,
    placeholder: 'waveform',
  },
  {
    id: 'collage-09',
    type: 'image',
    src: '', // Replace with e.g. '/media/09-game-blueprint.jpg'
    alt: 'Game level architecture blueprint sheet',
    tag: '09 / BLUEPRINT',
    slotClass: 'collage-slot-09',
    enterOffsetY: 105,
    parallaxEndY: -50,
    placeholder: 'blueprint',
  },
  {
    id: 'collage-10',
    type: 'video',
    src: '', // Replace with e.g. '/media/10-harmonic-pendulum.mp4'
    poster: '',
    alt: 'Physics harmonic equilibrium loop study',
    tag: '10 / PHYSICS',
    slotClass: 'collage-slot-10',
    enterOffsetY: 140,
    parallaxEndY: -85,
    placeholder: 'pendulum',
  },
  {
    id: 'collage-11',
    type: 'image',
    src: '', // Replace with e.g. '/media/11-terrain-mesh.jpg'
    alt: 'Procedural wireframe terrain mesh slice',
    tag: '11 / MESH',
    slotClass: 'collage-slot-11',
    enterOffsetY: 90,
    parallaxEndY: -45,
    placeholder: 'mesh',
  },
  {
    id: 'collage-12',
    type: 'video',
    src: '', // Replace with e.g. '/media/12-shader-pulse.mp4'
    poster: '',
    alt: 'Ambient radial shader pulse closure clip',
    tag: '12 / CRAFT',
    slotClass: 'collage-slot-12',
    enterOffsetY: 160,
    parallaxEndY: -75,
    placeholder: 'pulse',
  },
]
