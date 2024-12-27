import { AntdOnChangeEvent, FormItemSchema, Fun, WidgetKey } from './interface'
import {
  Checkbox,
  DatePicker,
  Input,
  InputProps,
  Radio,
  RadioGroupProps,
  Select,
} from 'antd'
import { ComponentType, FC, ReactNode } from 'react'

import { CheckboxProps } from 'antd/lib'
import { ConfigType } from 'dayjs'
import { RangePickerProps } from 'antd/es/date-picker'
import { standardTime } from '@ff-kits/base'

export interface Widget {
  key: WidgetKey

  component?: ComponentType<any>
  transform?: Fun
}
export const inputWidget = {
  key: 'input',
  component: Input,
  transform: (e: AntdOnChangeEvent<InputProps>) => {
    return e.target.value.trim()
  },
}

export const pwdWidget = {
  key: 'password',
  component: Input.Password,
  transform: (e: AntdOnChangeEvent<InputProps>) => e.target.value.trim(),
}

export const textareaWidget = {
  key: 'textarea',
  component: Input.TextArea,
  transform: (e: AntdOnChangeEvent<InputProps>) => e.target.value.trim(),
}

export const rangeWidget: Widget = {
  key: 'range',
  component: DatePicker.RangePicker,
  transform: (e: AntdOnChangeEvent<RangePickerProps>) =>
    (e || []).map((d) => standardTime(d as ConfigType).valueOf()),
}

export const selectWidget: Widget = {
  key: 'select',
  component: Select,
}

export const checkboxWidget = {
  key: 'checkbox',
  component: Checkbox.Group,
}

export const radioWidget = {
  key: 'radio',
  component: Radio.Group,
  transform: (e: AntdOnChangeEvent<RadioGroupProps>) => {
    return e.target.value
  },
}
console.log(radioWidget)
export const dateWidget = {
  key: 'date',
  component: DatePicker,
}
