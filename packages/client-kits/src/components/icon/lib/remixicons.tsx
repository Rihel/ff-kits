import * as remixIcons from '@remixicon/react'

import React, { FC, HTMLAttributes, forwardRef } from 'react'

import Icon from '@ant-design/icons'
import _ from 'lodash'

const filteredIcons = _.pickBy(remixIcons, (_1, key) => {
  return /^[A-Z][a-zA-Z]+/.test(key)
})

function createIconComponent(key: string, Component: FC) {
  const IconComponent = forwardRef<
    HTMLSpanElement,
    {
      size: number
    } & HTMLAttributes<HTMLSpanElement>
  >(({ size = 16, ...props }, ref) => {
    return <Icon ref={ref} {...props} component={Component} />
  })

  IconComponent.displayName = _.kebabCase(key)
  return IconComponent
}

export default Object.entries(filteredIcons).reduce((acc, [key, Component]) => {
  const IconComponent = createIconComponent(key, Component as unknown as FC)
  return {
    ...acc,
    [_.kebabCase(key)]: IconComponent,
  }
}, {})
