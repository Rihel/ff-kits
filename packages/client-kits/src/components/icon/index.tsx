import {
  FC,
  ForwardRefExoticComponent,
  HTMLAttributes,
  forwardRef,
  memo,
  useMemo,
} from 'react'

import { iconMap } from './lib'

export type FFIconProps = {
  type: keyof typeof iconMap
} & HTMLAttributes<HTMLSpanElement>

export const FFIcon = memo(
  forwardRef<HTMLSpanElement, FFIconProps>(({ type, ...props }, ref) => {
    const Icon = useMemo(() => {
      return iconMap[type]
    }, [type])
    if (Icon) {
      return <Icon {...props} ref={ref} />
    }
    return null
  }),
)
