import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumArtwork } from './albumArtwork.entity'
import { AlbumArtworkService } from './albumArtwork.service'

@Module({
  imports: [TypeOrmModule.forFeature([AlbumArtwork])],
  providers: [AlbumArtworkService],
  exports: [AlbumArtworkService],
})
export class AlbumArtworkModule {}
