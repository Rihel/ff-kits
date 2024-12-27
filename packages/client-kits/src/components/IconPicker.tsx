import { Empty, Input, Typography } from 'antd'
import { HTMLAttributes, memo, useEffect, useMemo, useRef } from 'react'

import { FFIcon } from './icon'
import { IconText } from './icon-text'
import { ListWrap } from './list-wrap'
import _ from 'lodash'
import { cn } from 'src/lib'
import { copy } from '@ff-kits/base'
import { iconNames } from './icon/lib'
import { useDebounce } from 'ahooks'
import { useImmer } from 'use-immer'
import { useRectInfo } from 'src/hooks'

export type IconPickerProps = Partial<{
  value?: string
  width?: number
  disabled?: boolean
  onChange?: (value: string) => void
}>

const icons = _.uniq(iconNames).map((item) => {
  return { name: item }
})

export const IconPicker = memo<IconPickerProps>(
  ({ value, width, onChange, disabled }) => {
    const [wrapRef, bounds] = useRectInfo()
    const w = width ? width : bounds.width
    const count = 12
    const columnWidth = w / count

    const [keyword, setKeyword] = useImmer('')
    const debouncedValue = useDebounce(keyword, { wait: 200 })
    const filterIcons = useMemo(() => {
      if (!debouncedValue) return icons
      return icons.filter((item) => item.name.includes(debouncedValue))
    }, [debouncedValue])

    useEffect(() => {
      if (!value) {
        const idx = _.random(0, filterIcons.length - 1, false)

        onChange?.(filterIcons[idx].name)
      }
    }, [])

    return (
      <div className="flex flex-col gap-2 p-3 border rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-sm text-light">已选：</span>
          <FFIcon className="text-xl" type={value!} />
          {value && (
            <IconText
              type="primary"
              iconType="copy-outlined"
              iconPosition="right"
              onClick={() => copy(value)}
            >
              点击复制：{value}
            </IconText>
          )}
        </div>
        <Input
          value={keyword}
          allowClear
          placeholder="输入搜索..."
          variant="filled"
          disabled={disabled}
          suffix={<FFIcon type="search-outlined" />}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {_.isEmpty(filterIcons) ? (
          <Empty className="py-6" />
        ) : (
          <div className=" h-[300px]">
            <ListWrap
              loading={false}
              minHeight={50}
              columns={12}
              dataSource={filterIcons}
              renderItem={(item, index) => {
                return (
                  <div
                    data-icon={item.name}
                    key={item.name}
                    onClick={() => {
                      if (!disabled) {
                        onChange?.(item.name)
                      }
                    }}
                    className={cn(
                      'flex items-center justify-center  text-slate-800 rounded-lg text-lg w-full h-full',
                      {
                        'bg-primary text-white': value === item.name,
                        'pointer-events-none cursor-not-allowed': disabled,
                      }
                    )}
                  >
                    <FFIcon type={item.name} />
                  </div>
                )
              }}
            />
          </div>
        )}
      </div>
    )
  }
)
