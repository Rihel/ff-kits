import _ from 'lodash'
import { isAvailableData } from './is.utils'

type Names = Record<string, string[]> | string[]

export const createCssSelector = (
  prefix: string,
  names: Names,
  globalPrefix = 'st'
) => {
  const res = Object.create(null)
  const def = (key: string, value: string) => {
    if (isAvailableData(key)) {
      _.set(res, key, value)
    }
  }

  const walk = (map: Names = {}, parent?: any) => {
    for (const key in map) {
      const value = map[key as keyof Names]
      const currentKey = _.isArray(map)
        ? _.isObject(value)
          ? null
          : value
        : key
      let isParent = _.isObject(value) || _.isArray(value)
      if (isParent) {
        const keys = parent ? [...parent.keys, currentKey] : [currentKey]
        walk(value as Names, {
          keys: keys.filter(Boolean),
          value,
          isArray: _.isArray(value),
        })
      }
      let cssKeys = [],
        cssName = ''

      if (parent) {
        cssKeys = [prefix, ...parent.keys, currentKey]
      } else {
        cssKeys = [prefix, currentKey]
      }

      cssName = [globalPrefix, ...cssKeys].join('-')
      cssKeys.shift()
      // @ts-ignore
      def(_.camelCase(cssKeys.map((item) => _.camelCase(item))), cssName)
    }
  }
  walk(names)
  def(_.camelCase(prefix), [globalPrefix, prefix].join('-'))
  return res
}

export const px2vw = (data: number) => `${(data / 750) * 100}vw`
