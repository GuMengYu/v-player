import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RemovedTrack } from './removedTrack.entity'
import { RemovedTrackService } from './removedTrack.service'

@Module({
  imports: [TypeOrmModule.forFeature([RemovedTrack])],
  providers: [RemovedTrackService],
  exports: [RemovedTrackService],
})
export class RemovedTrackModule {}
