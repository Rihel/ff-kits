import { ComponentType, ReactNode } from 'react'

import { FormItemProps } from 'antd'

export type Fun = (...args: any) => any
export type OnChange<T extends Fun | undefined> = T extends Fun ? T : never
export type OnChangeEvent<T extends Fun | undefined> = Parameters<
  OnChange<T>
>[0]
export type AntdOnChangeEvent<T extends { onChange?: Fun }> = OnChangeEvent<
  T['onChange']
>

export type WidgetKey =
  | 'input'
  | 'password'
  | 'range'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'select'
  | 'date'
  | string

export type FormItemSchema = {
  label?: string
  comp?:
    | WidgetKey
    | ComponentType<{
        value: any
        disabled: boolean
        onChange: (...args: any) => void
        allowClear: boolean
      }>
  name: string
  props?: any
  static?: boolean
  initialValue?: any
  rules?: FormItemProps['rules']
  showLabel?: boolean
  formItemProps?: FormItemProps
  transform?: (...args: any) => any
  visible?: () => boolean | boolean
  disabled?: () => boolean | boolean
  onChange?: (...args: any) => void
  onEnter?: (val: any) => void
  type?: 'normal' | 'array'
  display?: (
    value: any,
    formValue: Record<string, any>,
    item: FormItemSchema,
  ) => ReactNode
  items?: Omit<FormItemSchema, 'fields' | 'type'>[]
}
