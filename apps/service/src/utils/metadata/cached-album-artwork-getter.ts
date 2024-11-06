import { Injectable } from '@nestjs/common'
import { AlbumData } from '../../album/album.entity'
import { FileAccess } from '../io/file-access'
import { TrackService } from '../../track/track.service'

@Injectable()
export class CachedAlbumArtworkGetter {
  constructor(private trackService: TrackService, private fileAccess: FileAccess) {}

  public async getCachedAlbumArtworkPath(albumKey: string) {
    const albumDataForAlbumKey: AlbumData[] = await this.trackService.getAlbumDataForAlbumKey(albumKey)

    if (albumDataForAlbumKey.length > 0)
      return this.fileAccess.coverArtFullPath(albumDataForAlbumKey[0].artworkId)

    return ''
  }
  public async getCachedAlbumArtworkHttpPath(albumKey: string) {
    const albumDataForAlbumKey: AlbumData[] = await this.trackService.getAlbumDataForAlbumKey(albumKey)

    if (albumDataForAlbumKey.length > 0)
      return this.fileAccess.coverArtHttpPath(albumDataForAlbumKey[0].artworkId)

    return ''
  }
}
