import * as _ from 'lodash'

import { EventEmitter } from '@ff-kits/core'
import classNames from 'classnames'
import { createBreakpoints } from '@ff-kits/base'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: any[]) {
  return twMerge(classNames(...inputs))
}

export const breakpoints = createBreakpoints({
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
})

const breakpointList = _.chain(breakpoints)
  .entries()
  .map(([screenKey, [min, max]]) => {
    return {
      key: screenKey,
      min,
      max,
    }
  })
  .orderBy('min', 'asc')
  .value()

export type MediaQueryEvent = {
  screenKey: string
  width: number
  height: number
}
class MediaQuery extends EventEmitter<'change'> {
  public screenKey: string
  private handleResize: EventListenerOrEventListenerObject
  constructor() {
    super()
    this.initial()
  }
  get currentState() {
    return {
      screenKey: this.screenKey,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  private initial() {
    this.screenKey = this.getScreenKey(window.innerWidth)
    this.handleResize = _.throttle(() => {
      this.screenKey = this.getScreenKey(window.innerWidth)
      this.emit('change', this.currentState)
    }, 200)
    window.addEventListener('resize', this.handleResize)
  }
  stop() {
    window.removeEventListener('resize', this.handleResize)
  }

  getScreenKey(width: number) {
    for (const key in breakpoints) {
      if (Object.prototype.hasOwnProperty.call(breakpoints, key)) {
        const [min, max] = breakpoints[key]
        if (width >= min && width < max) {
          return key
        }
      }
    }
  }

  /**
   * 根据传入的屏幕配置，获取适配当前屏幕的值，模拟bootstrap的移动设备优先适配方案
   * @param config
   * @returns
   */

  getScreenKeyByConfig(config: Record<string, any>) {
    const checkList = _.chain(config)
      .keys()
      .map((key) => {
        const breakpoint = breakpoints[key]
        return {
          key,
          min: breakpoint[0],
          max: breakpoint[1],
        }
      })
      .orderBy('min', 'desc')
      .value()
    let key: string

    for (let i = 0; i < checkList.length; i++) {
      if (this.currentState.width >= checkList[i].min) {
        key = checkList[i].key
        break
      }
    }
    const res = { key, value: config?.[key] }

    return res
  }
}

export const mediaQuery = new MediaQuery()
