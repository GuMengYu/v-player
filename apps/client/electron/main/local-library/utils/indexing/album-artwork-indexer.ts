import { Injectable } from '@nestjs/common'

// import { Logger } from '../../common/logger'
// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { Timer } from '../timer'
import { AlbumArtworkAdder } from './album-artwork-adder'
import { AlbumArtworkRemover } from './album-artwork-remover'

@Injectable()
export class AlbumArtworkIndexer {
  constructor(
    private albumArtworkRemover: AlbumArtworkRemover,
    private albumArtworkAdder: AlbumArtworkAdder,
    // private snackBarService: BaseSnackBarService,
    // private logger: Logger,
  ) {}

  public async indexAlbumArtworkAsync(): Promise<void> {
    console.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync')

    const timer: Timer = new Timer()
    timer.start()

    await this.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack()
    await this.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()
    await this.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync()
    await this.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync()

    timer.stop()

    console.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync',
    )

    // await this.snackBarService.dismissDelayedAsync()
  }
}
