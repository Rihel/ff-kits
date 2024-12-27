import { CurrentMenu, MenuItem } from './interface'
import { filterTree, genActualUrl, recursionTree } from '@ff-kits/base'

import _ from 'lodash'

export const getCurrentMenu = (
  menus: MenuItem[],
  pathname: string,
  params: Record<string, any>
) => {
  let res: CurrentMenu | null = null
  recursionTree(menus, {
    visit: (
      node: MenuItem,
      parent: MenuItem,
      index: number,
      path: MenuItem[],
      depth: number
    ) => {
      const currentUrl = genActualUrl(node.url || '', params)
      if (currentUrl === pathname) {
        res = {
          menu: node,
          parent,
          index,
          path,
          depth,
          top: _.head(path),
        }
      }
    },
  })
  return res
}

export const getTitle = (item?: MenuItem, language?: string) => {
  if (!item) return ''
  let label = item?.title
  if (item.locale && language) {
    label = item.locale[language]
  }
  return label
}

export const filterAuthMenus = (menus: MenuItem[], authCodes?: string[]) => {
  return filterTree(
    menus,
    (item) => {
      if (item.authCode) {
        return authCodes.includes(item.authCode)
      }
      return true
    },
    { childrenKey: 'children', keepWithTrue: false }
  )
}
