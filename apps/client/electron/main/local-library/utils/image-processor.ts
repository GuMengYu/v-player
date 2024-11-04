import { Injectable } from '@nestjs/common'
import { NativeImage, Size, nativeImage } from 'electron'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'
import { FileAccess } from './io/file-access'

@Injectable()
export class ImageProcessor {
  public constructor(private fileAccess: FileAccess) {}

  public async convertImageBufferToFileAsync(imageBuffer: Buffer, imagePath: string): Promise<void> {
    await fs.writeFile(imagePath, imageBuffer)
  }

  public async convertLocalImageToBufferAsync(imagePath: string): Promise<Buffer> {
    const imageBuffer: Buffer = await this.fileAccess.getFileContentAsBufferAsync(imagePath)

    return imageBuffer
  }

  public async convertOnlineImageToBufferAsync(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl)
    const imageArrayBuffer: ArrayBuffer = await response.arrayBuffer()
    const imageBuffer: Buffer = Buffer.from(imageArrayBuffer)

    return imageBuffer
  }

  public convertBufferToImageUrl(imageBuffer: Buffer): string {
    return `data:image/png;base64,${imageBuffer.toString('base64')}`
  }

  public async resizeImageAsync(imageBuffer: Buffer, maxWidth: number, maxHeight: number, jpegQuality: number): Promise<Buffer> {
    let image: NativeImage = await nativeImage.createFromBuffer(imageBuffer)
    const imageSize: Size = image.getSize()

    if (imageSize.width > maxWidth || imageSize.height > maxHeight)
      image = image.resize({ width: maxWidth, height: maxHeight, quality: 'best' })

    return image.toJPEG(jpegQuality)
  }
}
