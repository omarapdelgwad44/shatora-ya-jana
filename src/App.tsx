import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Confetti, IntroVeil, Moon, Stars, StringLights } from '@/components/ambience'
import { Balloons } from '@/components/balloons'
import { BouncingName } from '@/components/bouncing-name'
import { Fireworks, type FireworksHandle } from '@/components/fireworks'
import { Button } from '@/components/ui/button'

export default function App() {
  const fireworks = useRef<FireworksHandle>(null)
  const [revealed, setRevealed] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (revealed) return
    const id = window.setTimeout(() => setRevealed(true), 1500)
    return () => window.clearTimeout(id)
  }, [revealed])

  function burst(x: number, y: number, color?: string) {
    fireworks.current?.burst(x, y, color)
  }

  return (
    <main
      className="relative min-h-dvh overflow-hidden text-white"
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('[data-interactive]')) return
        burst(event.clientX, event.clientY)
      }}
    >
      <div className="sky" />
      <Moon />
      <Stars />
      <Fireworks ref={fireworks} />
      <Confetti />
      <Balloons onBurst={burst} />
      <StringLights />

      <section className="stage pointer-events-none">
        <div className="spotlight" />
        <p className="kicker">ليلة فرحة</p>
        <h1 className="hero-title">
          <span className="gold-text">شطورة يا</span>
          <span className="sr-only"> جنى Jana</span>
        </h1>
        <div className="pointer-events-auto">
          <BouncingName onBurst={burst} />
        </div>
        <p className="hint">دوس في السما والألعاب النارية هتفرقع، أو دوس على بالون أو على الاسم</p>
      </section>

      <div
        data-interactive
        className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="party-button"
            onClick={() => fireworks.current?.finale()}
          >
            <Sparkles />
            فرّعي السما
          </Button>
        </div>
      </div>

      <IntroVeil gone={revealed} />
    </main>
  )
}
