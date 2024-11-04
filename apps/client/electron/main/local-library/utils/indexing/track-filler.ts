import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { Track } from '../../track/track.entity'
import { DateTime } from '../date-time'
import { IFileMetadata } from '../metadata/i-file-metadata'
import { MimeTypes } from '../metadata/mime-types'
import { FileAccess } from '../io/file-access'
import { FileMetadataFactory } from '../metadata/file-metadata-factory'
import { AlbumKeyGenerator } from './album-key-generator'
import { TrackFieldCreator } from './track-field-creator'

@Injectable()
export class TrackFiller {
  constructor(
    private fileMetadataFactory: FileMetadataFactory,
    private trackFieldCreator: TrackFieldCreator,
    private albumKeyGenerator: AlbumKeyGenerator,
    private fileAccess: FileAccess,
    private mimeTypes: MimeTypes,
    private dateTime: DateTime,
    // private logger: Logger,
  ) {}

  public async addFileMetadataToTrackAsync(track: Track): Promise<Track> {
    try {
      const fileMetadata: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path)
      const dateNowTicks: number = this.dateTime.convertDateToTicks(new Date())

      track.artists = this.trackFieldCreator.createMultiTextField(fileMetadata.artists)
      track.genres = this.trackFieldCreator.createMultiTextField(fileMetadata.genres)
      track.albumTitle = this.trackFieldCreator.createTextField(fileMetadata.album)
      track.albumArtists = this.trackFieldCreator.createMultiTextField(fileMetadata.albumArtists)
      track.albumKey = this.albumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists)
      track.fileName = this.fileAccess.getFileName(track.path)
      track.mimeType = this.getMimeType(track.path)
      track.fileSize = await this.fileAccess.getFileSizeInBytesAsync(track.path)
      track.bitRate = this.trackFieldCreator.createNumberField(fileMetadata.bitRate)
      track.sampleRate = this.trackFieldCreator.createNumberField(fileMetadata.sampleRate)
      track.trackTitle = this.trackFieldCreator.createTextField(fileMetadata.title)
      track.trackNumber = this.trackFieldCreator.createNumberField(fileMetadata.trackNumber)
      track.trackCount = this.trackFieldCreator.createNumberField(fileMetadata.trackCount)
      track.discNumber = this.trackFieldCreator.createNumberField(fileMetadata.discNumber)
      track.discCount = this.trackFieldCreator.createNumberField(fileMetadata.discCount)
      track.duration = this.trackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds)
      track.year = this.trackFieldCreator.createNumberField(fileMetadata.year)
      track.hasLyrics = this.getHasLyrics(fileMetadata.lyrics)
      track.dateAdded = dateNowTicks
      track.dateFileCreated = await this.fileAccess.getDateCreatedInTicksAsync(track.path)
      track.dateLastSynced = dateNowTicks
      track.dateFileModified = await this.fileAccess.getDateModifiedInTicksAsync(track.path)
      track.needsIndexing = 0
      track.needsAlbumArtworkIndexing = 1
      track.rating = this.trackFieldCreator.createNumberField(fileMetadata.rating)
      track.love = 0
      track.indexingSuccess = 1
      track.indexingFailureReason = ''
    }
    catch (e: any) {
      track.indexingSuccess = 0
      track.indexingFailureReason = e.message

      console.error(
                `Error while retrieving tag information for file ${track.path}. Error: ${e}`,
                'TrackFiller',
                'addFileMetadataToTrackAsync',
      )
    }

    return track
  }

  private getMimeType(filePath: string): string {
    return this.mimeTypes.getMimeTypeForFileExtension(this.fileAccess.getFileExtension(filePath))
  }

  private getHasLyrics(lyrics: string): number {
    if (!isEmpty(lyrics))
      return 1

    return 0
  }
}
