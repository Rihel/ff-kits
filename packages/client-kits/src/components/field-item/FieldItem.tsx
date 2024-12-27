import { ReactNode, forwardRef } from 'react'

import { FieldGroupContext } from './context'
import { FieldItemProps } from './interface'
import _ from 'lodash'
import { cn } from '../../lib/css'
import { useResolveDataMultiple } from '../../hooks/use-resolve-data'

export const FieldItem = forwardRef<HTMLDivElement, FieldItemProps>(
  ({ label, children, ...props }, ref) => {
    const { colon, labelClassName, contentClassName, between, itemClassName } =
      useResolveDataMultiple(FieldGroupContext, props, [
        ['colon', true],
        ['between', true],
        ['labelClassName'],
        ['contentClassName'],
        ['itemClassName'],
      ])

    return (
      <div
        className={cn(
          'flex items-center  text-sm ',
          {
            'justify-between': between,
          },
          itemClassName,
          props.className,
        )}
      >
        <div
          className={cn('text-[#8791A8]', props.labelClassName, labelClassName)}
        >
          {label}
          {colon ? ':' : null}
        </div>
        <div className={cn(props.contentClassName, contentClassName)}>
          {children}
        </div>
      </div>
    )
  },
)
