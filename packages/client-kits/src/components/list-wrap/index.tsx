import {
  CSSProperties,
  ReactNode,
  Ref,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Empty, Spin } from 'antd'
import { RectInfo, getRectInfo, useMediaQuery } from 'src/hooks'
import _, { max } from 'lodash'

import { cn } from 'src/lib'
import { useImmer } from 'use-immer'

export type ListWrapProps<
  Data extends Record<string, any> = Record<string, any>,
> = Partial<{
  loading: boolean
  dataSource: Data[]

  renderItem: (
    data: Data,
    index: number,
    ref?: (el: HTMLDivElement) => void,
    columnWidth?: number,
  ) => ReactNode
  emptyText: ReactNode
  columns: number | Record<string, number>
  gap: number
  minHeight: number
  rowKey: keyof Data
  space: { x?: number; y?: number } | number
  itemClassName: string
}>

const InternalListWrap = forwardRef<HTMLDivElement, ListWrapProps>(
  (
    {
      loading,
      dataSource,
      emptyText,
      renderItem,

      minHeight = 200,
      gap = 0,
      rowKey = 'id',
      columns,
      space = 0,
      itemClassName,
    },
    ref,
  ) => {
    const [meta, setMeta] = useImmer({
      columnWidth: 0,
      rowHeight: 0,
      height: 0,
      maxRowCount: 0,
    })
    const { getScreenKeyByConfig } = useMediaQuery()

    const cols = useMemo(() => {
      if (!columns) return 1
      if (typeof columns === 'number') {
        return columns
      }

      const res = getScreenKeyByConfig(columns)
      return res.value
    }, [columns, getScreenKeyByConfig])

    const itemRefs = useRef<HTMLDivElement[]>([])

    const [visibleItems, setVisibleItems] = useImmer<any[]>([])
    const [wrapHeight, setWrapHeight] = useImmer<number>(0)
    const wrapRef = useRef<HTMLDivElement>()
    const scrollRef = useRef<HTMLDivElement>()
    const setItemRef = useCallback((node: HTMLDivElement, index: number) => {
      if (node) {
        itemRefs.current[index] = node
      }
    }, [])
    const handleScroll = useCallback(
      (currentRectInfo?: RectInfo) => {
        if (currentRectInfo) {
          const { scrollTop } = currentRectInfo
          const row = Math.floor(scrollTop / (meta.rowHeight + gap))
          const startIndex = row * cols
          const endIndex = startIndex + meta.maxRowCount * cols

          let rowIndex = -1
          const items = dataSource.reduce<any[]>((acc, item, index) => {
            const columnIndex = index % cols
            if (columnIndex === 0) {
              rowIndex += 1
            }
            if (index >= startIndex && index < endIndex) {
              return [
                ...acc,
                {
                  index,
                  columnIndex: index % cols,
                  rowIndex: rowIndex,
                  data: item,
                },
              ]
            }
            return acc
          }, [])
          const newItems = items.map((item) => {
            const { data, rowIndex, columnIndex, index } = item
            return (
              <div
                className={itemClassName}
                style={{
                  position: 'absolute',
                  left: columnIndex * (meta.columnWidth + gap),
                  top: rowIndex * (meta.rowHeight + gap),
                  width: meta.columnWidth,
                  height: meta.rowHeight,
                }}
                key={data[rowKey]}
              >
                {renderItem(
                  data,
                  index,
                  (el) => setItemRef(el, index),
                  meta.columnWidth,
                )}
              </div>
            )
          })

          setVisibleItems(newItems)
        }
      },
      [meta, gap, cols, dataSource, rowKey, renderItem, itemClassName],
    )

    const updateMeta = useCallback(() => {
      const rectInfo = getRectInfo(wrapRef.current!)
      if (rectInfo) {
        const xSpace = typeof space === 'number' ? space : space.x || 0
        const ySpace = typeof space === 'number' ? space : space.y || 0
        setWrapHeight(rectInfo.height)

        const gapXSize = gap * (cols - 1)
        const rowHeight = Math.max(
          ...itemRefs.current
            .map((item) => item?.getBoundingClientRect().height)
            .filter(Boolean),
          minHeight,
        )

        const columnWidth = Math.floor(
          (rectInfo.width - gapXSize - xSpace * 2) / cols,
        )
        // 最多显示几行
        const maxRowCount = Math.ceil(
          (rectInfo.height + rowHeight + ySpace * 2) / rowHeight,
        )

        // 总共几行
        const totalRowCount = Math.ceil(dataSource.length / cols)
        const gapYSize = gap * (totalRowCount - 1)
        const height = rowHeight * totalRowCount + gapYSize

        setMeta((d) => {
          d.columnWidth = columnWidth
          d.rowHeight = rowHeight
          d.height = height
          d.maxRowCount = maxRowCount
        })
      }
    }, [dataSource.length, cols, gap, minHeight])

    useEffect(() => {
      const rowHeight = Math.max(
        ...itemRefs.current
          .map((item) => item?.getBoundingClientRect?.()?.height)
          .filter(Boolean),
        minHeight,
      )

      setMeta((d) => {
        if (d.rowHeight !== rowHeight) {
          d.rowHeight = rowHeight
          d.height = d.maxRowCount * rowHeight
        }
      })
    }, [visibleItems])

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current?.scrollTo(0, 0)
      }
    }, [dataSource.length])

    useEffect(() => {
      // console.log('meta', JSON.stringify(meta))
      if (wrapRef.current && scrollRef.current) {
        updateMeta()
        if (scrollRef.current) {
          // scrollRef.current.scrollTop = 0
          const effect = () => {
            setTimeout(() => {
              if (scrollRef.current) {
                const scrollRectInfo = getRectInfo(scrollRef.current!)

                handleScroll(scrollRectInfo)
              }
            })
          }

          // effect()
          const ob = new ResizeObserver((dom) => {
            updateMeta()
            effect()
          })
          scrollRef.current.addEventListener('scroll', effect)
          ob.observe(scrollRef.current)
          return () => {
            ob.disconnect()
            scrollRef.current?.removeEventListener('scroll', effect)
          }
        }
      }
    }, [updateMeta, handleScroll])

    // useWhyDidUpdate('list-wrap', className)

    const wrapPadding = useMemo(() => {
      const res: CSSProperties = {}
      if (typeof space === 'number') {
        res.padding = space
        return res
      }
      const { x, y } = space
      if (x) {
        res.paddingLeft = x
        res.paddingRight = x
      }
      if (y) {
        res.paddingTop = y
        res.paddingBottom = y
      }
      return res
    }, [space])

    return (
      <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
        <Spin spinning={loading}>
          {dataSource?.length ? (
            <div
              className={cn('y-scroll')}
              ref={scrollRef}
              style={{ height: wrapHeight, ...wrapPadding }}
            >
              <div
                style={{
                  position: 'relative',
                  height: meta.height,
                }}
              >
                {visibleItems}
              </div>
            </div>
          ) : (
            <div className="py-6">
              <Empty description={emptyText} />
            </div>
          )}
        </Spin>
      </div>
    )
  },
)

export const ListWrap = memo(InternalListWrap) as <
  Data extends Record<string, any>,
>(
  props: ListWrapProps<Data> & {
    ref?: Ref<HTMLDivElement>
  },
) => ReactNode
