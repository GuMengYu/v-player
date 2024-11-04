import { Module, forwardRef } from '@nestjs/common'
import { IoModule } from '../io/io.module'
import { DateTime } from '../date-time'
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter'
import { ImageProcessor } from '../image-processor'
import { EmbeddedAlbumArtworkGetter } from '../indexing/embedded-album-artwork-getter'
import { ExternalArtworkPathGetter } from '../indexing/external-artwork-path-getter'
import { ExternalAlbumArtworkGetter } from '../indexing/external-album-artwork-getter'
import { OnlineAlbumArtworkGetter } from '../indexing/online-album-artwork-getter'
import { LastfmApi } from '../lastfm/lastfm-api'
import { TrackModule } from '../../track/track.module'
import { FileMetadataFactory } from './file-metadata-factory'
import { MetadataPatcher } from './metadata-patcher'
import { MimeTypes } from './mime-types'
import { MetadataService } from './metadata.service'
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter'

@Module({
  imports: [IoModule, forwardRef(() => TrackModule)],
  providers: [
    FileMetadataFactory,
    MetadataPatcher,
    MimeTypes,
    DateTime,
    MetadataService,
    AlbumArtworkGetter,
    LastfmApi,
    EmbeddedAlbumArtworkGetter,
    ExternalArtworkPathGetter,
    ExternalAlbumArtworkGetter,
    OnlineAlbumArtworkGetter,
    CachedAlbumArtworkGetter,
    ImageProcessor,
  ],
  exports: [FileMetadataFactory, MetadataPatcher, MimeTypes, DateTime, MetadataService],
})
export class MetadataModule {}
