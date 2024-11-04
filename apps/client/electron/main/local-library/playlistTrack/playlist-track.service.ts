import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlaylistTrack } from './playlist-track.entity'

@Injectable()
export class PlaylistTrackService {
  constructor(
    @InjectRepository(PlaylistTrack)
    private playlistTrackRepository: Repository<PlaylistTrack>) {}

  public async addPlaylistTrack(playlistTrack: PlaylistTrack) {
    return await this.playlistTrackRepository.save(playlistTrack)
  }

  public async deletePlaylistTrack(id: number) {
    return await this.playlistTrackRepository.delete(id)
  }

  public async getPlaylistTrackByTrackIdAndPlaylistId(trackId: number, playlistId: number) {
    return this.playlistTrackRepository.findOneBy({ trackId, playlistId })
  }

  public async getNumberOfPlaylistTracksForNonexistentTracks() {
    return this.playlistTrackRepository
      .createQueryBuilder()
      .where('trackId NOT IN (SELECT trackId FROM track)')
      .getCount()
  }

  public async deletePlaylistTracksForNonexistent() {
    try {
      const res = await this.playlistTrackRepository
        .createQueryBuilder()
        .delete()
        .where('trackId NOT IN (SELECT trackId FROM track)')
        .orWhere('playlistId NOT IN (SELECT id FROM playlist)')
        .execute()
      return res
    }
    catch (e) {
      console.error('something error')
    }
  }
}
