import {
  Item,
  ListSiderContext,
  ListSiderContextProps,
  ListSiderProps,
} from './interface'
import { memo, useContext } from 'react'

import { Button } from 'antd'
import { FFIcon } from '../icon'
import { ListSiderItem } from './ListSiderItem'
import _ from 'lodash'
import { cn } from '../../lib/css'
import { useKitI18nTranslation } from '../../i18n'

const InternalListSider = memo<ListSiderProps>(
  ({
    className,
    onItemClick,
    onRemove,
    onAdd,
    title,
    items = [],
    activeItem,
    addButtonProps,
  }) => {
    const t = useKitI18nTranslation()
    const { itemKey = 'id' } = useContext(
      ListSiderContext,
    ) as ListSiderContextProps
    return (
      <div
        className={cn(
          'w-[286px] border-r flex flex-col shrink-0 border-light',
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-light">
          <span className="text-sm text-default">{title}</span>
          <Button
            {...addButtonProps}
            onClick={onAdd}
            icon={<FFIcon type="plus-outlined" />}
          >
            {t('listSider.add')}
          </Button>
        </div>
        <div className="flex flex-col flex-1 gap-2 px-6 py-4 y-scroll">
          {items.map((item) => {
            return (
              <ListSiderItem
                onClick={() => onItemClick?.(item)}
                onRemove={() => onRemove?.(item)}
                isActive={activeItem?.[itemKey] === item[itemKey]}
                key={item[itemKey]}
                data={item}
              />
            )
          })}
        </div>
      </div>
    )
  },
)

export function ListSider<T = Item>(props: ListSiderProps<T>) {
  return (
    <ListSiderContext.Provider
      value={{
        itemIcon: props.itemIcon,
        itemKey: props.itemKey as string,
        itemNameKey: props.itemNameKey as string,
        renderItemName: props.renderItemName,
      }}
    >
      {/* @ts-ignore */}
      <InternalListSider {...props} />
    </ListSiderContext.Provider>
  )
}

export * from './interface'
