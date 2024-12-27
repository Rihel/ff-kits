import './style.scss'

import {
  Button,
  ButtonProps,
  Drawer,
  DrawerProps,
  Modal,
  ModalProps,
  Space,
} from 'antd'
import { ReactNode, memo, useMemo } from 'react'
import { useKitI18n, useKitI18nEntry } from '../../i18n'

import { FFIcon } from '../icon'
import _ from 'lodash'
import classNames from 'classnames'
import { createCssSelector } from '@ff-kits/base'
import { useImmer } from 'use-immer'

const styles = createCssSelector('base-float', {
  drawer: ['content', 'footer'],
  dialog: ['content'],
})

export type FloatType = 'dialog' | 'drawer'
export type BaseFloatComponentProps<T extends FloatType = 'dialog'> = Partial<
  {
    visible: boolean
    onChange: (v?: boolean) => void
    type: FloatType
    title: ReactNode
    width: string | number
    onConfirm: (() => Promise<void>) | (() => void)
    onClose: () => void
    hasSpace: boolean
    fixedHeight: boolean
    children: ReactNode | DrawerProps['children']
    footerLeft: ReactNode
    footerRight: ReactNode
    hasFooter: boolean
    confirmText: string
    cancelText: string
    confirmedClose: boolean
    confirmButtonProps: Omit<ButtonProps, 'loading' | 'onClick'>
  } & FloatProps<T>
>
export type FloatProps<T> = T extends 'drawer'
  ? DrawerProps
  : T extends 'dialog'
    ? ModalProps
    : never

export const BaseFloatComponent = memo<BaseFloatComponentProps<'dialog'>>(
  ({
    type = 'dialog',
    visible = false,
    hasSpace = false,
    fixedHeight = false,
    hasFooter = true,

    onChange,

    title,
    width,
    onConfirm,
    confirmButtonProps,
    onClose,

    children,
    footerLeft,
    footerRight,
    ...props
  }) => {
    const defaultDialogHeight =
      window.innerHeight - 55 - 53 - window.innerHeight * 0.1
    const [confirmLoading, setConfirmLoading] = useImmer(false)
    const actualWidth = useMemo(() => {
      if (_.isNil(width)) return 688
      if (typeof width === 'string') {
        return width
      }

      return width
    }, [width])

    async function handleClick() {
      try {
        setConfirmLoading(true)
        await onConfirm?.()
        handleClose()
      } catch (error) {
        throw error
      } finally {
        setConfirmLoading(false)
      }
    }
    function handleClose() {
      onChange?.(false)
      onClose?.()
    }

    const okText = useKitI18nEntry('baseFloat.confirm', props.confirmText!)
    const cancelText = useKitI18nEntry('baseFloat.cancel', props.cancelText!)

    const floatProps: any = {
      title,
      confirmLoading,
      okText: okText,
      width: actualWidth,
      cancelText: cancelText,
      destroyOnClose: true,
      ...props,
    }

    const heightKey = fixedHeight ? 'height' : 'maxHeight'
    if (type === 'dialog') {
      if (hasFooter === false) {
        floatProps.footer = null
      }

      return (
        <Modal
          {...floatProps}
          open={visible}
          onOk={handleClick}
          wrapClassName={styles.dialog}
          onCancel={handleClose}
          centered
          okButtonProps={confirmButtonProps}
        >
          <div
            style={{
              [heightKey]: defaultDialogHeight + 'px',
            }}
            className={classNames({
              [styles.dialogContent]: true,
              hasSpace,
            })}
          >
            {children}
          </div>
        </Modal>
      )
    }
    return (
      // @ts-ignore
      <Drawer
        {...floatProps}
        open={visible}
        className={styles.drawer}
        onClose={handleClose}
      >
        <>
          <div className={styles.drawerContent}>{children}</div>
          {hasFooter && (
            <div className={styles.drawerFooter}>
              <Space>
                {footerLeft}
                <Button onClick={handleClose}>{cancelText}</Button>
                <Button
                  onClick={handleClick}
                  loading={confirmLoading}
                  type="primary"
                  {...confirmButtonProps}
                >
                  {okText}
                </Button>
                {footerRight}
              </Space>
            </div>
          )}
        </>
      </Drawer>
    )
  }
)
