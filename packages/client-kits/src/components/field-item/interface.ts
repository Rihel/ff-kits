import { HTMLAttributes, ReactNode } from 'react'

export type FieldGroupContextProps = Partial<{
  colon: boolean
  between: boolean
  labelClassName: string
  contentClassName: string
  itemClassName: string
  component: boolean
  componentProps: HTMLAttributes<HTMLDivElement>
}>

export type FieldItemProps = Partial<{
  label: ReactNode
  className: string
  children: ReactNode
}> &
  Omit<FieldGroupContextProps, 'component' | 'componentProps'>
