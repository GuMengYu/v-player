import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AlbumArtwork } from './albumArtwork.entity'

@Injectable()
export class AlbumArtworkService {
  constructor(
    @InjectRepository(AlbumArtwork)
    private albumArtworkRepository: Repository<AlbumArtwork>) {
  }

  public getAllAlbumArtwork() {
    return this.albumArtworkRepository.find()
  }

  public async getNumberOfAlbumArtworkThatHasNoTrack() {
    return await this.albumArtworkRepository
      .createQueryBuilder()
      .where('albumKey NOT IN (SELECT albumKey FROM track)')
      .getCount()
  }

  public async deleteAlbumArtworkThatHasNoTrack() {
    const res = await this.albumArtworkRepository
      .createQueryBuilder()
      .delete()
      .where('albumKey NOT IN (SELECT albumKey FROM track)')
      .execute()

    return res.affected
  }

  public async getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
    return await this.albumArtworkRepository
      .createQueryBuilder()
      .where('albumKey IN (SELECT albumKey FROM Track WHERE needsAlbumArtworkIndexing = 1)')
      .getCount()
  }

  public async deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
    const res = await this.albumArtworkRepository
      .createQueryBuilder()
      .delete()
      .where('albumKey IN (SELECT albumKey FROM Track WHERE needsAlbumArtworkIndexing = 1)')
      .execute()
    return res.affected
  }

  public async getNumberOfAlbumArtwork() {
    return this.albumArtworkRepository.count()
  }

  public async addAlbumArtwork(albumArtwork: AlbumArtwork) {
    return this.albumArtworkRepository.save(albumArtwork)
  }
}
