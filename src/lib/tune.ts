const MELODY = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 880, 659.25, 587.33, 523.25, 659.25, 783.99]

export function createTune() {
  let ctx: AudioContext | null = null
  let timer: number | null = null
  let step = 0

  function note(freq: number, when: number, volume: number) {
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.34)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(when)
    osc.stop(when + 0.36)
  }

  return {
    async start() {
      if (ctx) return
      ctx = new AudioContext()
      await ctx.resume()
      const tick = () => {
        if (!ctx) return
        const now = ctx.currentTime
        const freq = MELODY[step % MELODY.length] ?? 523.25
        note(freq, now, 0.07)
        if (step % 4 === 0) note(freq / 2, now, 0.04)
        step += 1
        timer = window.setTimeout(tick, 280)
      }
      tick()
    },
    stop() {
      if (timer !== null) window.clearTimeout(timer)
      timer = null
      const current = ctx
      ctx = null
      void current?.close()
    },
  }
}

export function playPop() {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(680, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.12)
  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.15)
  osc.onended = () => void ctx.close()
}
