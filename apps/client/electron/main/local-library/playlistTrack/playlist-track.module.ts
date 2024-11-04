import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlaylistTrackService } from './playlist-track.service'
import { PlaylistTrack } from './playlist-track.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistTrack])],
  providers: [PlaylistTrackService],
  exports: [PlaylistTrackService],
})
export class PlaylistTrackModule {
}
