import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { MetadataService } from '../utils/metadata/metadata.service'
import { TrackService } from './track.service'
import { TrackModel } from './track-model'

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly metadataService: MetadataService,
  ) {
  }

  @IpcHandle('all-tracks')
  async getAllTracks() {
    const tracks = await this.trackService.getAllTracksNormalized()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @IpcHandle('get-track')
  async getTrack(trackId: number) {
    const track = await this.trackService.getTrackById(trackId)
    const trackModel = new TrackModel(track)
    const albumPath = await this.metadataService.createImageUrlAsync(trackModel)
    return {
      ...trackModel,
      id: trackModel.id,
      name: trackModel.fileName,
      dt: trackModel.durationInMilliseconds,
      url: `file:///${trackModel.path}`,
      ar: trackModel.artists?.split(',').map(i => ({
        name: i,
        id: i,
      })),
      al: {
        id: trackModel.albumTitle,
        name: trackModel.albumTitle,
        picUrl: albumPath,
      },
      liked: trackModel.love === 1,
      local: true,
    }
  }

  @IpcHandle('get-album-tracks')
  async getAlbumTracks(albumKey: string) {
    const tracks = await this.trackService.getTracksForAlbums(albumKey)
    return {
      data: tracks,
    }
  }

  @IpcHandle('get-playlist-tracks')
  async getPlaylistTracks(playlistId: number) {
    const tracks = await this.trackService.getTracksForPlaylist(playlistId)
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @IpcHandle('toggle-track-like')
  async toggleTrackLike(payload: [trackId: number, liked: boolean ]) {
    const [trackId, liked] = payload
    return this.trackService.updateLove(trackId, liked ? 1 : 0)
  }

  @IpcHandle('liked-tracks')
  async getArtistAlbums(trackId: number) {
    const tracks = await this.trackService.getTracksForLiked()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }
}
