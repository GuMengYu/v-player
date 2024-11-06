import { Body, Controller, Get, Post, Query, Param, Res } from '@nestjs/common'
import { Response } from 'express';

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

  @Get('all-tracks')
  async getAllTracks() {
    const tracks = await this.trackService.getAllTracksNormalized()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @Get('get-track')
  async getTrack(@Query('trackId') trackId: number) {
    const track = await this.trackService.getTrackById(trackId)
    const trackModel = new TrackModel(track)
    const albumPath = await this.metadataService.createImageUrlAsync(trackModel)
    return {
      ...trackModel,
      id: trackModel.id,
      name: trackModel.fileName,
      dt: trackModel.durationInMilliseconds,
      url: `http://localhost:${process.env.PORT || 3000}/track/get-url/${trackModel.id}`,
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
  @Get('get-url/:trackId')
  async getUrl(@Param('trackId') id: number, @Res() res: Response) {
    console.log('get track url----', id)
    const track = await this.trackService.getTrackById(id)
    const trackModel = new TrackModel(track)
    return res.sendFile(trackModel.path)
  }

  @Get('get-album-tracks')
  async getAlbumTracks(@Query('albumKey') albumKey: string) {
    const tracks = await this.trackService.getTracksForAlbums(albumKey)
    return {
      data: tracks,
    }
  }

  @Get('get-playlist-tracks')
  async getPlaylistTracks(@Query('playlistId') playlistId: number) {
    const tracks = await this.trackService.getTracksForPlaylist(playlistId)
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }

  @Post('toggle-track-like')
  async toggleTrackLike(@Body() payload) {
    const [trackId, liked] = payload
    return this.trackService.updateLove(trackId, liked ? 1 : 0)
  }

  @Get('liked-tracks')
  async getLikedTracks() {
    const tracks = await this.trackService.getTracksForLiked()
    return {
      data: tracks,
      totalSize: tracks.reduce((prev, crt) => prev + crt.size, 0),
      totalDt: tracks.reduce((prev, crt) => prev + crt.dt, 0),
    }
  }
}
