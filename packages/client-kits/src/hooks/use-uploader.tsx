import { DraggerProps, RcFile } from 'antd/es/upload'
import { FileInfo, getFileInfo } from '@ff-kits/base'

import { useAppStorage } from './use-app-storage'
import { useImmer } from 'use-immer'

export type UseUploaderOptions = {
  value?: string
  formatKey?: (fileInfo: FileInfo) => string
  onChange?: (value: string, file: RcFile, fileInfo: FileInfo) => void
}

type UploaderState = {
  file: RcFile | null
  fileInfo: FileInfo | null
}
export type Uploader = {
  customRequest: DraggerProps['customRequest']
  reset: () => void
  state: UploaderState
}

export function useUploader({
  onChange,
  formatKey,
  value,
}: UseUploaderOptions): Uploader {
  const appStorage = useAppStorage()
  const [state, setState] = useImmer<UploaderState>({
    file: null,
    fileInfo: null,
  })

  const customRequest: DraggerProps['customRequest'] = async ({ file }) => {
    const fileInfo = await getFileInfo(file as File)
    setState((d) => {
      d.file = file as RcFile
      d.fileInfo = fileInfo
    })

    const key = formatKey
      ? formatKey(fileInfo)
      : `uploads/${fileInfo.md5}${fileInfo.ext}`
    await appStorage.upload(key, file as File)
    onChange?.(key, file as RcFile, fileInfo)
  }
  const reset = () => {
    setState((d) => {
      d.file = null
      d.fileInfo = null
    })
  }
  return {
    customRequest,
    reset,
    state,
  }
}
