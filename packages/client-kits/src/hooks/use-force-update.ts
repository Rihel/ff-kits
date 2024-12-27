import { useState } from 'react'

/**
 * 强制重新渲染
 */
export function useForceUpdate() {
  const [_1, update] = useState(Math.random())
  return () => {
    update(Math.random())
  }
}
