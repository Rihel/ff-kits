import { BaseFloat, BaseFloatConfirmProps } from '../base-float'
import { DataTableAction, DataTableRowContext } from './interface'
import { HTMLAttributes, ReactNode, memo } from 'react'

import { IconText } from '../icon-text'
import { Popconfirm } from 'antd'
import _ from 'lodash'
import { maybeFun } from '@ff-kits/base'
import { useKitI18nTranslation } from 'src/i18n'

export type ActionItemProps = {
  context: DataTableRowContext<any>
} & DataTableAction<any>

export const ActionItem = memo<ActionItemProps>(({ context, ...action }) => {
  const t = useKitI18nTranslation()
  const { confirm, onClick } = action
  const disabled = maybeFun(action.disabled, context)

  const handleDialogConfirm = (
    title: ReactNode,
    content: ReactNode,
    confirmModalProps: BaseFloatConfirmProps = {},
    cb: () => Promise<void>
  ) => {
    return new Promise<void>((resolve, reject) => {
      BaseFloat.confirm({
        title: title || t('common.warning'),
        // type: 'warning',
        content,
        centered: true,
        ..._.omit(
          confirmModalProps,
          'title',
          'content',
          'onConfirm',
          'onClose'
        ),
        onConfirm: async () => {
          await cb?.()
          resolve()
        },
        onClose: () => {
          resolve()
        },
      })
    })
  }

  const handleActionClick = async () => {
    return await onClick?.(context)
  }
  const actionProps = {
    ..._.omit(action.props || {}, 'onClick'),
  }

  // 二次确认
  if (confirm && confirm?.enable === true) {
    const title: ReactNode = maybeFun(confirm.title, context)
    const content: ReactNode = maybeFun(confirm.content, context)
    if (confirm.type === 'dialog') {
      return (
        <IconText
          {...actionProps}
          onClick={() =>
            handleDialogConfirm(
              title,
              content,
              confirm.floatProps,
              async () => {
                await onClick?.(context)
              }
            )
          }
        >
          {action.title}
        </IconText>
      )
    }
    return (
      <Popconfirm
        title={title}
        disabled={disabled}
        description={content}
        trigger="click"
        onConfirm={handleActionClick}
        okButtonProps={confirm?.floatProps?.confirmButtonProps}
        okText={confirm?.floatProps?.confirmText}
        cancelText={confirm?.floatProps?.cancelText}
        onCancel={confirm?.floatProps?.onClose}
      >
        <IconText notLoading {...actionProps}>
          {action.title}
        </IconText>
      </Popconfirm>
    )
  }
  return (
    <IconText
      disabled={disabled}
      {..._.omit(actionProps, 'disabled')}
      onClick={handleActionClick}
    >
      {action.title}
    </IconText>
  )
})
