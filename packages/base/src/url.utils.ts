import qs from 'qs'

export function parseUrlString<
  T extends { url: string; params: Record<string, any> } = {
    url: string
    params: Record<string, any>
  },
>(url = '') {
  const res: T = {} as T
  const [host, params] = url.split('?').filter(Boolean)
  res.url = host
  if (params) {
    res.params = qs.parse(params)
  }

  return res
}

export function json2queryString(json: Record<string, any>) {
  return qs.stringify(json)
}
