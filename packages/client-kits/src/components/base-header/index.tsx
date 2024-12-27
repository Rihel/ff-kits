import React, { FC, HTMLAttributes, ReactNode, memo, useMemo } from 'react'

import { cn } from '../../lib/css'
import { cva } from 'class-variance-authority'
import styles from './style.module.scss'

const baseHeaderVariances = cva(
  `flex items-center justify-between px-5 h-header
  `,
  {
    variants: {
      theme: {
        dark: 'bg-dark',
        light: 'bg-white',
      },
    },
    defaultVariants: {
      theme: 'dark',
    },
  },
)

export type BaseHeaderProps = Partial<
  HTMLAttributes<HTMLDivElement> & {
    left: ReactNode
    right: ReactNode
    middle: ReactNode
    theme: 'dark' | 'light'
  }
>
export const BaseHeader: FC<BaseHeaderProps> = memo(
  ({ left, middle, right, theme = 'dark', className, ...props }) => {
    return (
      <div className={cn(baseHeaderVariances({ className, theme }))} {...props}>
        {left && <div className={styles.left}>{left}</div>}
        {middle && <div className={styles.middle}>{middle}</div>}
        {right && <div className={styles.right}>{right}</div>}
      </div>
    )
  },
)
