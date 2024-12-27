import { useCallback, useMemo } from 'react'

import { useNextTick } from './use-next-tick'
import { useResettable } from './use-resettable'

export type UseFloatOptions<T> = {
  onError?: (e: any) => void
  onConfirm?: (res: any) => void | Promise<void>
  onOpen?: (e?: any) => void
  onClose?: () => void
  confirmedClose?: boolean
  initialValue?: T
}

export type FloatData<T> = {
  visible: boolean
  data?: T
}
export function useFloat<T = any>({
  onClose,
  onConfirm,
  onError,
  onOpen,
  initialValue,
  confirmedClose = true,
}: UseFloatOptions<T>) {
  const {
    data: floatData,
    setData: setFloatData,
    reset: resetFloatData,
  } = useResettable<FloatData<T>>({
    visible: false,
    data: initialValue,
  })
  const nextTick = useNextTick()

  const open = useCallback(
    (data: T) => {
      setFloatData((d) => {
        d.visible = true
        if (data) {
          //@ts-ignore
          d.data = data
        }
      })
      nextTick(() => {
        onOpen?.()
      })
    },
    [onOpen],
  )

  const close = useCallback(() => {
    resetFloatData()
    nextTick(() => {
      onClose?.()
    })
  }, [onClose, resetFloatData])

  const confirm = useCallback(async () => {
    try {
      await onConfirm?.(floatData.data)
      if (confirmedClose) {
        close()
      }
    } catch (error) {
      onError?.(error)
    } finally {
    }
  }, [onConfirm, floatData.data, onError, close, confirmedClose])

  const hasData = useMemo(() => !!floatData.data, [floatData.data])
  const setData = (data: T) => {
    setFloatData((d) => {
      //@ts-ignore
      d.data = data
    })
  }
  return {
    floatData,
    hasData,
    setData,
    confirm,
    open,
    close,
  }
}
