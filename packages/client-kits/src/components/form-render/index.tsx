import {
  Button,
  Empty,
  Form,
  FormInstance,
  FormItemProps,
  FormProps,
} from 'antd'
import {
  CSSProperties,
  ChangeEvent,
  ComponentType,
  FC,
  KeyboardEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormItemSchema, WidgetKey } from './interface'
import { isAvailableData, maybeFun } from '@ff-kits/base'

import { FFIcon } from '../icon'
import { FormTable } from './FormTable'
import { IconText } from '../icon-text'
import _ from 'lodash'
import { cn } from '../../lib/css'
import { widgetRegistry } from './lib'

const isInnerComp = (item: FormItemSchema) => {
  if (typeof item.comp === 'string') {
    return widgetRegistry.hasWidget(item.comp)
  }
  return false
}
const getComponent = (item: FormItemSchema) => {
  return widgetRegistry.getComponent(item.comp as string)
}
const getTransform = (item: FormItemSchema) => {
  return widgetRegistry.getTransform(item.comp as string)
}

export type FormRenderProps<
  T extends Record<string, any> = Record<string, any>,
> = {
  onChange: (newFormValue: T, oldFormValue?: T) => void

  value: T
} & Partial<{
  form: FormInstance
  showLabel: boolean
  colGap: number
  items: (FormItemSchema | FormItemSchema[])[]
  style: CSSProperties
  className: string
  formProps: Omit<FormProps, 'style' | 'className'>
  formItemClassName: string
}>

export type FormRendererApi = {
  validate(): ReturnType<FormInstance['validateFields']>
  reset(): void
}
export const FormRenderer = forwardRef<FormRendererApi, FormRenderProps>(
  (
    {
      items = [],
      showLabel = true,
      formProps,
      value,
      onChange,
      style,
      className,
      colGap = 24,
      formItemClassName,

      ...props
    },
    ref
  ) => {
    const [innerForm] = Form.useForm()
    const form = useMemo(() => {
      return props.form || innerForm
    }, [props.form])
    const handleValuesChange: FormProps['onValuesChange'] = (
      changeValues,
      allValues
    ) => {
      const newValue = {
        ...value,
        ...allValues,
      }
      onChange?.(newValue, value)
    }

    const getItemValue = (name: string) => {
      return _.get(value, name)
    }

    const filterItem = (item: FormItemSchema) => {
      if (_.has(item, 'visible')) {
        const itemValue = getItemValue(item.name)
        const visible = maybeFun(item.visible, itemValue, value)
        return visible
      }
      return true
    }

    const finallyItems = useMemo(() => {
      return items.reduce<Array<FormItemSchema | FormItemSchema[]>>(
        (acc, item) => {
          if (Array.isArray(item)) {
            acc.push(item.filter(filterItem))
          } else {
            if (filterItem(item)) {
              acc.push(item)
            }
          }
          return acc
        },
        []
      )
    }, [items, filterItem])

    const calcItemNewValue = (item: FormItemSchema, e: any, ...args: any) => {
      if (isInnerComp(item)) {
        let transform = item.transform || getTransform(item)
        if (transform && _.isFunction(transform)) {
          return transform(e, {
            item,
            value,
            args,
          })
        }
      }
      return e
    }

    const renderComponent = (item: FormItemSchema) => {
      const itemProps = item.props || {}
      if (!item.static) {
        itemProps.allowClear = true
      }
      const itemValue = getItemValue(item.name)

      let disabled = false
      if (_.has(item, 'disabled')) {
        disabled = maybeFun(item.disabled, itemValue, value)
      }

      if (item.comp) {
        const isInner = typeof item.comp === 'string' && isInnerComp(item)

        let Component: ComponentType<any> | undefined
        if (isInner) {
          if (widgetRegistry.isEnterWidget(item.comp as string)) {
            itemProps.onKeyDown = (e: KeyboardEvent) => {
              const val = (e.target as HTMLInputElement).value.trim?.()
              if (e.key === 'Enter') {
                console.log('enter', item)
                item.onEnter?.(val)
              }
            }
          }

          Component = getComponent(item)
        } else {
          Component = item.comp as ComponentType
        }

        if (!Component) {
          console.warn(item, '没有组件')
          return null
        }

        return (
          <Component
            {...itemProps}
            value={itemValue}
            disabled={disabled}
            onChange={(e: any, ...args: any) => {
              const newValue = calcItemNewValue(item, e, ...args)
              const newFormValue = _.cloneDeep(value)
              _.set(newFormValue, item.name, newValue)
              onChange?.(newFormValue, value)
              item.onChange?.(newValue, ...args, item)
            }}
          ></Component>
        )
      }
    }

    const buildItem = (item: FormItemSchema | FormItemSchema[]) => {
      if (_.isArray(item)) {
        return (
          <div className="flex justify-between" style={{ gap: colGap }}>
            {item.map((groupItem, idx) => {
              return (
                <div key={`group-item-${idx}`} className="flex-1">
                  {buildItem(groupItem)}
                </div>
              )
            })}
          </div>
        )
      }
      const type = item.type || 'normal'
      let formItemProps: FormItemProps = {}
      const name = item.name.split('.')

      const itemClassName = cn(
        item.formItemProps?.className || formItemClassName
      )
      const rules = item.rules
      const restItemProps = _.omit(
        item.formItemProps,
        'className',
        'name',
        'rules',
        'label'
      )
      formItemProps = {
        label: item.label,
        name,
        rules,
        className: itemClassName,
        initialValue: item.initialValue,
        ...restItemProps,
      }

      switch (type) {
        case 'array':
          return (
            <Form.Item key={item.name} {...formItemProps}>
              <Form.List name={name}>
                {(dataSource, { add, remove }) => {
                  return (
                    <FormTable
                      renderItem={(i) => buildItem(i)}
                      onAdd={add}
                      onRemove={remove}
                      dataSource={dataSource}
                      field={item}
                    />
                  )
                }}
              </Form.List>
            </Form.Item>
          )
        case 'normal':
        default:
          if (item.static === true) {
            delete formItemProps.name
          }
          if (item.showLabel || showLabel) {
            formItemProps.label = item.label
          }

          return (
            <Form.Item key={item.name} {...formItemProps}>
              {item.static
                ? item.display?.(_.get(value, name), value, item)
                : renderComponent(item)}
            </Form.Item>
          )
      }
    }
    const renderItems = finallyItems.map((item) => {
      return buildItem(item)
    })

    const validate = () => {
      return form.validateFields()
    }

    const reset = () => {
      form?.resetFields?.()
      onChange?.(value, {})
    }

    useEffect(() => {
      form.setFieldsValue(value)
    }, [value])

    useImperativeHandle(ref, () => {
      return {
        validate,
        reset,
      }
    }, [validate, reset])
    return (
      <Form
        form={form}
        variant="filled"
        {..._.omit(formProps, 'style', 'className')}
        style={style}
        className={cn('', className)}
        onValuesChange={handleValuesChange}
      >
        {renderItems}
      </Form>
    )
  }
)
export * from './interface'
