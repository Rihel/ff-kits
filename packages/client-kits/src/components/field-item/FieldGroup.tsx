import { PropsWithChildren, memo } from 'react'

import { FieldGroupContext } from './context'
import { FieldGroupContextProps } from './interface'

export const FieldGroup = memo<PropsWithChildren<FieldGroupContextProps>>(
  ({ children, component = true, ...props }) => {
    const renderContent = component
      ? () => {
          return children
        }
      : () => {
          return <div {...props.componentProps}>{children}</div>
        }

    return (
      <FieldGroupContext.Provider value={props}>
        {renderContent()}
      </FieldGroupContext.Provider>
    )
  },
)
