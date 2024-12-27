import { I18nResource, Language, mergeResources } from '@ff-kits/core'
import {
  createTemplateEngine,
  getDataByPriority,
  renderTemplate,
} from '@ff-kits/base'

import { EventEmitter } from '@ff-kits/core'
import _ from 'lodash'

export type KitI18nEvents = 'change-language' | 'loaded-locales'
export type TranslationOptions = {
  language?: string
  data?: Record<string, any>
}
export class KitI18n extends EventEmitter<KitI18nEvents> {
  private locales: I18nResource

  public language: string
  private tpl = createTemplateEngine({
    start: '{{',
    end: '}}',
  })

  constructor() {
    super()
    this.initialLocales()
  }
  private initialLocales() {
    this.locales = {}
    Language.values.forEach((language) => {
      this.locales[language] = {
        translation: {},
      }
    })
  }

  changeLanguage(language: string) {
    this.language = language
    this.emit('change-language', this)
  }
  loadLocales(locales: I18nResource) {
    this.locales = mergeResources(this.locales, locales)
    this.emit('loaded-locales', this)
  }

  translation(key: string, options?: TranslationOptions) {
    const keys = key.split('.')

    const language = options?.language || this.language
    const entryPath = [language, 'translation', ...keys]
    const entry = _.get(this.locales, entryPath, key)
    let res = this.tpl.render(entry, options?.data)
    return res
  }
}
