import { CSSProperties, HTMLAttributes, ReactNode, memo } from 'react'

import { cn } from '../../lib/css'
import styles from './style.module.scss'

export type GroupProps = Partial<{
  headerExtra: ReactNode
  headerClassName: string
  headerExtraClassName: string
  headerStyle: CSSProperties
  contentClassName: string
  title: ReactNode
  mark: boolean
  className: string
  children: ReactNode
  bordered: boolean
}>

export const Group = memo<GroupProps>(
  ({
    className,
    title,
    headerExtra,
    headerClassName,
    headerExtraClassName,
    headerStyle,
    contentClassName,
    mark = true,
    bordered = false,
    children,
  }) => {
    return (
      <div
        className={cn(styles.wrap, className, {
          [styles.bordered]: bordered,
        })}
      >
        <div className={cn(styles.header, headerClassName)} style={headerStyle}>
          <div
            className={cn(styles.title, {
              [styles.mark]: mark,
            })}
          >
            {title}
          </div>
          {headerExtra && (
            <div className={cn('flex gap-2', headerExtraClassName)}>
              {headerExtra}
            </div>
          )}
        </div>
        <div className={cn(styles.content, contentClassName)}>{children}</div>
      </div>
    )
  },
)
