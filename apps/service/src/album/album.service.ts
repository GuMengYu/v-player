import { Injectable } from '@nestjs/common'
import { TrackService } from '../track/track.service'
import { FileAccess } from '../utils/io/file-access'
import { ArtistType } from '../artist/artist-type'
import { AlbumData } from './album.entity'
import { AlbumModel } from './album-model'

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private fileAccess: FileAccess,
  ) {
  }

  public async getAllAlbums() {
    const albumDatas: AlbumData[] = await this.trackService.getAllAlbumData()

    return this.createAlbumsFromAlbumData(albumDatas)
  }

  public async getAlbumsForArtists(artists: string[], artistType: ArtistType) {
    const albumDatas: AlbumData[] = []

    if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
      const trackArtistsAlbumDatas: AlbumData[] =
        await this.trackService.getAlbumDataForTrackArtists(artists) ?? []

      for (const albumData of trackArtistsAlbumDatas)
        albumDatas.push(albumData)

    }

    if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
      const albumArtistsAlbumDatas: AlbumData[] =
        await this.trackService.getAlbumDataForAlbumArtists( artists) ?? []

      for (const albumData of albumArtistsAlbumDatas) {
        // Avoid adding a track twice
        if (!albumDatas.map(x => x.albumKey).includes(albumData.albumKey))
          albumDatas.push(albumData)

      }
    }

    return this.createAlbumsFromAlbumData(albumDatas)
  }


  private createAlbumsFromAlbumData(albumDatas: AlbumData[]) {
    if (albumDatas) {
      return albumDatas.map((x) => {
        const al = new AlbumModel(x, this.fileAccess)
        return {
          albumData: x,
          name: al.albumTitle,
          id: al.albumKey,
          ar: al.albumArtist,
          picUrl: al.artworkPath,
        }
      })
    }

    return []
  }
}
