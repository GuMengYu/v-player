import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FolderTrack } from './folder-track.entity'

@Injectable()
export class FolderTrackService {
  constructor(
    @InjectRepository(FolderTrack)
    private folderTrackRepository: Repository<FolderTrack>) {}

  public async addFolderTrack(folderTrack: FolderTrack) {
    await this.folderTrackRepository.save(folderTrack)
  }

  public async getNumberOfFolderTracksForNonexistentTracks() {
    return this.folderTrackRepository
      .createQueryBuilder()
      .where('trackId NOT IN (SELECT trackId FROM track)')
      .getCount()
  }

  public async deleteFolderTracksForNonexistentTracks() {
    try {
      const res = await this.folderTrackRepository
        .createQueryBuilder()
        .delete()
        .where('trackId NOT IN (SELECT trackId FROM track)')
        .execute()
      return res
    }
    catch (e) {
      console.error('something error')
    }
  }
}
