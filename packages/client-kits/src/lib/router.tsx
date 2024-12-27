import { ComponentType, createContext, useContext, useMemo } from 'react'
import { HashRouter, Route, RouteObject, Routes } from 'react-router-dom'
import { mapTree, recursionTree } from '@ff-kits/base'

import { ErrorHandler } from '../components/error-handler'
import _ from 'lodash'

export type AppRoute = RouteObject & {
  meta?: {
    [key: string]: any
  }
  children?: AppRoute[]
}

export type AppRouterContextData = {
  appRoutes: AppRoute[]
}
const AppRouterContext = createContext<AppRouterContextData>(null)
export type AppRouterProps = {
  appRoutes: AppRoute[]
  authorization?: (pagePath: string, route: AppRoute) => ComponentType
}

export const AppRouter = ({ authorization, appRoutes }: AppRouterProps) => {
  const routes = useMemo(() => {
    return mapTree<AppRoute, RouteObject, 'children'>(
      _.cloneDeep(appRoutes),
      (node) => {
        node.errorElement = <ErrorHandler />
        return _.omit(node, 'meta') as RouteObject
      }
    )
  }, [appRoutes])
  const renderRoutes = (routes: AppRoute[], paths: AppRoute[] = []) => {
    return routes.map((route) => {
      const fullPath =
        '/' +
        [...paths, route]
          .map((item) => item.path)
          .map((item, index) => {
            return item.startsWith('/') ? item.substring(1) : item
          })
          .join('/')

      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
          Component={
            authorization ? authorization(fullPath, route) : route.Component
          }
          index={route.index as false}
          errorElement={route.errorElement}
        >
          {route.children?.length > 0
            ? renderRoutes(route.children, [...paths, route])
            : null}
        </Route>
      )
    })
  }

  return (
    <AppRouterContext.Provider value={{ appRoutes }}>
      <HashRouter>
        <Routes>{renderRoutes(routes)}</Routes>
      </HashRouter>
    </AppRouterContext.Provider>
  )
}

export const useAppRouter = () => {
  const { appRoutes } = useContext(AppRouterContext)
  const getRoutes = (matches: string[] = []) => {
    const pathnames = _.map(matches, 'pathname')
    const res = []
    recursionTree(appRoutes, {
      visit: (node, parent, index, path) => {
        const routePathname = _.chain(path)
          .map('path')
          .map((item) => {
            return item.startsWith('/') ? item : '/' + item
          })
          .uniq()
          .join('')
          .value()
        if (pathnames.includes(routePathname)) {
          res.push(node)
        }
      },
    })
    return res
  }

  return {
    getRoutes,
  }
}
