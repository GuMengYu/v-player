import { Injectable } from '@nestjs/common'

import { Constants } from '../constant/constants'
import { ImageProcessor } from '../image-processor'

// import { Logger } from '../../common/logger'
import { FileAccess } from '../io/file-access'
import { AlbumArtworkCacheId } from './album-artwork-cache-id'
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory'

@Injectable()
export class AlbumArtworkCacheService {
  constructor(
    private albumArtworkCacheIdFactory: AlbumArtworkCacheIdFactory,
    private imageProcessor: ImageProcessor,
    private fileAccess: FileAccess,
    // private logger: Logger,
  ) {
    this.createCoverArtCacheOnDisk()
  }

  public async removeArtworkDataFromCacheAsync(artworkId: string): Promise<void> {
    try {
      const cachedArtworkFilePath: string = this.fileAccess.coverArtFullPath(artworkId)
      await this.fileAccess.deleteFileIfExistsAsync(cachedArtworkFilePath)
    }
    catch (e: any) {
      console.error(
                `Could not remove artwork data from cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'removeArtworkDataFromCacheAsync',
      )
    }
  }

  public async addArtworkDataToCacheAsync(imageBuffer: Buffer): Promise<AlbumArtworkCacheId> {
    if (!imageBuffer)
      return undefined

    if (imageBuffer.length === 0)
      return undefined

    try {
      const albumArtworkCacheId: AlbumArtworkCacheId = this.albumArtworkCacheIdFactory.create()
      const cachedArtworkFilePath: string = this.fileAccess.coverArtFullPath(albumArtworkCacheId.id)
      const resizedImageBuffer: Buffer = await this.imageProcessor.resizeImageAsync(
        imageBuffer,
        Constants.cachedCoverArtMaximumSize,
        Constants.cachedCoverArtMaximumSize,
        Constants.cachedCoverArtJpegQuality,
      )
      await this.imageProcessor.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath)

      return albumArtworkCacheId
    }
    catch (e: any) {
      console.error(
                `Could not add artwork data to cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'addArtworkDataToCacheAsync',
      )
    }

    return undefined
  }

  private createCoverArtCacheOnDisk(): void {
    try {
      this.fileAccess.createFullDirectoryPathIfDoesNotExist(this.fileAccess.coverArtCacheFullPath())
    }
    catch (e: any) {
      console.error(
                `Could not create artwork cache directory. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'createDirectories',
      )

      // We cannot proceed if the above fails
      throw e
    }
  }
}
