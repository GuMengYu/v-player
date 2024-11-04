import { Injectable } from '@nestjs/common'
import { FolderTrack } from '../../folderTrack/folder-track.entity'
import { Track } from '../../track/track.entity'

// import { BaseRemovedTrackRepository } from '../../common/data/repositories/base-removed-track-repository'
// import { BaseSettings } from '../../common/settings/base-settings'
import { TrackService } from '../../track/track.service'
import { FolderTrackService } from '../../folderTrack/folder-track.service'
import { Timer } from '../timer'
import { RemovedTrackService } from '../../removedTrack/removedTrack.service'
import { getWin } from '../../../index'
import { IndexablePath } from './indexable-path'
import { IndexablePathFetcher } from './indexable-path-fetcher'
import { TrackFiller } from './track-filler'

@Injectable()
export class TrackAdder {
  constructor(
    private trackService: TrackService,
    private folderTrackService: FolderTrackService,
    private removedTrackService: RemovedTrackService,
    private indexablePathFetcher: IndexablePathFetcher,
    private trackFiller: TrackFiller,
    // private settings: BaseSettings,
    // private logger: Logger,
    // private snackBarService: BaseSnackBarService,
  ) {}

  public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
    const timer: Timer = new Timer()
    timer.start()
    const win = getWin()

    try {
      const indexablePaths: IndexablePath[] = await this.getIndexablePathsAsync(false)

      let numberOfAddedTracks: number = 0

      for (const indexablePath of indexablePaths) {
        try {
          const newTrack: Track = new Track()
          newTrack.path = indexablePath.path
          await this.trackFiller.addFileMetadataToTrackAsync(newTrack)

          await this.trackService.addTrack(newTrack)
          const addedTrack: Track = await this.trackService.getTrackByPath(newTrack.path)
          const folderTrack = new FolderTrack()
          folderTrack.folderId = indexablePath.folderId
          folderTrack.trackId = addedTrack.trackId

          await this.folderTrackService.addFolderTrack(folderTrack)

          numberOfAddedTracks++

          const percentageOfAddedTracks: number = Math.round((numberOfAddedTracks / indexablePaths.length) * 100)
          const { webContents } = win
          webContents.send('snackbar-add-tracks', numberOfAddedTracks, percentageOfAddedTracks)
          // await this.snackBarService.addedTracksAsync(numberOfAddedTracks, percentageOfAddedTracks)
        }
        catch (e: any) {
          console.error(
                        `A problem occurred while adding track with path='${indexablePath.path}'. Error: ${e.message}`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync',
          )
        }
      }

      timer.stop()

      console.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync',
      )
    }
    catch (e: any) {
      timer.stop()

      console.error(
                `A problem occurred while adding tracks. Error: ${e.message}`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync',
      )
    }
  }

  private async getIndexablePathsAsync(skipRemovedFiles: boolean): Promise<IndexablePath[]> {
    const indexablePaths: IndexablePath[] = []

    const allIndexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync()
    const tracks = await this.trackService.getAllTracks()
    const trackPaths = tracks.map(x => x.path)
    const removedTracks = await this.removedTrackService.getRemovedTracks()
    const removedTrackPaths = removedTracks.map(x => x.path)

    for (const indexablePath of allIndexablePaths) {
      const isTrackInDatabase: boolean = trackPaths.includes(indexablePath.path)
      const isTrackThatWasPreviouslyRemoved: boolean = removedTrackPaths.includes(indexablePath.path)
      const allowReAddingRemovedTracks: boolean = !skipRemovedFiles
      const isTrackThatWasPreviouslyRemovedAndCanBeReAdded: boolean = isTrackThatWasPreviouslyRemoved && allowReAddingRemovedTracks

      if (!isTrackInDatabase) {
        if (!isTrackThatWasPreviouslyRemoved || isTrackThatWasPreviouslyRemovedAndCanBeReAdded)
          indexablePaths.push(indexablePath)
      }
    }

    return indexablePaths
  }
}
