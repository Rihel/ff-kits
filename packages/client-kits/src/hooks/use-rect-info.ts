import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import _ from 'lodash'
import { useImmer } from 'use-immer'

export type RectInfo = {
  width: number
  height: number
  top: number
  left: number
  x: number
  y: number
  // y轴滚动总高度
  scrollHeight: number
  // x轴滚动总宽度
  scrollWidth: number
  // y轴滚动的距离
  scrollTop: number
  // y轴滚动的距离
  scrollLeft: number
  restScrollHeight: number
  restScrollWidth: number
}

export type UseRectInfoOptions = {
  debounce?: {
    resize?: number
    scroll?: number
  }
  onScroll?: (rect: RectInfo) => void
  onResize?: (rect: RectInfo) => void
}

export function getRectInfo(dom: HTMLElement) {
  if (!dom) return null
  const rect = dom?.getBoundingClientRect?.()
  const rectInfo = {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    x: rect.x,
    y: rect.y,
    scrollTop: dom.scrollTop,
    scrollLeft: dom.scrollLeft,
    scrollHeight: dom.scrollHeight,
    scrollWidth: dom.scrollWidth,
    restScrollHeight: Math.max(dom.scrollHeight - rect.height - dom.scrollTop, 0),
    restScrollWidth: Math.max(dom.scrollWidth - rect.width - dom.scrollLeft, 0)
  }
  return rectInfo
}
export const useRectInfo = <T extends HTMLElement = HTMLDivElement>(
  { debounce, onResize, onScroll }: UseRectInfoOptions = {
    debounce: {
      resize: 100,
      scroll: 100
    }
  }
) => {
  const { resize, scroll } = debounce || {}
  const ref = useRef<T>()
  const [rectInfo, setRectInfo] = useState<RectInfo>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    scrollHeight: 0,
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    restScrollHeight: 0,
    restScrollWidth: 0
  })

  const updateInfo = useCallback(() => {
    const dom = ref.current!
    if (!dom) return

    const newRect = getRectInfo(dom)
    setRectInfo(newRect)
    return newRect
  }, [])

  const handleResize = useMemo(
    () =>
      _.debounce(() => {
        const res = updateInfo()
        onResize?.(res)
      }, resize),
    [updateInfo, onResize, resize]
  )

  const handleScroll = useMemo(
    () =>
      _.debounce(() => {
        const res = updateInfo()
        onScroll?.(res)
      }, scroll),
    [updateInfo, onScroll, scroll]
  )

  useEffect(() => {
    const dom = ref.current
    if (dom) {
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(dom)
      dom.addEventListener('scroll', handleScroll)
      return () => {
        resizeObserver.disconnect()
        dom?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [updateInfo, handleResize, handleScroll])

  // console.log(rectInfo)
  return [ref, rectInfo] as const
}
