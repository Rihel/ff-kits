import crypto from 'crypto-js'

export function saveAsJson(json: Record<string, any>, filename: string) {
  const str = JSON.stringify(json, null, 2)
  const blob = new Blob([str], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'
  link.download = filename + '.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function download(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'
  link.target = '_blank'
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function saveAsXlsx(buf: ArrayBuffer, filename: string) {
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'
  link.download = filename + '.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function getFileBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  return buffer
}

export async function getFileMd5(file: File) {
  const arrayBuffer = await getFileBuffer(file)
  const buffer = crypto.lib.WordArray.create(arrayBuffer)
  const result = crypto.MD5(buffer).toString(crypto.enc.Hex)
  return result
}

export function getFileExtName(filename: string) {
  const match = filename.match(/(\..[^\.]+)$/)
  if (match) {
    return match[1]
  }
  return null
}

export type FileInfo = {
  fileSize: number
  name: string
  type: string
  id: string
  md5: string
  ext: string | null
  extname: string | undefined
  size: string
}
export async function getFileInfo(file: File): Promise<FileInfo> {
  const fileMd5 = (await getFileMd5(file)) as string
  const ext = getFileExtName(file.name)
  return {
    fileSize: file.size,
    name: file.name,
    type: file.type,
    id: fileMd5,
    md5: fileMd5,
    ext,
    extname: ext?.replace('.', ''),
    size: (+file.size / 1024).toFixed(1) + 'KB',
  }
}

export function formatFileSize(size: number) {
  const kb = 1024
  const mb = kb * kb
  const gb = mb * 1024
  const tb = gb * 1024
  if (size < 1024) {
    return `${size} byte`
  } else if (size >= kb && size < mb) {
    return (size / kb).toFixed(2) + ' kb'
  } else if (size >= mb && size < gb) {
    return (size / mb).toFixed(2) + ' mb'
  } else if (size >= gb && size < tb) {
    return (size / gb).toFixed(2) + ' gb'
  } else if (size >= tb) {
    return (size / tb).toFixed(2) + ' tb'
  }
}

export function getJsonSize(jsonObj: Record<string, any>) {
  const jsonString = JSON.stringify(jsonObj)
  let jsonSize = 0

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i)

    if (char <= 0x7f) {
      jsonSize += 1
    } else if (char <= 0x7ff) {
      jsonSize += 2
    } else if (char <= 0xffff) {
      jsonSize += 3
    } else {
      jsonSize += 4
    }
  }

  return jsonSize
}

export function isImageUrl(value: string) {
  return /^(?:https?:)|^(data:image\/.*)/.test(value)
}
