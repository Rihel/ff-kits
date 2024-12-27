import { MediaQueryEvent, mediaQuery } from '../lib/css'
import { useEffect, useMemo, useState } from 'react'

import { EventHandler } from '@ff-kits/core'

export function useMediaQuery({
  onChange = () => {},
}: {
  onChange?: (e: MediaQueryEvent) => void
} = {}) {
  const [state, setState] = useState<MediaQueryEvent>(mediaQuery.currentState)
  useEffect(() => {
    const handler: EventHandler<'change'> = (e) => {
      onChange?.(e.payload)
      setState(e.payload)
    }
    mediaQuery.on('change', handler)
    return () => {
      mediaQuery.off('change', handler)
    }
  }, [])
  const getScreenKeyByConfig = useMemo(
    () => mediaQuery.getScreenKeyByConfig.bind(mediaQuery),
    [state?.width]
  )

  return {
    ...state,
    getScreenKeyByConfig,
    isXs: state.screenKey === 'xs',
    isSm: state.screenKey === 'sm',
    isMd: state.screenKey === 'md',
    isLg: state.screenKey === 'lg',
    isXl: state.screenKey === 'xl',
    isBig: state.screenKey === 'big',
  }
}
