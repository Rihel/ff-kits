import { memo, useMemo } from 'react'

import { Dict } from '@ff-kits/base'
import { Tag } from 'antd'

export type DictTagProps = Partial<{
  dict: Dict
  value: string | any
  language?: string
}>

export const DictTag = memo<DictTagProps>(({ dict, value, language }) => {
  const option = useMemo(() => {
    return dict?.getOption?.(value)
  }, [value, dict])

  if (option) {
    return <Tag color={option.color}>{dict?.getLabel(value, language)}</Tag>
  }
  return null
})
