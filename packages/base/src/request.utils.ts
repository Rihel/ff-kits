import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import _ from 'lodash'
import { createCacheManager } from './cache.utils'
import { createJsonMd5 } from './md5.utils'

const defaultOptions = {
  baseURL: '/',
  isCache: false,
  cacheTime: 30 * 1000,
  beforeRequest(config: InternalAxiosRequestConfig) {
    return config
  },
  onError(error: AxiosError) {},
  onResponse(res: AxiosResponse): any {
    return res
  },
}

export type CreateRequestOptions = Partial<typeof defaultOptions>
type RequestMethod = 'get' | 'post' | 'delete' | 'put'
const requestMethods: RequestMethod[] = ['get', 'post', 'delete', 'put']

type CustomRequestMethodOptions = AxiosRequestConfig & {
  isCache?: boolean
}

export type RequestFunction<
  Response extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>,
> = (
  data?: Params,
  options?: CustomRequestMethodOptions
) => Promise<AxiosResponse<Response>>

type ApiDefinition = {
  url: string
  method: RequestMethod
  fn: RequestFunction
}
export type RequestInstance = {
  callApi(
    name: string,
    params: Record<string, any>,
    options?: CustomRequestMethodOptions
  ): Promise<any>
  defineApi(name: string, url: string, method: RequestMethod): RequestFunction
} & {
  [M in RequestMethod]: (
    url: string,
    data: Record<string, any>,
    options?: CustomRequestMethodOptions
  ) => Promise<AxiosResponse>
} & {
  // [key: string]: RequestFunction
}

type RequestCacheKey = {
  url: string
  method: RequestMethod
  headers: Partial<Record<string, any>>
  params?: Record<string, any>
}

export function createRequest(options: CreateRequestOptions) {
  const res: any = {}
  const apiMap: Record<string, ApiDefinition> = {}
  options = _.merge(_.cloneDeep(defaultOptions), options)
  const cache = createCacheManager({
    cacheTime: 30 * 1000,
    genKey: (data) => {
      return createJsonMd5(data) as string
    },
  })
  const client = axios.create({
    baseURL: options.baseURL,
  })

  // 设置中间件
  client.interceptors.request.use((config) => {
    const makeConfig = options.beforeRequest?.(config)
    config.params = {
      ...(makeConfig?.params || {}),
      _: Date.now(),
    }
    return config
  })
  client.interceptors.response.use(
    (res) => {
      res = options.onResponse?.(res) || res
      return res
    },
    (error) => {
      options.onError?.(error)
      return Promise.reject(error)
    }
  )

  // 代理请求方法
  requestMethods.forEach((methodKey) => {
    res[methodKey] = (
      url: string,
      data: Record<string, any>,
      options: CustomRequestMethodOptions
    ) => {
      let isCache = false
      let headers = {}
      if (typeof options === 'boolean') {
        isCache = options
      } else if (_.isObject(options)) {
        if (_.has(options, 'isCache')) {
          isCache = options.isCache as boolean
        }

        if (_.has(options, 'headers') && _.isObject(options.headers)) {
          headers = options.headers
        }
      }

      const obj: Partial<CustomRequestMethodOptions> = {
        url,
        method: methodKey,
        headers,
      }
      const cacheKey: RequestCacheKey = {
        url,
        method: methodKey,
        headers,
        params: data,
      }

      if (_.has(options, 'responseType')) {
        obj.responseType = _.get(options, 'responseType')
      }
      if (_.has(options, 'cancelToken')) {
        obj.cancelToken = _.get(options, 'cancelToken')
      }
      if (data) {
        if (['get', 'delete'].includes(methodKey)) {
          obj.params = data
        } else if (['post', 'put'].includes(methodKey)) {
          obj.data = data
          if (_.has(options, 'params')) {
            obj.params = _.get(options, 'params')
          }
        }
      }

      if (isCache) {
        if (cache.hasCache(cacheKey) && !cache.isExpire(cacheKey)) {
          return Promise.resolve(cache.getCacheData(cacheKey))
        }
      }
      return client.request(obj).then((res) => {
        if (isCache) {
          cache.setCache(cacheKey, res)
        }
        return res
      })
    }
  })

  function resolveApi(name: string) {
    return apiMap[name]
  }

  function callApi(
    name: string,
    params: Record<string, any>,
    options: AxiosRequestConfig
  ) {
    const api = resolveApi(name)
    return api?.fn?.(params, options)
  }

  function defineApi(name: string, url: string, method: RequestMethod) {
    const fn: RequestFunction = (
      data?: Record<string, any>,
      options?: AxiosRequestConfig
    ) => {
      return res[method](url, data, options)
    }
    apiMap[name] = {
      url,
      method,
      fn,
    }
    res[name] = fn

    return fn
  }
  res.defineApi = defineApi
  res.callApi = callApi
  return res as RequestInstance
}
