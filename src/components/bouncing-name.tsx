const ENGLISH = [
  { ch: 'J', color: '#fb7185', delay: '0s' },
  { ch: 'a', color: '#fdba74', delay: '0.12s' },
  { ch: 'n', color: '#7dd3fc', delay: '0.24s' },
  { ch: 'a', color: '#c4b5fd', delay: '0.36s' },
]

function Letter({
  ch,
  color,
  delay,
  onBurst,
}: {
  ch: string
  color: string
  delay: string
  onBurst: (x: number, y: number, color: string) => void
}) {
  return (
    <button
      type="button"
      data-interactive
      lang="en"
      className="letter"
      style={{ ['--c' as string]: color, ['--delay' as string]: delay, ['--tilt' as string]: '5deg' }}
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
    <div className="name-stack">
      <button
        type="button"
        data-interactive
        lang="ar"
        className="connected-name"
        style={{ ['--tilt' as string]: '-4deg' }}
        onClick={(event) => {
          event.stopPropagation()
          onBurst(event.clientX, event.clientY - 30, '#ffd56a')
        }}
      >
        جنى
      </button>
      <p className="name-caption">وبالإنجليزي</p>
      <div dir="ltr" lang="en" className="letter-row letter-row-latin">
        {ENGLISH.map((letter, index) => (
          <Letter key={`${letter.ch}-${index}`} {...letter} onBurst={onBurst} />
        ))}
      </div>
    </div>
  )
}
