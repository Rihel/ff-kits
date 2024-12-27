import { useForceUpdate } from './use-force-update'
import { useRef } from 'react'
import { useRefreshEffect } from './use-refresh-effect'

export function useNextTick() {
  const callback = useRef<((...args: any) => any) | null>(null)
  const refresh = useRefreshEffect(async () => {
    await callback.current?.()
    callback.current = null
  }, false)
  const tick = (fn: (...args: any) => any) => {
    callback.current = fn
    refresh()
  }
  return tick
}
