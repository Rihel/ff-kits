import { createDictByDataSource } from '@ff-kits/base'
import { useMemo } from 'react'

export type UseEntityDictOptions<T> = {
  labelKey: keyof T | ((v: T) => string)
  valueKey: keyof T
  all?: boolean
  allI18n?: Record<string, any>
}

/**
 * 将业务数据列表转换为字典对象
 */
export function useEntityDict<T extends Record<string, any>>(
  dataSource: T[],
  options?: UseEntityDictOptions<T>
) {
  const dict = useMemo(() => {
    return createDictByDataSource(dataSource, options)
  }, [dataSource])
  return dict
}
