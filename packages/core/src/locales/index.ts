import { Dict, createTemplateEngine, hasContentArray } from '@ff-kits/base'

import { Language } from '../dicts'
import _ from 'lodash'

export type I18nResource = {
  [key: string]: {
    translation: Record<string, any>
  }
}

export const adapterToI18n = (data: Record<string, any>): I18nResource => {
  const res: any = {}

  Language.options.forEach((item) => {
    res[item.value] = {
      translation: {},
    }
  })

  const walk = (
    source: Record<string, any>,
    keyPath: string[] = [],
    depth = 1
  ) => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key]

        if (Language.values.includes(key)) {
          // const path = keyPath.join('.')

          _.set(res, [key, 'translation', ...keyPath], value)
        } else {
          walk(value, [...keyPath, key], depth + 1)
        }
      }
    }
  }

  walk(data, [], 1)

  return res
}

export const adapterDictToI18n = (data: Dict | Dict[]): I18nResource => {
  const res: any = {}
  Language.options.forEach((langOption) => {
    const language = langOption.value
    res[language] = {
      translation: {
        dicts: {},
      },
    }
  })

  const dicts = Array.isArray(data) ? data : [data]
  dicts.forEach((dict) => {
    dict.options.forEach((option) => {
      Language.options.forEach((langOption) => {
        const language = langOption.value
        const value = _.get(option, ['i18n', language])
        const key = option.t || option.value
        _.set(res, [language, 'translation', 'dicts', key], value)
      })
    })
  })
  return res
}

export const mergeResources = (...resources: I18nResource[]) => {
  const res: I18nResource = {}
  Language.options.forEach((langOption) => {
    const language = langOption.value
    res[language] = {
      translation: {
        dicts: {},
      },
    }
  })
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i]

    for (const language in resource) {
      if (Object.prototype.hasOwnProperty.call(resource, language)) {
        const words = resource[language].translation
        for (const key in words) {
          if (Object.prototype.hasOwnProperty.call(words, key)) {
            const value = words[key]
            _.set(res, [language, 'translation', key], value)
          }
        }
      }
    }
  }
  return res
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const i18nTplEngine = createTemplateEngine({ start: '$t(', end: ')' })
// 英文需要首字母大写
// 如果是词条是过个词条匹配的，那么不需要处理
export const i18NextEnglishPlugin = {
  type: 'postProcessor',
  name: 'englishProcessor',
  process: (value: string, key: string[], options: any, translator: any) => {
    const rawValue = translator.getResource(
      options.lng,
      'translation',
      _.head(key)
    )
    const variables = i18nTplEngine.resolveVariables(rawValue)
    if (hasContentArray(variables)) {
      const values = variables.reduce((acc, item) => {
        let word = ''
        try {
          word = translator.translate(item.name)
        } catch (error) {
          console.error(
            '错误哦',
            value,
            key,
            item.name,
            variables,
            error.message
          )
        }
        return _.set(acc, item.name, ` ${word} `)
      }, {})
      if (options.lng !== Language.ZhCn) {
        const str = i18nTplEngine.render(rawValue, values)
        const res = capitalizeFirstLetter(str)
        return res
      }
    }

    return capitalizeFirstLetter(value)
  },
}
