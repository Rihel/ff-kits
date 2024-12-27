import {
  BaseFloatComponent,
  BaseFloatComponentProps,
} from './BaseFloatComponent'
import { KitLocaleProvider, kitI18n } from '../../i18n'
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'

import ReactDom from 'react-dom/client'
import _ from 'lodash'

export type BaseFloatProps = BaseFloatComponentProps<'dialog'>
export type BaseFloatConfirmProps = Partial<
  Omit<BaseFloatProps, 'type'> & {
    content: ReactNode
  }
>

const BaseFloat = BaseFloatComponent as typeof BaseFloatComponent & {
  confirm: (props: BaseFloatConfirmProps) => void
}

BaseFloat.confirm = ({ content, ...props }: BaseFloatConfirmProps) => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  el.classList.add('base-float-confirm')
  const root = ReactDom.createRoot(el)
  const Comp = ({ onClose }: { onClose: () => void }) => {
    const [visible, setVisible] = useState(true)
    const handleClose = () => {
      setVisible(false)
    }
    useEffect(() => {
      if (visible === false) {
        onClose?.()
      }
    }, [visible])
    const title = props.title || '警告'
    return (
      <KitLocaleProvider language={kitI18n.language}>
        <BaseFloat
          width={408}
          height={204}
          type="dialog"
          visible={visible}
          title={title}
          {..._.omit(props, 'title')}
          onClose={handleClose}
        >
          <div className="">{content}</div>
        </BaseFloat>
      </KitLocaleProvider>
    )
  }

  root.render(
    <Comp
      onClose={() => {
        setTimeout(() => {
          props.onClose?.()
          root.unmount()
          document.body.removeChild(el)
        }, 200)
      }}
    />,
  )
}
export { BaseFloat }
