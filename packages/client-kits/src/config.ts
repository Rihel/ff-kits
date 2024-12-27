import { IocContainer } from './interfaces'
import _ from 'lodash'

export class Config {
  private data: Record<string, any>
  constructor({ configData }: IocContainer) {
    this.data = configData
  }
  get(key: string | string[]) {
    return _.get(this.data, key)
  }
}
