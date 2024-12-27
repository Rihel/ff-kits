import _ from 'lodash'
import { produce } from 'immer'
import { useForceUpdate } from './use-force-update'
import { useRef } from 'react'

/**
 * 可手动控制是否要重新渲染的hook
 * @param {Any} initialValue 初始值
 * @returns
 */
export function useRafState<T extends Record<string, any>>(initialValue: T, onChange?: (newState: T, oldState: T) => void) {
  if (!_.isObject(initialValue)) {
    throw new TypeError('useRafState 的 initialValue 必须是个对象')
  }
  const forceUpdate = useForceUpdate()
  const data = useRef(initialValue)
  const setData = (value: T | ((draft: T) => void), needUpdate = true) => {
    const newState =
      typeof value === 'function' ? produce(data.current, value) : value
    onChange?.(newState, data.current)
    data.current = newState

    if (needUpdate) {
      forceUpdate()
    }
  }

  return [data.current, setData, forceUpdate] as const
}
