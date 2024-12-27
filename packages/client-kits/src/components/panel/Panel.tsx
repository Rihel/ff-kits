import { forwardRef, memo, useCallback, useState } from 'react'

import { FFIcon } from '../icon'
import { PanelContext } from './context'
import { PanelProps } from './interface'
import { cn } from '../../lib/css'
import { getDataByPriority } from '@ff-kits/base'
import styles from './style.module.scss'
import { useMergeProps } from '../../hooks/use-merge-props'

export const InternalPanel = memo(
  forwardRef<HTMLDivElement, PanelProps>(
    (
      {
        onFull,
        space,
        title,
        className,
        extraLeft,
        extraRight,
        children,
        ...props
      },
      ref
    ) => {
      const {
        itemClassName,
        contentClassName,
        headerClassName,
        titleClassName,
        full,
      } = useMergeProps(PanelContext, props, {
        itemClassName: (cv, pv) => cn(cv, pv),
        contentClassName: (cv, pv) => cn(cv, pv),
        headerClassName: (cv, pv) => cn(cv, pv),
        titleClassName: (cv, pv) => cn(cv, pv),
        full: (cv, pv) => getDataByPriority([pv, cv]),
      })

      const [state, setState] = useState(true)
      const toggleState = useCallback(() => {
        onFull && onFull(!state)
        setState(!state)
      }, [state])

      return (
        <div
          className={cn(
            styles.wrap,
            {
              [styles.space]: space,
              [styles.full]: full,
            },
            itemClassName,
            className
          )}
          ref={ref}
        >
          <div className={cn(styles.header, headerClassName, 'cursor-pointer')}>
            <div className={cn(styles.title, titleClassName)}>{title}</div>
            <div className="flex items-center gap-2">
              {extraLeft}
              <div onClick={toggleState} className={styles.icon}>
                <FFIcon
                  type={state ? 'down-outlined' : 'right-outlined'}
                ></FFIcon>
              </div>
              {extraRight}
            </div>
          </div>

          <div
            style={{
              display: state ? 'block' : 'none',
            }}
            className={cn([styles.content, contentClassName])}
          >
            {children}
          </div>
        </div>
      )
    }
  )
)
