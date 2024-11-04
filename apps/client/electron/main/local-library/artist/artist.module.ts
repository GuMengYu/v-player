import { Module } from '@nestjs/common'
import { TrackModule } from '../track/track.module'
import { IoModule } from '../utils/io/io.module'
import { ArtistService } from './artist.service'
import { ArtistController } from './artist.controller'

@Module({
  imports: [TrackModule, IoModule],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
