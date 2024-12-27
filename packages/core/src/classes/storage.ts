import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  StoragePresignedUrlModel,
  StorageStsModel,
} from '../domain/models/storage.models'
import { download, isImageUrl } from '@ff-kits/base'

import { ApiFun } from '../interfaces'
import { EventEmitter } from './event-emitter'
import { GetStorageUploadPresignedUrlDto } from '../domain'
import axios from 'axios'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export type GetUploadUrlApi = ApiFun<
  StoragePresignedUrlModel,
  GetStorageUploadPresignedUrlDto
>

export type StorageOptions = {
  fns: {
    getUploadUrl: GetUploadUrlApi
    getTemporaryCredentials: ApiFun<StorageStsModel>
  }
  previewHost?: string
}
export class AppStorage extends EventEmitter<'uploaded'> {
  public client?: S3Client
  public bucket?: string
  public fns: StorageOptions['fns']
  public previewHost?: string
  constructor({ fns, previewHost }: StorageOptions) {
    super()
    this.fns = fns
    this.previewHost = previewHost
  }

  private async initial() {
    const res = await this.fns.getTemporaryCredentials()
    const temporaryCredentials = res.data.data as StorageStsModel
    const client = new S3Client({
      endpoint: temporaryCredentials.endpoint,
      region: temporaryCredentials.region,
      credentials: {
        accessKeyId: temporaryCredentials.accessKeyId,
        secretAccessKey: temporaryCredentials.secretAccessKey,
        sessionToken: temporaryCredentials.sessionToken,
      },
      forcePathStyle: true,
    })
    this.bucket = temporaryCredentials.bucket
    this.client = client
  }
  async upload(key: string, file: File) {
    if (!this.client) {
      await this.initial()
    }
    await this.client?.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
      })
    )
  }
  async getObjUrl(key: string) {
    if (!this.client) {
      await this.initial()
    }
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    const url = await getSignedUrl(this.client!, command, { expiresIn: 3600 })
    return url
  }

  async uploadWithPresignedUrl(key: string, file: File, access?: string) {
    const payload = await this.fns.getUploadUrl({
      key,
      access,
    })

    const data = payload.data.data!
    await axios.put(data.url, file, {})
    // 后端会返回真实key
    key = data.key
    return key
  }

  formatUrl(key: string = '') {
    if (isImageUrl(key)) {
      return key
    }
    key = key?.startsWith?.('/') ? key : `/${key}`
    return `${this.previewHost}${key}`
  }

  async download(key: string, filename: string) {
    const url = await this.getObjUrl(key)
    download(url, filename)
  }
}
