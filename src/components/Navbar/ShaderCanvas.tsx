import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ShaderCanvasProps {
  isHovered: boolean
  isDarkMode: boolean
}

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER_SRC = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_hover;
  uniform float u_dark;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Normalize coordinates with aspect ratio correction
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
    
    float dist = distance(st, m);
    
    // Radial falloff radius
    float radius = 0.42;
    float radialFalloff = smoothstep(radius, 0.0, dist);
    
    // Organic harmonic wave oscillations
    float angle = atan(st.y - m.y, st.x - m.x);
    float wave1 = sin(dist * 34.0 - u_time * 2.6) * 0.5 + 0.5;
    float wave2 = cos(angle * 3.0 + u_time * 1.4) * 0.5 + 0.5;
    float organicField = mix(wave1, wave2, 0.38);
    
    // Subtle radial displacement effect
    float displacement = radialFalloff * (0.2 + 0.8 * u_hover) * organicField;
    
    // Edge caustic ring around interaction zone
    float ring = smoothstep(0.04, 0.0, abs(dist - (0.07 + 0.03 * sin(u_time * 1.8))));
    float caustic = ring * radialFalloff * u_hover * 0.4;
    
    vec3 baseColor;
    float alpha;
    
    if (u_dark > 0.5) {
      // Dark theme: whisper-soft silver-violet sheen
      vec3 c1 = vec3(0.94, 0.95, 0.98);
      vec3 c2 = vec3(0.72, 0.78, 0.92);
      baseColor = mix(c1, c2, organicField);
      alpha = (displacement * 0.07 + caustic * 0.08) * radialFalloff;
    } else {
      // Light theme: refined subtle charcoal/ink field
      vec3 c1 = vec3(0.12, 0.14, 0.18);
      vec3 c2 = vec3(0.30, 0.34, 0.42);
      baseColor = mix(c1, c2, organicField);
      alpha = (displacement * 0.05 + caustic * 0.07) * radialFalloff;
    }
    
    gl_FragColor = vec4(baseColor, alpha);
  }
`

export default function ShaderCanvas({ isHovered, isDarkMode }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hoverVal = useRef({ value: 0 })
  const mouseTarget = useRef({ x: 0.5, y: 0.5 })
  const mouseCurrent = useRef({ x: 0.5, y: 0.5 })

  // Animate hover state with GSAP
  useEffect(() => {
    gsap.to(hoverVal.current, {
      value: isHovered ? 1.0 : 0.0,
      duration: 0.65,
      ease: 'power2.out',
    })
  }, [isHovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })

    if (!gl) return

    // Compile helper
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC)
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program))
      return
    }

    gl.useProgram(program)

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const uResLoc = gl.getUniformLocation(program, 'u_resolution')
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse')
    const uTimeLoc = gl.getUniformLocation(program, 'u_time')
    const uHoverLoc = gl.getUniformLocation(program, 'u_hover')
    const uDarkLoc = gl.getUniformLocation(program, 'u_dark')

    let animationFrameId: number
    let startTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const x = (e.clientX - rect.left) / rect.width
        const y = 1.0 - (e.clientY - rect.top) / rect.height
        mouseTarget.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const displayWidth = Math.floor(width * dpr)
      const displayHeight = Math.floor(height * dpr)

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        gl.viewport(0, 0, displayWidth, displayHeight)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    resize()

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const render = () => {
      // Smooth mouse interpolation
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.08
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.08

      const currentTime = (performance.now() - startTime) * 0.001

      gl.uniform2f(uResLoc, canvas.width, canvas.height)
      gl.uniform2f(uMouseLoc, mouseCurrent.current.x, mouseCurrent.current.y)
      gl.uniform1f(uTimeLoc, currentTime)
      gl.uniform1f(uHoverLoc, hoverVal.current.value)
      gl.uniform1f(uDarkLoc, isDarkMode ? 1.0 : 0.0)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [isDarkMode])

  return (
    <canvas
      ref={canvasRef}
      className="navbar-shader-canvas"
      aria-hidden="true"
    />
  )
}

