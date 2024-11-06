import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Track } from '../track/track.entity'
import { AlbumArtwork } from '../albumArtwork/albumArtwork.entity'
import { PlaylistTrack } from '../playlistTrack/playlist-track.entity'
import { FileAccess } from '../utils/io/file-access'
import { PlaylistTrackService } from '../playlistTrack/playlist-track.service'
import { Playlist } from './playlist.entity'
import { PlaylistModel } from './playlist.model'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private repo: Repository<Playlist>,
    private fileAccess: FileAccess,
    private playlistTrackService: PlaylistTrackService,
  ) {}


  async getAllPlaylist() {
    const res = await this.repo
      .createQueryBuilder('playlist')
      .select()
      .leftJoin(PlaylistTrack, 'playlistTrack', 'playlistTrack.playlistId = playlist.id')
      .leftJoin(Track, 'track', 'track.trackId = playlistTrack.trackId')
      .leftJoin(AlbumArtwork, 'albumArtwork', 'albumArtwork.albumKey = track.albumKey')
      .addSelect([
        'playlist.id',
        'playlist.name',
        'COALESCE(albumArtwork.artworkId, \'\') AS artworkUrl',
      ])
      .groupBy('playlist.id')  // 确保每个 playlist 都被返回
      .getRawMany()
    return res.map((item) => {
      const playlist = new PlaylistModel(item, this.fileAccess)
      return {
        id: playlist.id,
        name: playlist.name,
        picUrl: playlist.artworkUrl,
      }
    })
  }

  async getPlaylist(id: number) {
    return await this.repo.findOneBy({ id })
  }

  public async addPlaylist(playlist: Playlist) {
    await this.repo.save(playlist)
  }

  public async updatePlaylist(playlist: Playlist) {
    await this.repo.save(playlist)
  }

  public async renamePlaylist(id: number, newName: string) {
    await this.repo.update(id, { name: newName })
  }

  public async deletePlaylist(id: number) {
    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute()
      await this.playlistTrackService.deletePlaylistTracksForNonexistent()

    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }
}
