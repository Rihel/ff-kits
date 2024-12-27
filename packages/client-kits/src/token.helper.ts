import { CookieHelper } from "./cookie.helper"
import { IocContainer } from "./interfaces"

export class TokenHelper {
  private tokenKey: string
  private cookieHelper: CookieHelper
  constructor({ config, cookieHelper }: IocContainer) {
    this.tokenKey = config.get('tokenKey')
    this.cookieHelper = cookieHelper
  }
  get() {
    return this.cookieHelper.get(this.tokenKey)
  }
  set(value: string) {
    return this.cookieHelper.set(this.tokenKey, value)
  }
  remove() {
    return this.cookieHelper.remove(this.tokenKey)
  }
}
