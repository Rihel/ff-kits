export type LayoutContext = {
  // 当前路由
  route: {
    // 路径参数
    params: Record<string, any>
    // 路径
    pathname: string
    // 查询参数
    query: Record<string, any>
  }
  // loaderData, displayTitle 和 visible才有
  data?: Record<string, any>
}

export type MenuItem = {
  // 菜单标题
  title?: string
  // 菜单标识
  key: string
  // 菜单ICON
  icon?: string

  locale?: Record<string, string>

  // 页面路由，支持动态路由参数
  url?: string

  link?: string
  // 页面重定向， 支持动态路由参数，一般用于分组菜单项
  redirect?: string

  // 存放在store 中的数据字段Key
  dataKey?: string
  divider?: boolean
  // 页面加载数据函数
  loader?: (ctx: LayoutContext) => any

  // 菜单可见性，返回true显示 返回 false 隐藏
  visible?: (ctx: LayoutContext) => boolean

  // 标题
  displayTitle?: (ctx: LayoutContext) => string

  // 子菜单，一般显示在头部哈
  children?: MenuItem[]

  // 权限标识
  authCode?: string
}

export type CurrentMenu = {
  menu: MenuItem
  parent: MenuItem
  index: number
  path: MenuItem[]
  depth: number
  top: MenuItem
}

export type PowerLayoutState = {
  collapsed: boolean
  loading: boolean
  currentMenu: CurrentMenu | null
  title: string | null
  headerMenus: MenuItem[]
}

export type LoaderData = Record<string, any>
