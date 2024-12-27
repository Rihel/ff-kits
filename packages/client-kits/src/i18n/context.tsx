import { KitI18n, TranslationOptions } from './kit-i118n'
import { Language, adapterToI18n } from '@ff-kits/core'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import enUs from './locales/en-US.json'
import { getDataByPriority } from '@ff-kits/base'
import { useForceUpdate } from '../hooks'
import zhCN from './locales/zh-CN.json'

type translation = KitI18n['translation']
type KitI18nContextData = {
  t: translation
} & Pick<KitI18n, 'changeLanguage' | 'loadLocales' | 'language'>

export const kitI18n = new KitI18n()

kitI18n.loadLocales({
  [Language.ZhCn]: {
    translation: zhCN,
  },
  [Language.EnUs]: {
    translation: enUs,
  },
})

export const KitI18nContext = createContext<KitI18nContextData | null>(null)

export type KitLocaleProviderProps = PropsWithChildren<{
  language?: string
}>
export const KitLocaleProvider = ({
  children,
  language,
}: KitLocaleProviderProps) => {
  const forceUpdate = useForceUpdate()
  const contextData: KitI18nContextData = {
    language: kitI18n.language,
    t: kitI18n.translation.bind(kitI18n),
    changeLanguage: kitI18n.changeLanguage.bind(kitI18n),
    loadLocales: kitI18n.loadLocales.bind(kitI18n),
  }

  useEffect(() => {
    if (language) {
      kitI18n.changeLanguage(language)
      forceUpdate()
    }
  }, [language])

  useEffect(() => {
    const handler = () => {
      forceUpdate()
    }

    kitI18n.on('change-language', handler)

    return () => {
      kitI18n.off('change-language', handler)
    }
  }, [])
  return (
    <KitI18nContext.Provider value={contextData}>
      {children}
    </KitI18nContext.Provider>
  )
}

export const useKitI18n = () => {
  return useContext(KitI18nContext) as KitI18nContextData
}

export function useKitI18nMemo<T extends () => unknown = () => unknown>(
  fn: T,
  deps: any[]
): ReturnType<T> {
  const { language } = useKitI18n()
  return useMemo(fn, [language, ...deps]) as unknown as ReturnType<T>
}

export const useKitI18nEntry = (
  key: string,
  ...args: Array<string | undefined>
): string => {
  const { t, language } = useKitI18n()
  return useMemo(() => {
    const res = getDataByPriority([t(key), ...args])

    return res
  }, [language, key, args, t])
}

export const useKitI18nTranslation = (keyPrefix?: string) => {
  const { t, language } = useKitI18n()
  const prefixKeys = useMemo(() => {
    return (keyPrefix || '').split('.')
  }, [keyPrefix])
  return useMemo(
    () => (key: string, options?: TranslationOptions) => {
      const actualKey = [...prefixKeys, key].filter(Boolean).join('.')
      return t(actualKey, options)
    },
    [language]
  )
}
