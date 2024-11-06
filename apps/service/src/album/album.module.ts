import { Module } from '@nestjs/common'
import { TrackModule } from '../track/track.module'
import { IoModule } from '../utils/io/io.module'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'

@Module({
  imports: [TrackModule, IoModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
