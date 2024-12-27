import React, {
  HTMLAttributes,
  MouseEventHandler,
  forwardRef,
  useMemo,
  useState,
} from 'react'

import { FFIcon } from '../icon'
import _ from 'lodash'
import classNames from 'classnames'
import { cn } from 'src/lib'
import styles from './style.module.scss'

type Type = 'primary' | 'danger' | 'info' | 'white'

export type IconTextProps = Partial<
  {
    iconType: string
    disabled: boolean
    text: string
    type: Type
    notLoading: boolean
    iconPosition: 'left' | 'right'
    iconClassName: string
  } & HTMLAttributes<HTMLSpanElement>
>

export const IconText = forwardRef<HTMLSpanElement, IconTextProps>(
  (
    {
      iconType,
      disabled,
      text,
      type,
      onClick,
      onMouseDown,
      onMouseUp,
      iconPosition = 'left',
      children,
      notLoading,
      ...props
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false)
    const clazz = useMemo(() => {
      const res = [styles.wrap, styles[type!], props.className]
      if (disabled || (notLoading === false && loading)) {
        res.push(styles.disabled)
      }
      return classNames(res)
    }, [disabled, type, props.className, notLoading, loading])

    function emitEvent(
      fn: MouseEventHandler<HTMLSpanElement> | undefined,
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    ) {
      if (disabled) {
        return
      }
      fn?.(e)
    }

    const handleClick: MouseEventHandler<HTMLSpanElement> = async (e) => {
      if (disabled) return
      setLoading(true)
      try {
        await onClick?.(e)
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }

    const icon = iconType && (
      <span className={cn(styles.icon, props.iconClassName)}>
        <FFIcon type={iconType} />
      </span>
    )
    return (
      <span
        ref={ref}
        className={clazz}
        {..._.omit(props, 'className', 'iconClassName')}
        onMouseDown={(e) => {
          emitEvent(onMouseDown, e)
        }}
        onMouseUp={(e) => {
          emitEvent(onMouseUp, e)
        }}
        onClick={handleClick}
      >
        {loading && (
          <span className={styles.loading}>
            <FFIcon type="loading-outlined" />
          </span>
        )}
        {iconPosition === 'left' && icon}
        {children ?? text}
        {iconPosition === 'right' && icon}
      </span>
    )
  },
)
