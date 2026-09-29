const BULB_COLORS = ['#ff5d8f', '#ffd56a', '#7dd3fc', '#c4b5fd', '#5eead4', '#ff8a5b']
const CONFETTI_COLORS = ['#ffd56a', '#ff6b9a', '#7dd3fc', '#c4b5fd', '#5eead4', '#ff8a5b', '#fff1a8']

function unit(seed: number) {
  const value = Math.sin(seed * 999) * 10000
  return value - Math.floor(value)
}

const STARS = Array.from({ length: 48 }, (_, id) => ({
  id,
  left: unit(id + 1) * 100,
  top: unit(id + 20) * 72,
  size: unit(id + 40) * 2.2 + 1,
  delay: unit(id + 60) * 3,
  gold: id % 5 === 0,
}))

const CONFETTI = Array.from({ length: 34 }, (_, id) => ({
  id,
  left: unit(id + 80) * 100,
  delay: unit(id + 100) * 7,
  duration: 6 + unit(id + 120) * 6,
  color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
  size: 7 + unit(id + 140) * 8,
  round: id % 3 === 0,
}))

export function Stars() {

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {STARS.map((star) => (
        <span
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            background: star.gold ? '#ffd56a' : '#fff',
          }}
        />
      ))}
    </div>
  )
}

export function Moon() {
  return <div className="moon" aria-hidden />
}

export function StringLights() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-24" aria-hidden>
      <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-20 w-full">
        <path
          d="M0 10 Q 75 48 150 14 T 300 16 T 450 12 T 600 18 T 750 12 T 900 16 T 1050 12 T 1200 10"
          fill="none"
          stroke="rgba(255,236,190,0.7)"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-x-3 top-1 flex justify-between">
        {Array.from({ length: 14 }, (_, index) => (
          <span
            key={index}
            className="bulb"
            style={{
              background: BULB_COLORS[index % BULB_COLORS.length],
              color: BULB_COLORS[index % BULB_COLORS.length],
              animationDelay: `${index * 0.16}s`,
              marginTop: `${Math.sin(index * 0.85) * 10 + 14}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {CONFETTI.map((bit) => (
        <span
          key={bit.id}
          className="confetti-bit"
          style={{
            left: `${bit.left}%`,
            width: bit.round ? bit.size : bit.size * 0.55,
            height: bit.size,
            background: bit.color,
            borderRadius: bit.round ? '999px' : '2px',
            animationDelay: `${bit.delay}s`,
            animationDuration: `${bit.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export function IntroVeil({ gone }: { gone: boolean }) {
  return (
    <div className={gone ? 'veil veil-gone' : 'veil'} aria-hidden>
      <p className="veil-kicker">يا جنى</p>
      <p className="veil-title">شطورة يا جنى</p>
      <p className="veil-en" lang="en" dir="ltr">
        Jana
      </p>
    </div>
  )
}
