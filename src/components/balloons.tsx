import { useEffect, useRef, useState } from 'react'
import { playPop } from '@/lib/tune'

type Theme = { color: string; highlight: string; shade: string }

const THEMES: Theme[] = [
  { color: '#ff4d8d', highlight: '#ffd0e4', shade: '#c2185b' },
  { color: '#ffd23f', highlight: '#fff6c2', shade: '#d49200' },
  { color: '#3dd6c6', highlight: '#e7fffa', shade: '#0e8f84' },
  { color: '#6cb6ff', highlight: '#e7f3ff', shade: '#2a6fbe' },
  { color: '#c084fc', highlight: '#f4e8ff', shade: '#7e22ce' },
  { color: '#fb923c', highlight: '#ffedd5', shade: '#c2410c' },
  { color: '#fb7185', highlight: '#ffe4e6', shade: '#be123c' },
  { color: '#f8fafc', highlight: '#ffffff', shade: '#94a3b8' },
]

type Balloon = Theme & {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  sway: number
  tilt: number
  rest: number
  popping: boolean
}

let nextId = 1

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createBalloon(index: number, fromBottom = false): Balloon {
  const theme = THEMES[index % THEMES.length] ?? THEMES[0]
  const lane = index % 3
  const left = lane === 0 ? rand(0, 18) : lane === 1 ? rand(78, 94) : rand(18, 76)
  return {
    id: nextId++,
    left,
    size: rand(72, 124),
    duration: rand(14, 23),
    delay: fromBottom ? 0 : -rand(0, 20),
    sway: rand(-36, 36),
    tilt: rand(-8, 8),
    rest: rand(6, 78),
    popping: false,
    color: theme.color,
    highlight: theme.highlight,
    shade: theme.shade,
  }
}

export function Balloons({ onBurst }: { onBurst: (x: number, y: number, color: string) => void }) {
  const [balloons, setBalloons] = useState<Balloon[]>(() =>
    Array.from({ length: 14 }, (_, index) => createBalloon(index)),
  )
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  function pop(balloon: Balloon, element: HTMLButtonElement) {
    if (balloon.popping) return
    playPop()
    const rect = element.getBoundingClientRect()
    onBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.35, balloon.color)
    setBalloons((list) => list.map((item) => (item.id === balloon.id ? { ...item, popping: true } : item)))
    const id = balloon.id
    timers.current.push(window.setTimeout(() => {
      setBalloons((list) =>
        list.map((item) => (item.id === id ? createBalloon(Math.floor(Math.random() * THEMES.length), true) : item)),
      )
    }, 430))
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden={false}>
      {balloons.map((balloon) => (
        <button
          key={balloon.id}
          type="button"
          data-interactive
          className={balloon.popping ? 'balloon is-popping' : 'balloon'}
          style={{
            left: `${balloon.left}%`,
            width: balloon.size,
            ['--dur' as string]: `${balloon.duration}s`,
            ['--delay' as string]: `${balloon.delay}s`,
            ['--sway' as string]: `${balloon.sway}px`,
            ['--tilt' as string]: `${balloon.tilt}deg`,
            ['--rest' as string]: `${balloon.rest}%`,
          }}
          aria-label="فرّعي البالون"
          onClick={(event) => {
            event.stopPropagation()
            pop(balloon, event.currentTarget)
          }}
        >
          <svg viewBox="0 0 120 190" className="h-auto w-full overflow-visible">
            <defs>
              <radialGradient id={`balloon-${balloon.id}`} cx="34%" cy="30%" r="75%">
                <stop offset="0%" stopColor={balloon.highlight} />
                <stop offset="42%" stopColor={balloon.color} />
                <stop offset="100%" stopColor={balloon.shade} />
              </radialGradient>
            </defs>
            <ellipse cx="60" cy="68" rx="42" ry="54" fill={`url(#balloon-${balloon.id})`} />
            <ellipse cx="44" cy="48" rx="12" ry="18" fill="white" opacity="0.45" />
            <path d="M50 118 Q60 128 70 118 Q60 136 50 118" fill={balloon.shade} />
            <path
              d="M60 128 C 54 150, 74 160, 58 184"
              fill="none"
              stroke="rgba(255,244,214,0.85)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}
