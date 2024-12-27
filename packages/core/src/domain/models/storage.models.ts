export class StorageStsModel {
  endpoint: string
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
  expiration: number
}

export class StoragePresignedUrlModel {
  key: string
  url: string
}
