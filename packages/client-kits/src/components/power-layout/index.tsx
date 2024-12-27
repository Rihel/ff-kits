import {
  CurrentMenu,
  LayoutContext,
  LoaderData,
  MenuItem,
  PowerLayoutState,
} from './interface'
import { ReactNode, memo, useEffect, useMemo } from 'react'
import { filterAuthMenus, getCurrentMenu, getTitle } from './utils'
import { genActualUrl, maybeFun, resolveMenus } from '@ff-kits/base'
import { useRoute, useRouter } from '../../hooks'

import { LayoutHeader } from './LayoutHeader'
import { Loading } from '../loading'
import { PowerLayoutContext } from './context'
import { Sider } from './Sider'
import _ from 'lodash'
import { useImmer } from 'use-immer'

export type PowerLayoutProps = Partial<{
  mainMenus: MenuItem[]
  bottomMenus: MenuItem[]
  children: ReactNode
  onCollapseChange: (collapsed: boolean) => void
  loaderData: LoaderData
  onLoaderDataChange: (loaderData: LoaderData) => LoaderData
  siderTop: ReactNode | ((data: PowerLayoutState) => ReactNode)
  headerExtra: ReactNode
  language: string
  noAuth?: ReactNode
  authCodes?: string[] // 已有权限码
}>

export const PowerLayout = memo<PowerLayoutProps>(
  ({
    onCollapseChange,
    onLoaderDataChange,
    loaderData = {},
    siderTop,
    headerExtra,
    noAuth,
    children,
    language,
    ...props
  }) => {
    const rawMainMenus = props.mainMenus
    const rawBottomMenus = props.bottomMenus
    const rawMenus = [...(props.mainMenus || []), ...(props.bottomMenus || [])]

    const mainMenus = useMemo(() => {
      return filterAuthMenus(props.mainMenus, props.authCodes)
    }, [props.mainMenus, props.authCodes])

    const bottomMenus = useMemo(() => {
      return filterAuthMenus(props.bottomMenus || [], props.authCodes)
    }, [props.bottomMenus, props.authCodes])
    const router = useRouter()
    const route = useRoute()
    const [{ collapsed, loading, ...state }, setState] =
      useImmer<PowerLayoutState>({
        collapsed: false,
        loading: true,

        currentMenu: null,
        title: null,
        headerMenus: [],
      })

    const toggleSiderMenu = () => {
      setState((d) => {
        d.collapsed = !d.collapsed
        onCollapseChange?.(d.collapsed)
      })
    }

    const handleBackClick = () => {
      const currentMenu = state.currentMenu
      router.push(genActualUrl(currentMenu?.parent?.url, route.params))
    }

    const getNewMenus = (list: MenuItem[]) => {
      return list.filter((item) => {
        if (item.visible) {
          return maybeFun(item.visible, { route, ...item })
        }
        return true
      })
    }

    const handleMenuItemClick = (item: MenuItem) => {
      const path = genActualUrl(item.url || item.redirect, route.params)
      if (path && path !== route.pathname) {
        setState((d) => {
          d.loading = true
        })
        router.push(path)
      } else if (item.link) {
        window.open(item.link, '_blank')
      }
    }

    const getHeaderMenus = (currentMenu: CurrentMenu) => {
      if (!currentMenu) {
        return []
      }
      const headerMenus = resolveMenus(
        currentMenu?.parent?.children || [],
        route.params
      )
      if (headerMenus.length === 1) {
        return []
      }
      return headerMenus as MenuItem[]
    }

    const menus = useMemo(() => {
      const mergedMenus = [...mainMenus, ...bottomMenus].filter(
        (item) => !item.divider
      )
      return mergedMenus
    }, [mainMenus, bottomMenus])

    const refresh = async (
      currentMenu: CurrentMenu,
      headerMenus: MenuItem[]
    ) => {
      let title = getTitle(currentMenu?.menu, language)
      try {
        const context: LayoutContext = {
          route,
          data: loaderData,
        }

        const tasks =
          currentMenu?.path
            ?.filter((item) => item.loader)
            .map((item) => {
              return {
                dataKey: item.dataKey || item.key,
                loader: item.loader,
              }
            }) || []
        const res = (
          await Promise.allSettled(tasks?.map((item) => item.loader(context)))
        ).map((item) => {
          return item.status === 'fulfilled' ? item.value : null
        })

        const updateData = tasks.reduce((acc, item, index) => {
          return {
            ...acc,
            [item.dataKey]: res[index],
          }
        }, {})

        const newLoaderData = onLoaderDataChange?.(updateData)

        if (_.isFunction(currentMenu?.menu?.displayTitle)) {
          const displayTitle = currentMenu.menu?.displayTitle?.({
            ...context,
            data: newLoaderData,
          })

          title = displayTitle
        }

        const newHeaderMenus = headerMenus.filter((item) => {
          if (_.isFunction(item.visible)) {
            return item.visible?.({
              ...context,
              data: newLoaderData,
            })
          }
          return true
        })
        setState((d) => {
          d.title = title
          d.currentMenu = currentMenu
          d.headerMenus = newHeaderMenus
          d.loading = false
        })
      } catch (error) {
        console.log(error)
        setState((d) => {
          d.loading == false
        })
      } finally {
        setState((d) => {
          d.loading == false
        })
      }
    }

    useEffect(() => {
      const currentMenu = getCurrentMenu(menus, route.pathname, route.params)
      const headerMenus = getHeaderMenus(currentMenu)

      refresh(currentMenu, headerMenus)
    }, [route.pathname, route.params])

    const hasAuth = useMemo(() => {
      const hasAuthDom = !!noAuth
      console.log(rawMenus)
      const rawCurrentMenu = getCurrentMenu(
        rawMenus,
        route.pathname,
        route.params
      )
      const currentAuthCode = rawCurrentMenu?.menu?.authCode
      if (!hasAuthDom || !currentAuthCode) return true
      return props.authCodes.includes(currentAuthCode)
    }, [
      noAuth,
      state.currentMenu,
      props.authCodes,
      rawMenus,
      route.pathname,
      route.params,
    ])

    return (
      <PowerLayoutContext.Provider value={{ language }}>
        <div className="flex w-screen h-screen overflow-hidden relative bg-[#F7F8FA]">
          <Sider
            top={
              siderTop
                ? typeof siderTop === 'function'
                  ? maybeFun(siderTop, {
                      collapsed,
                      loading,
                      ...state,
                    })
                  : siderTop
                : undefined
            }
            mainMenus={getNewMenus(mainMenus)}
            bottomMenus={getNewMenus(bottomMenus)}
            collapsed={collapsed}
            onCollapse={toggleSiderMenu}
            onMenuClick={handleMenuItemClick}
            checkIsActive={(item) => {
              return item.key === state.currentMenu?.top?.key
            }}
          />
          <div className="relative flex flex-col flex-1 h-full overflow-x-hidden overflow-y-auto">
            {hasAuth ? (
              <>
                <LayoutHeader
                  extra={headerExtra}
                  activeMenuKey={state.currentMenu?.menu?.key}
                  title={state.title}
                  menus={state.headerMenus}
                  onMenuClick={handleMenuItemClick}
                  showBack={state.currentMenu?.depth >= 3}
                  onBackClick={handleBackClick}
                />
                <div className="flex-1 p-5 m-5 mt-0 bg-white rounded-md shadow-sm shrink-0 y-scroll">
                  {loading ? <Loading /> : children}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full m-4 bg-white rounded-md shadow-md">
                {noAuth}
              </div>
            )}
          </div>
        </div>
      </PowerLayoutContext.Provider>
    )
  }
)
