import { Injectable } from '@nestjs/common'

// import { Logger } from '../../common/logger'
import { IFileMetadata } from '../metadata/i-file-metadata'
import { Strings } from '../strings'
import { ImageProcessor } from '../image-processor'
import { ExternalArtworkPathGetter } from './external-artwork-path-getter'

@Injectable()
export class ExternalAlbumArtworkGetter {
  constructor(
    private externalArtworkPathGetter: ExternalArtworkPathGetter,
    private imageProcessor: ImageProcessor,
    // private logger: Logger,
  ) {}

  public async getExternalArtworkAsync(fileMetadata: IFileMetadata): Promise<Buffer> {
    if (!fileMetadata)
      return undefined

    let artworkData: Buffer

    try {
      const externalArtworkPath: string = await this.externalArtworkPathGetter.getExternalArtworkPathAsync(fileMetadata.path)

      if (!Strings.isNullOrWhiteSpace(externalArtworkPath))
        artworkData = await this.imageProcessor.convertLocalImageToBufferAsync(externalArtworkPath)
    }
    catch (e) {
      console.error(
                `Could not get external artwork for track with path='${fileMetadata.path}'`,
                'ExternalAlbumArtworkGetter',
                'getExternalArtwork',
      )
    }

    return artworkData
  }
}
