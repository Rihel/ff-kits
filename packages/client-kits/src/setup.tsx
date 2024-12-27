import { AppStorage, StorageOptions } from '@ff-kits/core'
import { CreateRequestOptions, isAvailableData } from '@ff-kits/base'
import { IocContext, ioc } from './ioc'
import { asClass, asValue } from 'awilix'

import { Config } from './config'
import { CookieHelper } from './cookie.helper'
import { KitLocaleProvider } from './i18n'
import React from 'react'
import { TokenHelper } from './token.helper'

export interface SetupOptions {
  apiConfig: CreateRequestOptions
  configData: Record<string, any>
  children: React.ReactElement | null
  storageOptions: StorageOptions
}

export function Setup({
  apiConfig,
  configData,
  storageOptions,
  children,
}: SetupOptions) {
  const appStorage = new AppStorage(storageOptions)
  configData = configData || {}
  configData = {
    ...configData,
    cookieDomain: isAvailableData(configData.cookieDomain)
      ? configData.cookieDomain
      : location.host,
  }

  ioc.register({
    storage: asValue(appStorage),
    configData: asValue(configData),
    cookieHelper: asClass(CookieHelper).singleton(),
    config: asClass(Config).singleton(),
    tokenHelper: asClass(TokenHelper).singleton(),
  })

  return (
    <IocContext.Provider value={ioc}>
      <KitLocaleProvider language={configData.language}>
        {children}
      </KitLocaleProvider>
    </IocContext.Provider>
  )
}
