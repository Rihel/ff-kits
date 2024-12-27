import { Breadcrumb, BreadcrumbProps, Layout, Menu, MenuProps } from 'antd'
import { Fragment, ReactNode, useCallback, useMemo } from 'react'
import { Location, useLocation } from 'react-router-dom'
import { mapTree, recursionTree } from '@ff-kits/base'

import { BaseHeader } from './base-header'
import { FFIcon } from './icon'
import { ItemType } from 'antd/es/menu/interface'
import _ from 'lodash'
import classNames from 'classnames'
import { useRouter } from '../hooks'

export type IMenu = {
  icon?: string
  url?: string
  title: string
  children?: IMenu[]
  onClick?: () => void
  data?: Record<string, any>
}

type ActionFn = (node: IMenu, location: Location) => boolean
export type BaseLayoutProps = Partial<{
  menus: IMenu[]
  home: boolean
  hasSider: boolean
  hasBreadcrumb: boolean
  contentClass: string
  activeFn: ActionFn
  headerLeft: ReactNode
  headerRight: ReactNode
  headerMiddle: ReactNode
  children: ReactNode
  breadcrumbList: BreadcrumbProps['items']
  menuProps: Omit<
    MenuProps,
    'items' | 'theme' | 'className' | 'mode' | 'selectedKeys'
  >
}>

export const BaseLayout = ({
  menus = [],
  home = true,
  hasSider = true,
  hasBreadcrumb = true,
  contentClass,
  activeFn,
  headerLeft,
  headerRight,
  headerMiddle,
  children,
  breadcrumbList,
  ...props
}: BaseLayoutProps) => {
  const router = useRouter()
  const route = useLocation()

  const getActiveMenu = useCallback(
    (fn: ActionFn) => {
      let activeMenu: IMenu
      recursionTree(menus, {
        visit: (node) => {
          const isActive = fn?.(node, route)
          if (isActive) {
            activeMenu = node
          }
        },
      })
      return activeMenu
    },
    [route, menus]
  )

  const routeKey = useMemo(() => {
    const activeMenu = getActiveMenu(activeFn)
    return activeMenu?.url
  }, [activeFn, getActiveMenu])

  const handleClick = ({ key }) => {
    const activeMenu = getActiveMenu((item) => item.url === key)
    if (activeMenu.onClick) {
      activeMenu.onClick()
    } else {
      router.push(activeMenu.url)
    }
  }

  const renderMenus = useMemo(() => {
    return mapTree(
      menus,
      (item) => {
        //@ts-ignore
        item.icon = (<FFIcon type={item.icon as string} />) as ReactNode
        //@ts-ignore
        item.label = item.title
        //@ts-ignore
        item.key = item.url

        return item
      },
      { childrenKey: 'children' }
    ) as unknown as ItemType[]
  }, [menus])

  return (
    <Layout className="relative w-full h-full">
      <BaseHeader
        className="sticky border border-b border-light"
        theme="light"
        left={<div className="flex items-center gap-2">{headerLeft}</div>}
        middle={headerMiddle}
        right={<div className="flex items-center gap-2">{headerRight}</div>}
      />
      <Layout className="h-no-header">
        {hasSider && (
          <Layout.Sider
            collapsible
            theme="light"
            className="h-full overflow-x-hidden overflow-y-auto "
          >
            <Menu
              selectedKeys={[routeKey]}
              theme="light"
              onClick={handleClick}
              {...props.menuProps}
              className="pb-12 border-r-0"
              mode="inline"
              items={renderMenus}
            />
          </Layout.Sider>
        )}

        <Layout.Content className="relative h-full overflow-x-hidden overflow-y-auto">
          {hasBreadcrumb && !_.isEmpty(breadcrumbList) && (
            <Breadcrumb
              className="px-5 py-[10px] bg-white sticky top-0"
              items={breadcrumbList}
            />
          )}
          <div className={classNames([contentClass])}>{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
