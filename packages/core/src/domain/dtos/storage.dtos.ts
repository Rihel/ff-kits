import { IsNotEmpty } from 'class-validator'

export class GetStorageStsDto {}

export class GetStorageUploadPresignedUrlDto {
  @IsNotEmpty({ message: 'key不能为空' })
  key: string
  access?: string
}
