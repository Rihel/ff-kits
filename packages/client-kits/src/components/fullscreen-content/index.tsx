import { FC, HTMLAttributes, ReactNode, forwardRef } from 'react'

import { cn } from '../../lib/css'
import { cva } from 'class-variance-authority'

const wrapVariances = cva(
  'w-full h-full relative flex justify-center items-center ',
  {
    variants: {
      theme: {
        light: 'bg-light',
        dark: 'bg-dark',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  },
)
const contentVariances = cva('px-8 py-5 rounded-md shadow-sm bg-white', {
  variants: {},
})

export type FullscreenContentProps = HTMLAttributes<HTMLDivElement> &
  Partial<{
    theme: 'light' | 'dark'
    contentClassName: string
    topLeft?: ReactNode
    topRight?: ReactNode
    bottomLeft?: ReactNode
    bottomRight?: ReactNode
  }>

export const FullscreenContent = forwardRef<
  HTMLDivElement,
  FullscreenContentProps
>(
  (
    {
      theme,
      className,
      children,
      contentClassName,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(wrapVariances({ theme, className }))}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            contentVariances({
              className: contentClassName,
            }),
          )}
        >
          {children}
        </div>
        <div className="absolute top-4 left-4">{topLeft}</div>
        <div className="absolute top-4 right-4">{topRight}</div>
        <div className="absolute bottom-4 left-4">{bottomLeft}</div>
        <div className="absolute bottom-4 right-4">{bottomRight}</div>
      </div>
    )
  },
)
