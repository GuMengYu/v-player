import { Injectable } from '@nestjs/common'

// import { Logger } from '../../common/logger'
// import { Timer } from '../../common/scheduling/timer'
// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { Timer } from '../timer'
import { TrackAdder } from './track-adder'
import { TrackRemover } from './track-remover'

import { TrackUpdater } from './track-updater'

@Injectable()
export class TrackIndexer {
  constructor(
    private trackRemover: TrackRemover,
    private trackUpdater: TrackUpdater,
    private trackAdder: TrackAdder,
    // private logger: Logger,
    // private snackBarService: BaseSnackBarService,
  ) {}

  public async indexTracksAsync(): Promise<void> {
    // this.logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync')

    const timer: Timer = new Timer()
    timer.start()

    // await this.snackBarService.refreshing()

    // Remove tracks
    await this.trackRemover.removeTracksThatDoNoNotBelongToFolders()
    await this.trackRemover.removeTracksThatAreNotFoundOnDiskAsync()
    await this.trackRemover.removeFolderTracksForNonexistentTracks()

    // Update tracks
    await this.trackUpdater.updateTracksThatAreOutOfDateAsync()

    // Add tracks
    await this.trackAdder.addTracksThatAreNotInTheDatabaseAsync()

    timer.stop()

    console.log(
            `+++ FINISHED INDEXING TRACKS (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'TrackIndexer',
            'indexTracksAsync',
    )

    // await this.snackBarService.dismissDelayedAsync()
  }
}
