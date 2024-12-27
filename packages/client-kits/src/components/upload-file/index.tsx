import { DraggerProps, RcFile } from 'antd/es/upload'
import { FileInfo, getFileInfo } from '@ff-kits/base'
import { HTMLAttributes, ReactNode, memo } from 'react'
import { useKitI18n, useKitI18nTranslation } from '../../i18n'

import { ButtonProps } from 'antd/lib'
import { IconText } from '../icon-text'
import { Upload } from 'antd'
import styles from './style.module.scss'
import { useUploader } from '../../hooks/use-uploader'

export type UploadFileProps = Partial<{
  title: ReactNode
  tip: ReactNode
  value: string
  accept: string

  onChange: (value: string, file: RcFile, fileInfo: FileInfo) => void
}>

export const UploadFile = memo<UploadFileProps>(
  ({ title, accept, tip, onChange }) => {
    const t = useKitI18nTranslation()
    const { customRequest, reset, state } = useUploader({
      onChange(value, file, fileInfo) {
        onChange?.(value, file, fileInfo)
      },
    })

    const reupload: ButtonProps['onClick'] = (e) => {
      e.stopPropagation()
      reset()
    }
    return (
      <Upload.Dragger
        className={styles.wrap}
        customRequest={customRequest}
        showUploadList={false}
        disabled={!!state?.file}
        accept={accept}
      >
        {state.file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {/* <RatioImage
                className="w-8 h-8"
                data={fileIconResolver.resolve(state?.fileInfo?.extname)}
              /> */}
              <span className="text-default">{state?.fileInfo?.name}</span>
            </div>
            <IconText type="primary" onClick={reupload}>
              {t('upload.reUpload')}
            </IconText>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              {title}{' '}
              <IconText type="primary">{t('upload.uploadFile')}</IconText>
            </div>
            <div className="text-xs text-light">{tip}</div>
          </div>
        )}
      </Upload.Dragger>
    )
  }
)
