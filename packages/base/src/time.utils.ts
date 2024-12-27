export type CountdownOptions = Partial<{
  onTick: (seconds: number) => void
  onStart: () => void
  onStop: () => void
}>
export type Countdown = {
  start(): void
  stop(): void
  reset(): void
}
export function countdown(time: number, options?: CountdownOptions): Countdown {
  let timer: ReturnType<typeof setTimeout>
  let seconds = 0
  const tick = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (seconds > 0) {
        seconds--
        options?.onTick?.(seconds)
        tick()
      } else {
        clearTimeout(timer)
      }
    }, 1000)
  }

  const start = () => {
    options?.onStart?.()
    seconds = time
    tick()
  }
  const stop = () => {
    clearTimeout(timer)
    options?.onStop?.()
  }
  const reset = () => {
    stop()
    seconds = time
  }
  return {
    reset,
    start,
    stop,
  }
}
