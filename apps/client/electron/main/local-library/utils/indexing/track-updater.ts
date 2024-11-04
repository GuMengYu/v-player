import { Injectable } from '@nestjs/common'
import { Track } from '../../track/track.entity'

// import { Logger } from '../../common/logger'
import { Timer } from '../timer'

// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { TrackService } from '../../track/track.service'
import { TrackFiller } from './track-filler'
import { TrackVerifier } from './track-verifier'

@Injectable()
export class TrackUpdater {
  constructor(
    private trackService: TrackService,
    private trackFiller: TrackFiller,
    private trackVerifier: TrackVerifier,
    // private snackBarService: BaseSnackBarService,
    // private logger: Logger,
  ) {}

  public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
    const timer: Timer = new Timer()
    timer.start()

    try {
      const tracks = await this.trackService.getAllTracks()

      let numberOfUpdatedTracks: number = 0

      for (const track of tracks) {
        try {
          if (this.trackVerifier.doesTrackNeedIndexing(track) || (await this.trackVerifier.isTrackOutOfDateAsync(track))) {
            const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track)
            this.trackService.updateTrack(filledTrack)
            numberOfUpdatedTracks++

            if (numberOfUpdatedTracks === 1) {
              // Only trigger the snack bar once
              // await this.snackBarService.updatingTracksAsync()
            }
          }
        }
        catch (e: any) {
          console.error(
                        `A problem occurred while updating track with path='${track.path}'. Error: ${e.message}`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync',
          )
        }
      }

      timer.stop()

      console.log(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(
                `A problem occurred while updating tracks. Error: ${e.message}`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync',
      )
    }
  }
}
