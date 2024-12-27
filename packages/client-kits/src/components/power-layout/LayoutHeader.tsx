import { ReactNode, memo, useCallback, useContext, useMemo } from 'react'

import { FFIcon } from '../icon'
import { MenuItem } from './interface'
import { PowerLayoutContext } from './context'
import { Segmented } from 'antd'
import _ from 'lodash'
import { getTitle } from './utils'

export type LayoutHeaderProps = Partial<{
  title: string
  menus: MenuItem[]
  onMenuClick: (menu: MenuItem) => void
  activeMenuKey: string
  showBack: boolean
  extra: ReactNode
  onBackClick: () => void
}>

export const LayoutHeader = memo<LayoutHeaderProps>(
  ({
    title = '',
    menus = [],
    onMenuClick,
    activeMenuKey = '',
    showBack = false,
    onBackClick,
    extra,
  }) => {
    const { language } = useContext(PowerLayoutContext)
    const options = useMemo(() => {
      return menus.map((item) => {
        const label = getTitle(item, language)
        return {
          ...item,
          label: label,
          value: item.key,
        }
      })
    }, [menus, language])

    const handleChange = useCallback(
      (value: string) => {
        const menu = _.find(menus, { key: value })
        onMenuClick?.(menu)
      },
      [menus, onMenuClick],
    )

    return (
      <div
        className="sticky top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 shadow-base-down shrink-0"
        style={{
          minHeight: 56,
        }}
      >
        <div className="flex items-center gap-3 font-bold cursor-pointer">
          {showBack && (
            <span
              onClick={onBackClick}
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-md"
            >
              <FFIcon type="arrow-left-outlined" />
            </span>
          )}
          {title}
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <Segmented
            options={options}
            // size="large"
            value={activeMenuKey}
            onChange={handleChange}
          />
        </div>
        <div className="absolute flex items-center justify-center gap-3 right-4">
          {extra}
        </div>
      </div>
    )
  },
)
