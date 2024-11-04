import { Injectable } from '@nestjs/common'
import { LastfmAlbum } from '../lastfm/lastfm-album'
import { LastfmApi } from '../lastfm/lastfm-api'
import { ImageProcessor } from '../image-processor'

// import { Logger } from '../../common/logger'
import { IFileMetadata } from '../metadata/i-file-metadata'
import { Strings } from '../strings'

@Injectable()
export class OnlineAlbumArtworkGetter {
  constructor(private imageProcessor: ImageProcessor, private lastfmApi: LastfmApi) {}

  public async getOnlineArtworkAsync(fileMetadata: IFileMetadata): Promise<Buffer> {
    if (!fileMetadata)
      return undefined

    let title: string = ''
    const artists: string[] = []

    // Title
    if (!Strings.isNullOrWhiteSpace(fileMetadata.album))
      title = fileMetadata.album
    else if (!Strings.isNullOrWhiteSpace(fileMetadata.title))
      title = fileMetadata.title

    // Artist
    if (fileMetadata.albumArtists && fileMetadata.albumArtists.length > 0) {
      const nonWhiteSpaceAlbumArtists: string[] = fileMetadata.albumArtists.filter(x => !Strings.isNullOrWhiteSpace(x))
      artists.push(...nonWhiteSpaceAlbumArtists)
    }

    if (fileMetadata.artists && fileMetadata.artists.length > 0) {
      const nonWhiteSpaceTrackArtists: string[] = fileMetadata.artists.filter(x => !Strings.isNullOrWhiteSpace(x))
      artists.push(...nonWhiteSpaceTrackArtists)
    }

    if (Strings.isNullOrWhiteSpace(title) || artists.length === 0)
      return undefined

    for (const artist of artists) {
      let lastfmAlbum: LastfmAlbum

      try {
        lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN')
      }
      catch (e: any) {
        console.error(
                    `Could not get album info for artist='${artist}' and title='${title}'. Error: ${e.message}`,
                    'OnlineAlbumArtworkGetter',
                    'getOnlineArtworkAsync',
        )
      }

      if (lastfmAlbum) {
        if (!Strings.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
          let artworkData: Buffer

          try {
            artworkData = await this.imageProcessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage())

            console.info(
                            `Downloaded online artwork for artist='${artist}' and title='${title}'`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync',
            )

            return artworkData
          }
          catch (e: any) {
            console.error(
                            `Could not convert file '${lastfmAlbum.largestImage()}' to data. Error: ${e.message}`,
                            'OnlineAlbumArtworkGetter',
                            'getOnlineArtworkAsync',
            )
          }
        }
      }
    }

    return undefined
  }
}
