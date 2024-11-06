import { Controller, Delete, Get, Post, Body } from '@nestjs/common';

import { PlaylistTrackService } from '../playlistTrack/playlist-track.service'
import { PlaylistTrack } from '../playlistTrack/playlist-track.entity'
import { PlaylistService } from './playlist.service'
import { Playlist } from './playlist.entity'

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly playlistTrackService: PlaylistTrackService,
  ) {}

  @Post('add-playlist')
  public addPlayList(@Body('name') name: string) {
    const newPlaylist: Playlist = new Playlist()
    newPlaylist.name = name
    return this.playlistService.addPlaylist(newPlaylist)
  }

  @Get('all-playlist')
  async getAllPlaylist() {
    return this.playlistService.getAllPlaylist()
  }

  @Post('delete-playlist')
  async deletePlaylist(@Body('id') id: number) {
    return this.playlistService.deletePlaylist(id)
  }

  @Post('rename-playlist')
  async renamePlaylist(@Body() req) {
    const { id, newName } = req
    return this.playlistService.renamePlaylist(id, newName)
  }

  @Post('add-track')
  async addTrack(@Body() req) {
    const { trackId, playlistId } = req

    const exist = await this.playlistTrackService.getPlaylistTrackByTrackIdAndPlaylistId(trackId, playlistId)
    if (exist)
      return false

    const playlistTrack = new PlaylistTrack()
    playlistTrack.trackId = trackId
    playlistTrack.playlistId = playlistId
    return this.playlistTrackService.addPlaylistTrack(playlistTrack)
  }

  @Post('remove-track')
  async removeTrack(@Body() req) {
    const { trackId, playlistId } = req
    const playListTrack = await this.playlistTrackService.getPlaylistTrackByTrackIdAndPlaylistId(trackId, playlistId)
    return this.playlistTrackService.deletePlaylistTrack(playListTrack.playlistTrackId)
  }
}
