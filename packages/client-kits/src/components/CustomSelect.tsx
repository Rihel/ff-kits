import { ReactNode, memo } from 'react'

import { cn } from '../lib/css'
import { isAvailableData } from '@ff-kits/base'

type CustomOption = {
  label: string
  value: string
  icon?: ReactNode
  [key: string]: any
}
type Value = string | string[]
export type CustomSelectProps = Partial<{
  options: CustomOption[]
  value: string | string[]
  className: string
  multiple: boolean
  onChange: (val: Value, option: CustomOption) => void
  activeItemClassName: string
  itemClassName: string
}>

export const CustomSelect = memo<CustomSelectProps>(
  ({
    className,
    value,
    options,
    multiple = false,
    activeItemClassName,
    itemClassName,
    onChange,
  }) => {
    const handleClick = (item: CustomOption) => {
      if (multiple) {
        const newValue = [...(value as string[])]
        if (newValue.includes(item.value)) {
          onChange?.(
            newValue.filter((v) => v !== item.value),
            item
          )
        } else {
          onChange?.([...newValue, item.value], item)
        }
      } else {
        onChange?.(item.value, item)
      }
    }

    const isActive = (item: CustomOption) => {
      if (multiple) {
        return value?.includes(item.value)
      } else {
        return value === item.value
      }
    }

    return (
      <div className={cn('flex gap-1 flex-wrap', className)}>
        {options?.map((item) => {
          return (
            <div
              className={cn(
                'flex items-center w-fit gap-2 px-4 py-2 text-sm cursor-pointer text-default hover:text-primary hover:bg-[#ddedff] rounded-md',
                itemClassName,
                isAvailableData(activeItemClassName)
                  ? { [activeItemClassName!]: isActive(item) }
                  : { 'text-primary bg-[#ddedff]': isActive(item) }
              )}
              key={item.value}
              onClick={() => handleClick(item)}
            >
              {item.icon && <span className="w-5 h-5">{item.icon}</span>}
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
)
