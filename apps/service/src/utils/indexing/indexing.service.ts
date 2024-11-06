import { Injectable } from '@nestjs/common'
import { Observable, Subject, Subscription } from 'rxjs'

// import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository'
// import { Logger } from '../../common/logger'
// import { BaseFolderService } from '../folder/base-folder.service'
// import { AlbumArtworkIndexer } from './album-artwork-indexer'
// import { BaseIndexingService } from './base-indexing.service'
// import { CollectionChecker } from './collection-checker'
import { TrackIndexer } from './track-indexer'
import { AlbumArtworkIndexer } from './album-artwork-indexer'

@Injectable()
export class IndexingService {
  private indexingFinished: Subject<void> = new Subject()
  private subscription: Subscription = new Subscription()
  private foldersHaveChanged: boolean = false

  constructor(
    // private collectionChecker: CollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    // private trackRepository: BaseTrackRepository,
    // private folderService: BaseFolderService,
    // private logger: Logger,
  ) {
    // this.subscription.add(
    //   this.folderService.foldersChanged$.subscribe(() => {
    //     this.foldersHaveChanged = true
    //   }),
    // )
  }

  public indexingFinished$: Observable<void> = this.indexingFinished.asObservable()

  public isIndexingCollection: boolean = false

  public async indexCollectionAlwaysAsync(): Promise<void> {

    if (this.isIndexingCollection) {
      // this.logger.info('Already indexing.', 'IndexingService', 'indexCollectionAlwaysAsync')
      console.log('Already indexing.', 'IndexingService', 'indexCollectionAlwaysAsync')

      return
    }

    this.isIndexingCollection = true
    this.foldersHaveChanged = false

    // this.logger.info('Indexing collection.', 'IndexingService', 'indexCollectionAlwaysAsync')
    console.log('Indexing collection.', 'IndexingService', 'indexCollectionAlwaysAsync')

    await this.trackIndexer.indexTracksAsync()
    await this.albumArtworkIndexer.indexAlbumArtworkAsync()

    this.isIndexingCollection = false
    this.indexingFinished.next()
  }
}
