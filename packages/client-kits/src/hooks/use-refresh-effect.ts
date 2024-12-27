import { useEffect, useRef, useState } from 'react'

/**
 * 当你有多个状态更新，但是需要手动控制副作用执行的时候使用
 * @param {Function} effect
 * @returns
 */
export function useRefreshEffect(effect: () => void, first = true) {
  const [refreshState, setRefreshState] = useState(Math.random())
  const firstRun = useRef(false)
  const refresh = () => {
    setRefreshState(Math.random())
  }
  useEffect(() => {
    if (first && firstRun.current === false) {
      effect?.()
      firstRun.current = true
    } else if (firstRun.current) {
      effect?.()
    } else {
      firstRun.current = true
    }
  }, [refreshState])
  return refresh
}
