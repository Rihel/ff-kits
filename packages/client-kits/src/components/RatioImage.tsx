import { ImgHTMLAttributes, memo } from 'react'

import { cn } from '../lib/css'

export type RatioImageData = {
  src: string
  src2x?: string
}

export type RatioImageProps = Partial<
  {
    data: RatioImageData
    only2x?: boolean
  } & ImgHTMLAttributes<HTMLImageElement>
>

export const RatioImage = memo<RatioImageProps>(
  ({ className, data, only2x = false }) => {
    const props: ImgHTMLAttributes<HTMLImageElement> = {}
    if (only2x) {
      props.src = data?.src2x
    } else {
      props.src = data?.src
      props.srcSet = `${data?.src2x} 2x`
    }
    return <img className={cn('align-middle', className)} {...props} />
  },
)
