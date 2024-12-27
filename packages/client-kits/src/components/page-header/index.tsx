import { CustomSelect, CustomSelectProps } from '../CustomSelect'
import { ReactNode, memo, useCallback } from 'react'

import { FFIcon } from '../icon'
import _ from 'lodash'
import { cn } from '../../lib/css'
import styles from './style.module.scss'
import { useLocation } from 'react-router-dom'
import { useRouter } from '../../hooks'

export type PageHeaderProps = Partial<
  {
    title: ReactNode
    extra: ReactNode
    onBack: ((...args: any) => void) | string
    space: boolean
  } & CustomSelectProps
>

export const PageHeader = memo<PageHeaderProps>(
  ({
    className,
    title,
    onChange,
    value,
    extra,
    options = [],
    space = false,
    onBack,
  }) => {
    const router = useRouter()
    const route = useLocation()
    const handleBack = useCallback(() => {
      if (onBack) {
        if (_.isFunction(onBack)) {
          onBack(route)
        } else if (_.isString(onBack)) {
          router.push(onBack)
        }
      }
    }, [onBack, route, router])
    return (
      <div
        className={cn(styles.wrap, className, {
          'p-[22px]': space,
        })}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            {onBack && (
              <span onClick={handleBack}>
                <FFIcon
                  type="arrow-left-outlined"
                  className="block cursor-pointer"
                />
              </span>
            )}
            {title}
          </div>
          <div className={styles.extra}>{extra}</div>
        </div>
        {!_.isEmpty(options) && (
          <div className={styles.bottom}>
            <CustomSelect
              value={value}
              options={options}
              onChange={(...args) => {
                onChange(...args)
              }}
            />
          </div>
        )}
      </div>
    )
  },
)
