import { Context, useContext, useMemo } from 'react'

import _ from 'lodash'
import { getDataByPriority } from '@ff-kits/base'

export const useResolveData = <
  P extends Record<string, any> = Record<string, any>,
  C extends Context<Partial<P>> = Context<Partial<P>>,
>(
  context: C,
  props: P,
  field: keyof P,
  defaultValue: P[keyof P]
) => {
  const ctxData = useContext(context) || ({} as P)
  return useMemo(() => {
    const arr = [props[field], ctxData[field], defaultValue]
    return getDataByPriority(arr)
  }, [props, ctxData, defaultValue])
}

export const useResolveDataMultiple = <
  P extends Record<string, any> = Record<string, any>,
  C extends Context<Partial<P>> = Context<Partial<P>>,
>(
  context: C,
  props: P,
  fields: [keyof P, P[keyof P]?][] = []
) => {
  const ctxData = useContext(context) || ({} as P)

  return useMemo(() => {
    return fields.reduce<Partial<P>>((acc, [field, defaultValue]) => {
      const arr = [props[field], ctxData[field], defaultValue]
      const res = getDataByPriority(arr)
      acc[field] = res
      return acc
    }, {})
  }, [props, ctxData, fields])
}
