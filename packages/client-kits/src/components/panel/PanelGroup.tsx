import React, { PropsWithChildren, memo } from 'react'

import { PanelContext } from './context'
import { PanelGroupProps } from './interface'

export const PanelGroup = memo<PropsWithChildren<PanelGroupProps>>(
  ({ children, ...props }) => {
    return (
      <PanelContext.Provider value={props}>{children}</PanelContext.Provider>
    )
  },
)
