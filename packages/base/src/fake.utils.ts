import _ from 'lodash'
import { nanoid } from './nanoid.utils'

export type CreateFakeArrayOptions = Partial<{
  range: [number, number]
  idGenerateType: 'increment' | 'nanoId'
}>
export const createFakeArray = (
  creator: (id: string, index: number) => Record<string, any>,
  options?: CreateFakeArrayOptions,
) => {
  let idSeed = 0
  let min = options?.range?.[0] || 10
  let max = options?.range?.[1] || 100
  let total = _.random(min, max, false)
  let idGenerateType = options?.idGenerateType || 'nanoId'
  const dataSource = new Array(total).fill(0).map((item, idx) => {
    const id = idGenerateType === 'increment' ? ++idSeed : nanoid(5)
    return creator(id.toString(), idx)
  })

  const paginate = (page: number = 1, size: number = 10) => {
    const start = (page - 1) * size
    const end = page * size
    return dataSource.slice(start, end)
  }
  return {
    total,
    dataSource,
    paginate,
  }
}

export const randomChooseInArray = (array: any[]) => {
  return array[_.random(0, array.length - 1, false)]
}

export const randomTimestamp = () => {
  const year = _.random(2000, new Date().getFullYear(), false)
  const month = _.random(1, 12, false)
  const day = _.random(1, 28, false)
  const hour = _.random(0, 23, false)
  const minute = _.random(0, 59, false)
  const second = _.random(0, 59, false)
  return new Date(year, month - 1, day, hour, minute, second).getTime()
}
