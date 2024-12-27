import { IocContainer } from './interfaces'
import cookies from 'js-cookie'
export class CookieHelper {
  private domain: string
  constructor({ config }: IocContainer) {
    this.domain = config.get('cookieDomain')
  }
  get(key: string) {
    return cookies.get(key)
  }
  set(key: string, value: string) {
    return cookies.set(key, value)
  }
  remove(key: string) {
    return cookies.remove(key)
  }
}
