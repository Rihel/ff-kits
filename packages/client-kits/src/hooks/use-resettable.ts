import { useRef, useState } from 'react'

import _ from 'lodash'
import { useImmer } from 'use-immer'

export function useResettable<T extends any>(initialValue: T) {
  const defaultData = useRef(_.cloneDeep(initialValue))
  const [data, setData] = useImmer(_.cloneDeep(initialValue))
  function getDefaultData() {
    return _.cloneDeep(defaultData.current)
  }
  function reset() {
    setData(getDefaultData())
  }
  return { data, setData, reset, getDefaultData }
}
