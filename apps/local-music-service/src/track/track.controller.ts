import { Controller, Post } from '@nestjs/common'

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

  @Post('all-tracks')
  async getAllTracks() {
    const tracks = await this.trackService.getAllTracksNormalized()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @Post('get-track')
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

  @Post('get-album-tracks')
  async getAlbumTracks(albumKey: string) {
    const tracks = await this.trackService.getTracksForAlbums(albumKey)
    return {
      data: tracks,
    }
  }

  @Post('get-playlist-tracks')
  async getPlaylistTracks(playlistId: number) {
    const tracks = await this.trackService.getTracksForPlaylist(playlistId)
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @Post('toggle-track-like')
  async toggleTrackLike(payload: [trackId: number, liked: boolean ]) {
    const [trackId, liked] = payload
    return this.trackService.updateLove(trackId, liked ? 1 : 0)
  }

  @Post('liked-tracks')
  async getArtistAlbums(trackId: number) {
    const tracks = await this.trackService.getTracksForLiked()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }
}
