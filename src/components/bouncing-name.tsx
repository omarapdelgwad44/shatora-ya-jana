const ARABIC = [
  { ch: 'ج', color: '#ff6b9a', delay: '0s' },
  { ch: 'ن', color: '#ffd56a', delay: '0.12s' },
  { ch: 'ى', color: '#5eead4', delay: '0.24s' },
]

const ENGLISH = [
  { ch: 'J', color: '#fb7185', delay: '0.38s' },
  { ch: 'a', color: '#fdba74', delay: '0.5s' },
  { ch: 'n', color: '#7dd3fc', delay: '0.62s' },
  { ch: 'a', color: '#c4b5fd', delay: '0.74s' },
]

function Letter({
  ch,
  color,
  delay,
  lang,
  onBurst,
}: {
  ch: string
  color: string
  delay: string
  lang: string
  onBurst: (x: number, y: number, color: string) => void
}) {
  return (
    <button
      type="button"
      data-interactive
      lang={lang}
      className="letter"
      style={{ ['--c' as string]: color, ['--delay' as string]: delay, ['--tilt' as string]: lang === 'ar' ? '-6deg' : '5deg' }}
      onClick={(event) => {
        event.stopPropagation()
        onBurst(event.clientX, event.clientY - 40, color)
      }}
    >
      {ch}
    </button>
  )
}

export function BouncingName({ onBurst }: { onBurst: (x: number, y: number, color: string) => void }) {
  return (
    <div className="mt-2 flex flex-col items-center gap-1">
      <div dir="rtl" className="letter-row font-arabic">
        {ARABIC.map((letter) => (
          <Letter key={letter.ch} {...letter} lang="ar" onBurst={onBurst} />
        ))}
      </div>
      <p className="my-1 text-sm font-bold tracking-[0.35em] text-amber-100/80 sm:text-base">وبالإنجليزي</p>
      <div dir="ltr" lang="en" className="letter-row letter-row-latin font-latin">
        {ENGLISH.map((letter, index) => (
          <Letter key={`${letter.ch}-${index}`} {...letter} lang="en" onBurst={onBurst} />
        ))}
      </div>
    </div>
  )
}
