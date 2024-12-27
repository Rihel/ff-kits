import { AppStorage } from '@ff-kits/core'
import { AwilixContainer } from 'awilix'
import { Config } from '../config'
import { CookieHelper } from '../cookie.helper'
import { TokenHelper } from '../token.helper'

export interface IocContainer {
  ioc: AwilixContainer
  config: Config
  configData: Record<string, any>
  cookieHelper: CookieHelper
  tokenHelper: TokenHelper
  storage: AppStorage
}
