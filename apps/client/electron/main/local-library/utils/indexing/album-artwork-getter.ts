import { Injectable } from '@nestjs/common'
import { IFileMetadata } from '../metadata/i-file-metadata'

// import { BaseSettings } from '../../common/settings/base-settings'
import { EmbeddedAlbumArtworkGetter } from './embedded-album-artwork-getter'
import { ExternalAlbumArtworkGetter } from './external-album-artwork-getter'
import { OnlineAlbumArtworkGetter } from './online-album-artwork-getter'

@Injectable()
export class AlbumArtworkGetter {
  constructor(
    private embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter,
    private externalAlbumArtworkGetter: ExternalAlbumArtworkGetter,
    private onlineAlbumArtworkGetter: OnlineAlbumArtworkGetter,
    // private settings: BaseSettings,
  ) {}

  public async getAlbumArtworkAsync(fileMetadata: IFileMetadata, getOnlineArtwork: boolean): Promise<Buffer> {
    if (!fileMetadata)
      return undefined

    const embeddedArtwork: Buffer = this.embeddedAlbumArtworkGetter.getEmbeddedArtwork(fileMetadata)

    if (embeddedArtwork)
      return embeddedArtwork

    const externalArtwork: Buffer = await this.externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetadata)

    if (externalArtwork)
      return externalArtwork

    // if (getOnlineArtwork && this.settings.downloadMissingAlbumCovers) {
    // if (getOnlineArtwork && false) {
    //   const onlineArtwork: Buffer = await this.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetadata)

    //   if (onlineArtwork)
    //     return onlineArtwork
    // }

    return undefined
  }
}
