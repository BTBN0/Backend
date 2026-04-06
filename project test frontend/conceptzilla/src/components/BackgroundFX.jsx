import { useEffect, useRef } from 'react'

export default function BackgroundFX({ theme }) {
  const isDark = theme === 'dark'
  const bgRef    = useRef(null)
  const trailRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999, vx: 0, vy: 0 })
  const prevMouse = useRef({ x: -999, y: -999 })
  const themeRef = useRef(theme)

  useEffect(() => { themeRef.current = theme }, [theme])

  // ── Background particle canvas ──
  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, raf

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 90
    const particles = []

    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x  = Math.random() * W
        this.y  = initial ? Math.random() * H : H + 10
        this.vx = (Math.random() - 0.5) * 0.25
        this.vy = -(Math.random() * 0.35 + 0.08)
        this.size = Math.random() * 1.6 + 0.3
        this.maxLife = Math.random() * 220 + 100
        this.age = initial ? Math.random() * this.maxLife : 0
        this.hue = Math.random() > 0.6 ? 210 + Math.random()*20 : 150 + Math.random()*20
      }
      get life() { return 1 - this.age / this.maxLife }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.age++
        if (this.age > this.maxLife || this.y < -10) this.reset()
      }
      draw() {
        const a = this.life * 0.5
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${a})`
        ctx.fill()
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle())

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 85) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(80,140,255,${(1 - d/85) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => { p.update(); p.draw() })
      drawLines()
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── Cursor trail canvas ──
  useEffect(() => {
    const canvas = trailRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, raf
    const dots = []
    const MAX  = 32

    // Smooth cursor position
    const smooth = { x: -999, y: -999 }

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? -999
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? -999
      const dx = x - prevMouse.current.x
      const dy = y - prevMouse.current.y
      const speed = Math.sqrt(dx*dx + dy*dy)
      mouseRef.current = { x, y, speed }
      prevMouse.current = { x, y }

      // Spawn more dots when moving fast
      const count = Math.min(Math.floor(speed / 6) + 1, 4)
      for (let i = 0; i < count; i++) {
        dots.push({
          x: x + (Math.random()-0.5)*4,
          y: y + (Math.random()-0.5)*4,
          life: 1,
          size: Math.random() * 2.5 + 1.5,
          hue: 200 + Math.random() * 50,
        })
      }
      if (dots.length > MAX) dots.splice(0, dots.length - MAX)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })

    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      const { x, y, speed = 0 } = mouseRef.current

      // Smooth cursor follow
      if (smooth.x === -999) { smooth.x = x; smooth.y = y }
      smooth.x += (x - smooth.x) * 0.18
      smooth.y += (y - smooth.y) * 0.18

      // Trail dots
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i]
        d.life -= 0.055
        if (d.life <= 0) { dots.splice(i, 1); continue }

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2)
        const dark2 = themeRef.current === 'dark'
        ctx.fillStyle = `hsla(${d.hue}, ${dark2 ? 90 : 80}%, ${dark2 ? 68 : 35}%, ${d.life * (dark2 ? 0.65 : 0.45)})`
        ctx.fill()
      }

      // Outer glow ring (smoothed)
      if (smooth.x > 0) {
        const dark = themeRef.current === 'dark'
        const ringR = 18 + Math.min(speed * 0.3, 10)
        const glowColor = dark ? '41,151,255' : '0,80,180'
        const g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, ringR)
        g.addColorStop(0,   `rgba(${glowColor},0.0)`)
        g.addColorStop(0.5, `rgba(${glowColor},${dark ? 0.18 : 0.12})`)
        g.addColorStop(0.8, `rgba(${glowColor},0.05)`)
        g.addColorStop(1,   `rgba(${glowColor},0)`)
        ctx.beginPath()
        ctx.arc(smooth.x, smooth.y, ringR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // Inner cursor dot (sharp) — white on dark, dark on light
      if (x > 0) {
        const dark = themeRef.current === 'dark'
        const dotColor = dark ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,25,0.85)'
        const ringColor = dark ? 'rgba(41,151,255,0.65)' : 'rgba(0,80,200,0.45)'

        ctx.beginPath()
        ctx.arc(x, y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 5.5, 0, Math.PI * 2)
        ctx.strokeStyle = ringColor
        ctx.lineWidth = 1
        ctx.stroke()
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <>
      {/* Particle field — dark mode only */}
      <canvas ref={bgRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: -1,
        opacity: isDark ? 0.65 : 0,
        transition: 'opacity 0.4s',
      }} />

      {/* Cursor trail — on top of everything */}
      <canvas ref={trailRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 99999,
      }} />
    </>
  )
}
