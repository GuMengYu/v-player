import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MetadataModule } from '../utils/metadata/metadata.module'
import { PlaylistTrackModule } from '../playlistTrack/playlist-track.module'
import { IoModule } from '../utils/io/io.module'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { Playlist } from './playlist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), forwardRef(() => MetadataModule), PlaylistTrackModule, IoModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
