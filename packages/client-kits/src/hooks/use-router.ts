import { NavigateOptions, useNavigate } from 'react-router-dom'

import _ from 'lodash'
import { json2queryString } from '@ff-kits/base'
import { useCallback } from 'react'

export type PushOptions = Partial<
  {
    query: Record<string, any>
    newTab: boolean
  } & NavigateOptions
>
export function useRouter() {
  const navigate = useNavigate()

  const push = useCallback(
    (path: string, { query, newTab = false, ...options }: PushOptions = {}) => {
      let url = path
      if (query && _.isObject(query)) {
        url += '?' + json2queryString(query)
      }

      if (newTab) {
        window.open(window.location.origin + '#' + url, '_blank')
        return
      }
      navigate(url, options)
    },
    [navigate]
  )

  return {
    push,
  }
}
