import { MouseEvent, ReactNode, memo } from 'react'

import { MenuItem } from './interface'
import { SiderMenu } from './SiderMenu'
import { SiderMenuCollapsed } from './SiderMenuCollapsed'

export type SiderProps = Partial<{
  collapsed: boolean
  onCollapse: () => void
  onMenuClick: (menu: MenuItem, event: MouseEvent) => void
  checkIsActive: (menu: MenuItem, idx: number) => boolean
  mainMenus: MenuItem[]
  bottomMenus: MenuItem[]
  top: ReactNode
}>

export const Sider = memo<SiderProps>(
  ({
    collapsed,
    onCollapse,
    onMenuClick,
    checkIsActive,
    mainMenus = [],
    bottomMenus = [],
    top,
  }) => {
    return (
      <div
        className="relative z-20 h-full bg-white shadow-sm shrink-0 shadow-base"
        style={{
          width: collapsed ? 72 : 208,
          paddingTop: top ? 0 : 16,
        }}
      >
        {top && <div className="px-4 py-4 h-header">{top}</div>}
        <SiderMenu
          menus={mainMenus}
          onClick={onMenuClick}
          checkIsActive={checkIsActive}
          collapsed={collapsed}
        />
        <SiderMenu
          menus={bottomMenus}
          onClick={onMenuClick}
          className="absolute w-full bottom-4"
          checkIsActive={checkIsActive}
          collapsed={collapsed}
        />
        <SiderMenuCollapsed collapsed={collapsed} onCollapse={onCollapse} />
      </div>
    )
  },
)
