import { Module } from '@nestjs/common'
import { TrackModule } from '../../track/track.module'
import { IoModule } from '../io/io.module'
import { FolderTrackModule } from '../../folderTrack/folder-track.module'
import { MetadataModule } from '../metadata/metadata.module'
import { RemovedTrackModule } from '../../removedTrack/removedTrack.module'
import { FolderModule } from '../../folder/folder.module'
import { AlbumArtworkModule } from '../../albumArtwork/albumArtwork.module'
import { AlbumArtworkCacheModule } from '../album-artwork-cache/album-artwork-cache.module'
import { LastfmApi } from '../lastfm/lastfm-api'
import { IndexingService } from './indexing.service'
import { TrackIndexer } from './track-indexer'
import { TrackRemover } from './track-remover'
import { TrackUpdater } from './track-updater'
import { TrackVerifier } from './track-verifier'
import { TrackFiller } from './track-filler'
import { TrackFieldCreator } from './track-field-creator'
import { AlbumKeyGenerator } from './album-key-generator'
import { DirectoryWalker } from './directory-walker'
import { IndexablePathFetcher } from './indexable-path-fetcher'
import { TrackAdder } from './track-adder'
import { AlbumArtworkIndexer } from './album-artwork-indexer'
import { AlbumArtworkAdder } from './album-artwork-adder'
import { AlbumArtworkGetter } from './album-artwork-getter'
import { AlbumArtworkRemover } from './album-artwork-remover'
import { EmbeddedAlbumArtworkGetter } from './embedded-album-artwork-getter'
import { ExternalArtworkPathGetter } from './external-artwork-path-getter'
import { ExternalAlbumArtworkGetter } from './external-album-artwork-getter'
import { OnlineAlbumArtworkGetter } from './online-album-artwork-getter'

@Module({
  imports: [
    TrackModule,
    FolderModule,
    FolderTrackModule,
    RemovedTrackModule,
    AlbumArtworkModule,
    AlbumArtworkCacheModule,
    IoModule,
    MetadataModule,
  ],
  providers: [
    IndexingService,
    AlbumArtworkIndexer,
    AlbumArtworkAdder,
    AlbumArtworkGetter,
    AlbumArtworkRemover,
    TrackIndexer,
    TrackRemover,
    TrackUpdater,
    TrackAdder,
    TrackVerifier,
    TrackFiller,
    TrackFieldCreator,
    DirectoryWalker,
    IndexablePathFetcher,
    AlbumKeyGenerator,
    LastfmApi,
    EmbeddedAlbumArtworkGetter,
    ExternalArtworkPathGetter,
    ExternalAlbumArtworkGetter,
    OnlineAlbumArtworkGetter,
  ],
  exports: [IndexingService],
})
export class IndexingModule {
}
