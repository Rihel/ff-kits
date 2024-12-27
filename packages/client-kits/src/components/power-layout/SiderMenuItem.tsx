import {
  HTMLAttributes,
  MouseEventHandler,
  memo,
  useContext,
  useMemo,
} from 'react'

import { FFIcon } from '../icon'
import { MenuItem } from './interface'
import { PowerLayoutContext } from './context'
import { cn } from '../../lib/css'
import { getTitle } from './utils'

export type SiderMenuItemProps = Partial<
  {
    menuItem: MenuItem
    active: boolean
    collapsed: boolean
  } & HTMLAttributes<HTMLDivElement>
>

export const SiderMenuItem = memo<SiderMenuItemProps>(
  ({ menuItem, onClick, active, collapsed }) => {
    const { language } = useContext(PowerLayoutContext)
    const title = useMemo(() => {
      return getTitle(menuItem, language)
    }, [menuItem, language])
    return (
      <div
        className={cn(
          'flex items-center hover:bg-[#F7F9FB]  rounded-[4px] hover:text-primary text-[#465679]   cursor-pointer group h-9',
          {
            'bg-[#F7F9FB]': active,
            'text-primary': active,
            'flex-col w-14 h-14 justify-center gap-1': collapsed,
            'pl-4 gap-3': !collapsed,
          },
        )}
        onClick={onClick}
      >
        <FFIcon type={menuItem.icon} />

        <span
          style={{
            fontSize: collapsed ? 10 : 14,
          }}
        >
          {title}
        </span>
      </div>
    )
  },
)
