import { Injectable } from '@nestjs/common'

// import { Logger } from '../../common/logger'
// import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service'
import { AlbumArtworkService } from '../../albumArtwork/albumArtwork.service'
import { FileAccess } from '../io/file-access'
import { Timer } from '../timer'

@Injectable()
export class AlbumArtworkRemover {
  constructor(
    private albumArtworkService: AlbumArtworkService,
    private fileAccess: FileAccess,
    // private snackBarService: BaseSnackBarService,
    // private logger: Logger,
  ) {}

  public async removeAlbumArtworkThatHasNoTrack() {
    const timer: Timer = new Timer()
    timer.start()

    try {
      const numberOfAlbumArtworkToRemove: number = await this.albumArtworkService.getNumberOfAlbumArtworkThatHasNoTrack()

      if (numberOfAlbumArtworkToRemove === 0) {
        timer.stop()

        console.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkThatHasNoTrack',
        )

        return
      }

      console.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack',
      )

      // this.snackBarService.updatingAlbumArtworkAsync()

      const numberOfRemovedAlbumArtwork = await this.albumArtworkService.deleteAlbumArtworkThatHasNoTrack()

      timer.stop()

      console.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(
                `Could not remove album artwork. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack',
      )
    }
  }

  public async removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
    const timer: Timer = new Timer()
    timer.start()

    try {
      const numberOfAlbumArtworkToRemove: number = await this.albumArtworkService.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()

      if (numberOfAlbumArtworkToRemove === 0) {
        timer.stop()

        console.info(
                    `There is no album artwork to remove. Time required: ${timer.elapsedMilliseconds} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing',
        )

        return
      }

      console.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing',
      )

      // this.snackBarService.updatingAlbumArtworkAsync()

      const numberOfRemovedAlbumArtwork: number = await this.albumArtworkService.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()

      timer.stop()

      console.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.elapsedMilliseconds} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(
                `Could not remove album artwork. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing',
      )
    }
  }

  public async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(): Promise<void> {
    try {
      const allAlbumArtworkInDatabase = await this.albumArtworkService.getAllAlbumArtwork()

      console.info(
                `Found ${allAlbumArtworkInDatabase.length} album artwork in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
      )

      const allArtworkIdsInDatabase: string[] = allAlbumArtworkInDatabase.map(x => x.artworkId)

      console.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
      )

      const coverArtCacheFullPath: string = this.fileAccess.coverArtCacheFullPath()
      const allAlbumArtworkFilePaths: string[] = await this.fileAccess.getFilesInDirectoryAsync(coverArtCacheFullPath)

      console.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
      )

      let numberOfRemovedAlbumArtwork: number = 0

      for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
        const albumArtworkFileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(albumArtworkFilePath)

        if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
          await this.fileAccess.deleteFileIfExistsAsync(albumArtworkFilePath)
          numberOfRemovedAlbumArtwork++
        }

        if (numberOfRemovedAlbumArtwork === 1) {
          // Only trigger the snack bar once
          // await this.snackBarService.updatingAlbumArtworkAsync()
        }
      }
    }
    catch (e: any) {
      console.error(
                `Could not remove album artwork from disk. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
      )
    }
  }
}
