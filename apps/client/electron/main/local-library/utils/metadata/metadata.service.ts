import { Injectable } from '@nestjs/common'
import { Observable, Subject } from 'rxjs'
import { Constants } from '../constant/constants'
import { FileFormats } from '../constant/file-formats'
import { ImageProcessor } from '../image-processor'
import { Strings } from '../strings'
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter'
import { TrackModel } from '../../track/track-model'
import { FileAccess } from '../io/file-access'
import { TrackService } from '../../track/track.service'
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter'
import { FileMetadataFactory } from './file-metadata-factory'
import { IFileMetadata } from './i-file-metadata'

@Injectable()
export class MetadataService {
  private ratingSaved: Subject<TrackModel> = new Subject()
  private loveSaved: Subject<TrackModel> = new Subject()

  constructor(
    private fileMetadataFactory: FileMetadataFactory,
    private trackService: TrackService,
    private albumArtworkGetter: AlbumArtworkGetter,
    private cachedAlbumArtworkGetter: CachedAlbumArtworkGetter,
    private imageProcessor: ImageProcessor,
    private fileAccess: FileAccess,
    // private settings: BaseSettings,
    // private logger: Logger,
  ) {}

  public ratingSaved$: Observable<TrackModel> = this.ratingSaved.asObservable()
  public loveSaved$: Observable<TrackModel> = this.loveSaved.asObservable()

  public async createImageUrlAsync(track: TrackModel): Promise<string> {
    if (!track)
      return Constants.emptyImage

    try {
      const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path)

      if (fileMetaData) {
        const coverArt: Buffer = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetaData, false)

        if (coverArt)
          return this.imageProcessor.convertBufferToImageUrl(coverArt)
      }

      const cachedAlbumArtworkPath: string = await this.cachedAlbumArtworkGetter.getCachedAlbumArtworkPath(track.albumKey)
      console.log(cachedAlbumArtworkPath)

      if (!Strings.isNullOrWhiteSpace(cachedAlbumArtworkPath) && this.fileAccess.pathExists(cachedAlbumArtworkPath))
        return `file:///${cachedAlbumArtworkPath}`

      return Constants.emptyImage
    }
    catch (error: any) {
      console.error(
                `Could not create image URL for track with path=${track.path}. Error: ${error.message}`,
                'MetadataService',
                'createImageUrlAsync',
      )
    }

    return Constants.emptyImage
  }

  public async saveTrackRatingAsync(track: TrackModel): Promise<void> {
    try {
      await this.trackService.updateRating(track.id, track.rating)

      // if (this.settings.saveRatingToAudioFiles && this.fileAccess.getFileExtension(track.path).toLowerCase() === FileFormats.mp3) {
      if (this.fileAccess.getFileExtension(track.path).toLowerCase() === FileFormats.mp3) {
        const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path)
        fileMetaData.rating = track.rating
        fileMetaData.save()
        console.info(`Saved rating to file '${track.path}'`, 'MetadataService', 'saveTrackRating')
      }

      this.ratingSaved.next(track)
    }
    catch (error: any) {
      console.error(`Could not save rating. Error: ${error.message}`, 'MetadataService', 'saveTrackRating')
      throw new Error(error.message)
    }
  }

  public async saveTrackLoveAsync(track: TrackModel): Promise<void> {
    try {
      await this.trackService.updateLove(track.id, track.love)
      this.loveSaved.next(track)
    }
    catch (error: any) {
      console.error(`Could not save love. Error: ${error.message}`, 'MetadataService', 'saveTrackRatingAsync')
      throw new Error(error.message)
    }
  }
}
