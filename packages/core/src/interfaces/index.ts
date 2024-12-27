import { AxiosResponse } from 'axios'
import { RequestFunction } from '@ff-kits/base'

export interface AppResponse<T extends unknown = unknown> {
  code: 0 | -1 | number
  message?: string
  data?: T
}

export type AppPageResponse<T extends unknown = unknown> = AppResponse<{
  total: number
  data: T[]
}>

export type PagerResponse<T extends unknown = unknown> = {
  total: number
  data: T[]
}

export type ApiResult<T> = AxiosResponse<AppResponse<T>>
export type ApiPageResult<T> = AxiosResponse<AppPageResponse<T>>
export type ApiFun<
  Result,
  Params extends Record<string, any> = Record<string, any>,
> = RequestFunction<AppResponse<Result>, Params>

export type LocaleLanguage = 'zh-CN' | 'en-US'
