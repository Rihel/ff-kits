import { HTMLAttributes, ReactNode } from 'react'

export type PanelGroupProps = Partial<{
  itemClassName: string
  contentClassName: string
  headerClassName: string
  titleClassName: string
  full: boolean
  space: boolean
}>

export type PanelProps = PanelGroupProps &
  Partial<{
    onFull: (full: boolean) => void
    extraLeft: ReactNode
    extraRight: ReactNode
    children: ReactNode
    className: string
    title: ReactNode
  }>
