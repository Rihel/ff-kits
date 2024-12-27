import { ioc } from '../ioc'

export function useAppStorage() {
  const appStorage = ioc.resolve('storage')
  return appStorage
}
