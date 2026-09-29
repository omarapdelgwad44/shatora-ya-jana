import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

export type FireworksHandle = {
  burst: (x: number, y: number, color?: string) => void
  finale: () => void
}

const COLORS = ['#ffd56a', '#ff6b9a', '#7dd3fc', '#c4b5fd', '#5eead4', '#ff8a5b', '#fff1a8', '#fb7185', '#86efac']

type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
  size: number
  gravity: number
  drag: number
  twinkle: boolean
}

type Rocket = {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  targetY: number
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pick(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)] ?? COLORS[0]
}

export function Fireworks({
  ref,
  auto = true,
}: {
  ref?: Ref<FireworksHandle>
  auto?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const autoRef = useRef(auto)

  const handle = useRef<FireworksHandle>({
    burst: () => {},
    finale: () => {},
  })
  useImperativeHandle(ref, () => handle.current, [])

  useEffect(() => {
    autoRef.current = auto
  }, [auto])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sparks: Spark[] = []
    const rockets: Rocket[] = []
    const api = handle.current
    let frame = 0
    let alive = true
    let last = performance.now()
    let nextLaunch = performance.now() + 350
    const timeouts: number[] = []
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (alive) fn()
      }, ms)
      timeouts.push(id)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvas.clientWidth * dpr)
      canvas.height = Math.floor(canvas.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const localPoint = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      return { x: x - rect.left, y: y - rect.top }
    }

    const burstAt = (x: number, y: number, color = pick(COLORS), power = 1) => {
      const scale = canvas.clientWidth < 700 ? 0.62 : 1
      const count = Math.floor(rand(48, 78) * power * scale)
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.08, 0.08)
        const speed = rand(1.1, 4.8) * power
        const willow = i % 7 === 0
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed * (willow ? 0.7 : 1),
          vy: Math.sin(angle) * speed * (willow ? 0.7 : 1),
          life: 1,
          max: willow ? rand(1.1, 1.5) : rand(0.72, 1.15),
          color: i % 6 === 0 ? '#fff7d6' : color,
          size: rand(1.3, 2.7),
          gravity: willow ? 0.04 : rand(0.012, 0.026),
          drag: rand(0.984, 0.993),
          twinkle: Math.random() > 0.72,
        })
      }
      const ring = pick(COLORS)
      const ringCount = Math.floor(26 * scale)
      for (let i = 0; i < ringCount; i += 1) {
        const angle = (Math.PI * 2 * i) / ringCount
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * 2.15 * power,
          vy: Math.sin(angle) * 2.15 * power,
          life: 1,
          max: 0.85,
          color: ring,
          size: 1.5,
          gravity: 0.008,
          drag: 0.992,
          twinkle: false,
        })
      }
      if (sparks.length > 650) sparks.splice(0, sparks.length - 650)
    }

    const launch = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      rockets.push({
        x: rand(w * 0.12, w * 0.88),
        y: h + 6,
        vx: rand(-0.55, 0.55),
        vy: rand(-12, -8.4),
        color: pick(COLORS),
        targetY: rand(h * 0.1, h * 0.4),
      })
    }

    api.burst = (x, y, color) => {
      const point = localPoint(x, y)
      burstAt(point.x, point.y, color)
      later(() => burstAt(point.x + rand(-18, 18), point.y + rand(-12, 16), pick(COLORS), 0.72), 160)
    }

    api.finale = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      for (let i = 0; i < 8; i += 1) {
        later(() => {
          burstAt(rand(w * 0.1, w * 0.9), rand(h * 0.1, h * 0.5), pick(COLORS), rand(0.9, 1.3))
        }, i * 130)
      }
    }

    if (!reduced) {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      burstAt(w * 0.5, h * 0.34, '#ffd56a', 1.2)
      later(() => burstAt(w * 0.26, h * 0.24, '#ff6b9a'), 260)
      later(() => burstAt(w * 0.74, h * 0.28, '#7dd3fc'), 480)
      later(() => burstAt(w * 0.5, h * 0.18, '#c4b5fd', 0.9), 760)
    }

    const tick = (now: number) => {
      if (!alive) return
      const dt = Math.min(32, now - last) / 16.67
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      if (!reduced && autoRef.current && now > nextLaunch) {
        launch()
        nextLaunch = now + rand(680, 1450)
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i]
        if (!rocket) continue
        rocket.x += rocket.vx * dt
        rocket.y += rocket.vy * dt
        rocket.vy += 0.05 * dt
        sparks.push({
          x: rocket.x,
          y: rocket.y + 4,
          vx: rand(-0.25, 0.25),
          vy: rand(0.5, 1.5),
          life: 1,
          max: 0.32,
          color: '#fff4c8',
          size: 1.4,
          gravity: 0.02,
          drag: 0.96,
          twinkle: false,
        })
        if (rocket.y <= rocket.targetY || rocket.vy >= -0.8) {
          burstAt(rocket.x, rocket.y, rocket.color)
          rockets.splice(i, 1)
        } else {
          ctx.globalAlpha = 1
          ctx.fillStyle = '#fffaf0'
          ctx.beginPath()
          ctx.arc(rocket.x, rocket.y, 2.3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i]
        if (!spark) continue
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.vx *= spark.drag
        spark.vy = spark.vy * spark.drag + spark.gravity * dt
        spark.life -= dt / (60 * spark.max)
        if (spark.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const twinkle = spark.twinkle ? 0.4 + Math.abs(Math.sin(now / 70 + spark.x)) * 0.6 : 1
        ctx.globalAlpha = Math.max(0, spark.life) * twinkle
        ctx.fillStyle = spark.color
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, spark.size * (0.45 + spark.life), 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = Math.max(0, spark.life) * 0.35
        ctx.beginPath()
        ctx.arc(spark.x - spark.vx * 0.7, spark.y - spark.vy * 0.7, spark.size * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      timeouts.forEach((id) => window.clearTimeout(id))
      observer.disconnect()
      api.burst = () => {}
      api.finale = () => {}
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" aria-hidden />
}
