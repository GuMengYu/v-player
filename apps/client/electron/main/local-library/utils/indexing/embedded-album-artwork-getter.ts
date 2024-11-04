import { Injectable } from '@nestjs/common'

// import { Logger } from '../../common/logger'
import { IFileMetadata } from '../metadata/i-file-metadata'

@Injectable()
export class EmbeddedAlbumArtworkGetter {
  public getEmbeddedArtwork(fileMetadata: IFileMetadata): Buffer {
    if (!fileMetadata)
      return undefined

    let artworkData: Buffer

    try {
      artworkData = fileMetadata.picture
    }
    catch (error) {
      console.error(
                `Could not get embedded artwork for track with path='${fileMetadata.path}'`,
                'EmbeddedAlbumArtworkGetter',
                'getEmbeddedArtwork',
      )
    }

    return artworkData
  }
}
