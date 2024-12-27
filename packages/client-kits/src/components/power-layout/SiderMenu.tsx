import { HTMLAttributes, MouseEvent, memo, useCallback } from 'react'

import { Divider } from 'antd'
import { MenuItem } from './interface'
import { SiderMenuItem } from './SiderMenuItem'
import { cn } from '../../lib/css'

export type SiderMenuProps = Partial<{
  menus: MenuItem[]
  checkIsActive?: (menu: MenuItem, idx: number) => boolean
  onClick: (menu: MenuItem, event: MouseEvent) => void
  active: boolean
  collapsed: boolean
  className: string
}>
export const SiderMenu = memo(
  ({
    menus = [],
    collapsed,
    className,
    onClick,
    checkIsActive,
  }: SiderMenuProps) => {
    const handleMenuClick = useCallback(
      (event: MouseEvent, menuItem: MenuItem) => {
        onClick?.(menuItem, event)
      },
      [onClick],
    )
    return (
      <div className={cn('px-2 space-y-2', className)}>
        {menus.map((item, idx) => {
          if (item.divider) {
            return (
              <div className="px-4" key={`divider${idx}`}>
                <Divider style={{ margin: 0 }} />
              </div>
            )
          }
          const active = checkIsActive?.(item, idx)
          return (
            <SiderMenuItem
              menuItem={item}
              key={item.key}
              onClick={(e) => handleMenuClick(e, item)}
              active={active}
              collapsed={collapsed}
            />
          )
        })}
      </div>
    )
  },
)
