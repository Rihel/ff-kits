import { ReactNode, createContext } from 'react'

import { ButtonProps } from 'antd'

export type Item = Record<string, any>

export type ListSiderContextProps<T extends Item = Item> = Partial<{
  itemIcon: string
  itemKey: keyof T
  itemNameKey: keyof T
  renderItemName: (data: T) => ReactNode
}>

export type ListSiderProps<T extends Item = Item> = Partial<
  {
    title: ReactNode
    items: T[]
    activeItem: T
    className: string
    addButtonProps: ButtonProps
    onAdd: () => void
    onRemove: (data: T) => void
    onItemClick: (data: T) => void
  } & ListSiderContextProps<T>
>

export type ListSiderItemProps<T extends Item = Item> = Partial<{
  data: T
  isActive: boolean
  onRemove: () => void
  onClick: () => void
  className: string
}>

export const ListSiderContext = createContext<ListSiderContextProps | null>(
  null,
)
