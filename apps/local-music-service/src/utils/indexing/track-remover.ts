import { Injectable } from '@nestjs/common'

// import { BaseFolderTrackRepository } from '../../common/data/repositories/base-folder-track-repository'
// import { BaseFileAccess } from '../../common/io/base-file-access'
// import { Logger } from '../../common/logger'
// import { Timer } from '../../common/scheduling/timer'
// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { FileAccess } from '../io/file-access'
import { Timer } from '../timer'
import { TrackService } from '../../track/track.service'
import { FolderTrackService } from '../../folderTrack/folder-track.service'

@Injectable()
export class TrackRemover {
  constructor(
    private trackService: TrackService,
    private folderTrackService: FolderTrackService,

    // private snackBarService: BaseSnackBarService,
    private fileAccess: FileAccess,
    // private logger: Logger,
  ) {}

  public async removeTracksThatDoNoNotBelongToFolders() {
    const timer: Timer = new Timer()
    timer.start()
    try {
      const numberOfTracksToRemove = await this.trackService.getNumberOfTracksThatDoNotBelongFolders()

      if (numberOfTracksToRemove === 0) {
        console.log(
                    `There are no tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeTracksThatDoNoNotBelongToFolders',
        )

        return
      }

      console.log(`Found ${numberOfTracksToRemove} tracks to remove.`, 'TrackRemover', 'removeTracksThatDoNoNotBelongToFolders')

      // this.snackBarService.removingTracksAsync()

      const removedTracksNumber = await this.trackService.deleteTracksThatDoNotBelongFolders()

      timer.stop()

      console.log(
                `Removed ${removedTracksNumber} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFolders',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(`Could not remove tracks. Error: ${e.message}`, 'TrackRemover', 'removeTracksThatDoNoNotBelongToFolders')
    }
  }

  public async removeTracksThatAreNotFoundOnDiskAsync(): Promise<void> {
    const timer: Timer = new Timer()
    timer.start()

    try {
      const tracks = await this.trackService.getAllTracks()

      console.log(`Found ${tracks.length} tracks.`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDisk')

      let numberOfRemovedTracks: number = 0

      for (const track of tracks) {
        if (!this.fileAccess.pathExists(track.path)) {
          await this.trackService.deleteTrack(track.trackId)
          numberOfRemovedTracks++
        }

        if (numberOfRemovedTracks === 1) {
          // Only trigger the snack bar once
          // await this.snackBarService.removingTracksAsync()
        }
      }

      timer.stop()

      console.log(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDisk',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(`Could not remove tracks. Error: ${e.message}`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDisk')
    }
  }

  public async removeFolderTracksForNonexistentTracks() {
    const timer: Timer = new Timer()
    timer.start()

    try {
      const numberOfFolderTracksToRemove = await this.folderTrackService.getNumberOfFolderTracksForNonexistentTracks()

      if (numberOfFolderTracksToRemove === 0) {
        timer.stop()

        console.log(
                    `There are no folder tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeFolderTracksForNonexistentTracks',
        )

        return
      }

      console.log(
                `Found ${numberOfFolderTracksToRemove} folder tracks to remove.`,
                'TrackRemover',
                'removeFolderTracksForNonexistentTracks',
      )

      // this.snackBarService.removingTracksAsync()

      const numberOfRemovedFolderTracks = await this.folderTrackService.deleteFolderTracksForNonexistentTracks()

      timer.stop()

      console.log(
                `Removed ${numberOfRemovedFolderTracks} folder tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeFolderTracksForNonexistentTracks',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(
                `Could not remove folder tracks. Error: ${e.message}`,
                'TrackRemover',
                'removeFolderTracksForNonexistentTracks',
      )
    }
  }
}
