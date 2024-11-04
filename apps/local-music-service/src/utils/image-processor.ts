import { Injectable } from '@nestjs/common'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'
import { FileAccess } from './io/file-access'
import * as sharp from 'sharp'

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
    const image = sharp(imageBuffer)

    // 获取图像的尺寸
    const metadata = await image.metadata()

    // 检查尺寸是否超过最大宽高
    if (metadata.width && metadata.height && (metadata.width > maxWidth || metadata.height > maxHeight)) {
      // 调整尺寸并设置质量
      return image
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: sharp.fit.inside, // 适应宽高范围
          withoutEnlargement: true // 避免放大
        })
        .jpeg({ quality: jpegQuality }) // 转换为 JPEG 并设置质量
        .toBuffer()
    }

    // 如果尺寸符合要求，则直接压缩为指定质量的 JPEG
    return image.jpeg({ quality: jpegQuality }).toBuffer()
  }
}
