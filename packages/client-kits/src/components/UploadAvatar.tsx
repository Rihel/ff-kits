import { Avatar, Button } from 'antd'
import { memo, useMemo } from 'react'
import { useAppStorage, useUploader } from '../hooks'

import { Upload } from 'antd/lib'
import { isImageUrl } from '@ff-kits/base'
import { useKitI18nTranslation } from '../i18n'

export type UploadAvatarProps = Partial<{
  value: string
  onChange: (key: string) => void
}>

export const UploadAvatar = memo<UploadAvatarProps>(({ onChange, value }) => {
  const appStorage = useAppStorage()
  const t = useKitI18nTranslation()
  const { customRequest } = useUploader({
    onChange(value, file, fileInfo) {
      onChange?.(value)
    },
  })

  const url = useMemo(() => {
    if (!value) return ''
    return isImageUrl(value as string)
      ? value
      : appStorage.formatUrl(value as string)
  }, [value])

  return (
    <Upload
      showUploadList={false}
      customRequest={customRequest}
      accept="image/png,image/jpeg,image/gif"
    >
      <div className="flex items-center gap-6">
        <Avatar src={url} shape="square" size={48} />
        <Button>{t('upload.changeAvatar')}</Button>
      </div>
    </Upload>
  )
})
