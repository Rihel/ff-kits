import { ApiResult, AppPageResponse, AppResponse } from '@ff-kits/core'
import { createRetryFun, isAvailableData } from '@ff-kits/base'

import { AxiosResponse } from 'axios'
import _ from 'lodash'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

export type Service<T> = (...args: any) => Promise<T> | T

export type UseRequestCache = {
  key: string | Function
  time: number
}
export type UseRequestOptions<
  Res = any,
  Trans = any,
  SerFun extends Service<Res> = Service<Res>,
> = Partial<{
  transform: (v: Res) => Trans
  onSuccess: (data: Trans, ...args: Parameters<SerFun>) => void
  onError: (error: Error, ...args: Parameters<SerFun>) => void
  retryCount: number | null
  initialValue: Trans | null
  manual: boolean
  initialLoading: boolean
  cache: UseRequestCache | null
}>

const defaultOptions: UseRequestOptions = {
  transform: (v) => v,
  onSuccess: (data) => {},
  onError: (data) => {},
  retryCount: null,
  initialValue: null,
  manual: false,
  initialLoading: false,
  cache: null,
}

const forkOptions = (options: UseRequestOptions) => {
  return {
    ...defaultOptions,
    ...options,
  }
}

const cacheMap = new Map()

export type TransformFun<T> = (res: ApiResult<T>) => T

export const transforms = {
  getData: (res: AppResponse) => res.data,
  getPageData: (res: AppPageResponse) => _.get(res, 'data'),

  getDataWithAxios: (res: AxiosResponse<AppResponse>) => res.data.data,
  getPageDataWithAxios: (res: AxiosResponse<AppPageResponse>) =>
    res.data.data?.data,
}

export const useRequest = <Res, Trans>(
  service: Service<Res>,
  options: UseRequestOptions<Res, Trans> = {}
) => {
  options = forkOptions(options)

  const [data, setData] = useImmer<Trans | undefined>(options.initialValue!)
  const [loading, setLoading] = useImmer(options?.initialLoading || false)
  const [error, setError] = useImmer<any>(null)
  const transform = (res: Res) => {
    return options?.transform?.(res)
  }
  const callService = async (...args: Parameters<Service<Res>>) => {
    let res,
      force = _.last(args ?? [])
    if (isAvailableData(options.cache)) {
      // 走缓存
      // 过期时间单位为毫秒
      const { key, time } = options.cache as UseRequestCache
      let cacheKey,
        cacheTime = time ?? 30 * 1000
      if (_.isString(key)) {
        cacheKey = key
      } else if (_.isFunction(key)) {
        cacheKey = key(...args)
      }
      if (cacheMap.has(cacheKey)) {
        const cacheContent = cacheMap.get(cacheKey)
        const t = Date.now() - cacheContent.time
        // 超时处理
        if (t > cacheTime || (_.isBoolean(force) && force)) {
          res = await service(...args)
          cacheMap.set(cacheKey, {
            time: Date.now(),
            data: res,
          })
        } else {
          // 未超时
          res = cacheContent.data
        }
      } else {
        // 未缓存
        res = await service(...args)
        cacheMap.set(cacheKey, {
          time: Date.now(),
          data: res,
        })
      }
    } else {
      // 不走缓存
      res = await service(...args)
    }
    return res
  }
  const _run = async (...args: Parameters<Service<Res>>) => {
    try {
      setLoading(true)
      let res = await callService(...args)
      const transformedData = transform(res)
      setData(transformedData)
      options.onSuccess?.(transformedData as Trans, ...args)

      return transformedData
    } catch (err: any) {
      options.onError?.(err, ...args)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }
  const run = createRetryFun(_run, options.retryCount as any)

  useEffect(() => {
    if (options.manual === false) {
      run()
    }
  }, [])
  return {
    data,
    loading,
    error,
    run,
    setData,
  }
}
