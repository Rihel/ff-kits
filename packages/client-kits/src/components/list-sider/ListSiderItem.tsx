import {
  Item,
  ListSiderContext,
  ListSiderContextProps,
  ListSiderItemProps,
} from './interface'
import { memo, useContext, useRef } from 'react'

import { FFIcon } from '../icon'
import { IconText } from '../icon-text'
import { cn } from '../../lib/css'
import { useHover } from 'ahooks'

export const ListSiderItem = memo<ListSiderItemProps>(
  ({ data, onClick, className, isActive, onRemove }) => {
    const wrapRef = useRef<HTMLDivElement>()
    const isHover = useHover(wrapRef, {})
    const { itemIcon, itemNameKey, renderItemName } =
      useContext(ListSiderContext)
    return (
      <div
        ref={wrapRef!}
        className={cn(
          'flex rounded-md  hover:bg-[#F2F3F5]   justify-between text-default cursor-pointer p-4',
          {
            'bg-[#F2F3F5]': isActive,
          },
          className,
        )}
        title={data![itemNameKey!]}
        onClick={onClick}
      >
        <div
          className="flex gap-2 shrink-0 "
          style={{
            width: 'calc(100% - 32px)',
          }}
        >
          <FFIcon className="w-6 text-xl" type={itemIcon as string} />
          <div className="flex-1">
            {renderItemName ? (
              renderItemName?.(data as Item)
            ) : (
              <div className="w-full text-sm single-ellipsis">
                {data![itemNameKey!]}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end w-8 h-full">
          {isHover && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                onRemove?.()
              }}
            >
              <IconText iconType="delete-outlined"></IconText>
            </div>
          )}
        </div>
      </div>
    )
  },
)
