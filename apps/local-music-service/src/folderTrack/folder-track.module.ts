import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FolderTrack } from './folder-track.entity'
import { FolderTrackService } from './folder-track.service'

@Module({
  imports: [TypeOrmModule.forFeature([FolderTrack])],
  providers: [FolderTrackService],
  exports: [FolderTrackService],
})
export class FolderTrackModule {
}
