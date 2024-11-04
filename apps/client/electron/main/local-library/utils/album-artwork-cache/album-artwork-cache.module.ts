import { Module } from '@nestjs/common'
import { ImageProcessor } from '../image-processor'
import { AlbumArtworkModule } from '../../albumArtwork/albumArtwork.module'
import { IoModule } from '../io/io.module'
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory'
import { AlbumArtworkCacheService } from './album-artwork-cache.service'

@Module({
  imports: [AlbumArtworkModule, IoModule],
  providers: [ImageProcessor, AlbumArtworkCacheIdFactory, AlbumArtworkCacheService],
  exports: [ImageProcessor, AlbumArtworkCacheService],
})
export class AlbumArtworkCacheModule {}
