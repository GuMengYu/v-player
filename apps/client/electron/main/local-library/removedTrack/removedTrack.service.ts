import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RemovedTrack } from './removedTrack.entity'

@Injectable()
export class RemovedTrackService {
  constructor(
    @InjectRepository(RemovedTrack)
    private removedTrackRepository: Repository<RemovedTrack>,
  ) {
  }

  public async getRemovedTracks() {
    return this.removedTrackRepository.find()
  }
}
