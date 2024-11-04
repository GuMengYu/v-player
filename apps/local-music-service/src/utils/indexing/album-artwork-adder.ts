import { Injectable } from '@nestjs/common'

// import { BaseAlbumArtworkRepository } from '../../common/data/repositories/base-album-artwork-repository'
// import { Logger } from '../../common/logger'
import { FileMetadataFactory } from '../metadata/file-metadata-factory'
import { IFileMetadata } from '../metadata/i-file-metadata'
import { AlbumArtworkCacheId } from '../album-artwork-cache/album-artwork-cache-id'
import { AlbumArtworkCacheService } from '../album-artwork-cache/album-artwork-cache.service'

// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { AlbumData } from '../../album/album.entity'
import { AlbumArtworkService } from '../../albumArtwork/albumArtwork.service'
import { TrackService } from '../../track/track.service'
import { AlbumArtwork } from '../../albumArtwork/albumArtwork.entity'
import { AlbumArtworkGetter } from './album-artwork-getter'

@Injectable()
export class AlbumArtworkAdder {
  constructor(
    private albumArtworkCacheService: AlbumArtworkCacheService,
    private albumArtworkService: AlbumArtworkService,
    private trackService: TrackService,
    private fileMetadataFactory: FileMetadataFactory,
    // private snackbarService: BaseSnackBarService,
    // private logger: Logger,
    private albumArtworkGetter: AlbumArtworkGetter,
  ) {}

  public async addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(): Promise<void> {
    try {
      const albumDataThatNeedsIndexing: AlbumData[] = await this.trackService.getAlbumDataThatNeedsIndexing()

      if (albumDataThatNeedsIndexing.length === 0) {
        console.info(
          'Found no album data that needs indexing',
          'AlbumArtworkAdder',
          'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
        )

        return
      }

      console.info(
                `Found ${albumDataThatNeedsIndexing.length} album data that needs indexing`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
      )

      const numberOfAlbumArtwork: number = await this.albumArtworkService.getNumberOfAlbumArtwork()

      // TODO: remove this when album artwork fetching is async
      // For now, as a workaround, we only show this notification the 1st time indexing runs.
      // if (numberOfAlbumArtwork === 0)
      // this.snackbarService.updatingAlbumArtworkAsync()

      for (const albumData of albumDataThatNeedsIndexing) {
        try {
          await this.addAlbumArtworkAsync(albumData.albumKey)
        }
        catch (e: any) {
          console.error(
                        `Could not add album artwork for albumKey=${albumData.albumKey}. Error: ${e.message}`,
                        'AlbumArtworkAdder',
                        'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
          )
        }
      }
    }
    catch (e: any) {
      console.info(
                `Could not add album artwork for tracks that need album artwork indexing. Error: ${e.message}`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
      )
    }
  }

  private async addAlbumArtworkAsync(albumKey: string): Promise<void> {
    const track = await this.trackService.getLastModifiedTrackForAlbumKeyAsync(albumKey)

    if (!track)
      return

    let fileMetadata: IFileMetadata

    try {
      fileMetadata = await this.fileMetadataFactory.createAsync(track.path)
    }
    catch (e: any) {
      console.info(
                `Could not create file metadata for path='${track.path}'. Error: ${e.message}`,
                'AlbumArtworkAdder',
                'addAlbumArtworkAsync',
      )
    }

    if (!fileMetadata)
      return

    const albumArtwork: Buffer = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetadata, true)

    if (!albumArtwork)
      return

    const albumArtworkCacheId: AlbumArtworkCacheId = await this.albumArtworkCacheService.addArtworkDataToCacheAsync(albumArtwork)

    if (!albumArtworkCacheId)
      return

    //
    await this.trackService.disableNeedsAlbumArtworkIndexingAsync(albumKey)
    const newAlbumArtwork: AlbumArtwork = new AlbumArtwork()
    newAlbumArtwork.artworkId = albumArtworkCacheId.id
    newAlbumArtwork.albumKey = albumKey
    await this.albumArtworkService.addAlbumArtwork(newAlbumArtwork)
  }
}
