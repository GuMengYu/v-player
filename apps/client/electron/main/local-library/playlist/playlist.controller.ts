import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
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

  @IpcHandle('add-playlist')
  public addPlayList(name: string) {
    const newPlaylist: Playlist = new Playlist()
    newPlaylist.name = name
    return this.playlistService.addPlaylist(newPlaylist)
  }

  @IpcHandle('all-playlist')
  async getAllPlaylist() {
    return this.playlistService.getAllPlaylist()
  }

  @IpcHandle('delete-playlist')
  async deletePlaylist(id: number) {
    return this.playlistService.deletePlaylist(id)
  }

  @IpcHandle('rename-playlist')
  async renamePlaylist(req: [number, string]) {
    const [id, newName] = req
    return this.playlistService.renamePlaylist(id, newName)
  }

  @IpcHandle('add-track')
  async addTrack(req: [number, number]) {
    const [trackId, playlistId] = req

    const exist = await this.playlistTrackService.getPlaylistTrackByTrackIdAndPlaylistId(trackId, playlistId)
    if (exist)
      return false

    const playlistTrack = new PlaylistTrack()
    playlistTrack.trackId = trackId
    playlistTrack.playlistId = playlistId
    return this.playlistTrackService.addPlaylistTrack(playlistTrack)
  }

  @IpcHandle('remove-track')
  async removeTrack(req: [number, number]) {
    const [trackId, playlistId] = req

    const playListTrack = await this.playlistTrackService.getPlaylistTrackByTrackIdAndPlaylistId(trackId, playlistId)

    console.log(playListTrack)
    return this.playlistTrackService.deletePlaylistTrack(playListTrack.playlistTrackId)
  }
}
