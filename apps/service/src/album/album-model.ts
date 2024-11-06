import { isEmpty } from 'lodash'
import { DataDelimiter } from '../utils/data-delimiter'
import { FileAccess } from '../utils/io/file-access'
import { Constants } from '../utils/constant/constants'
import { AlbumData } from './album.entity'

export class AlbumModel {
  constructor(private albumData: AlbumData, private fileAccess: FileAccess) {}

  public isSelected: boolean = false
  public showYear: boolean = false
  public yearHeader: string = ''

  public get artworkPath(): string {
    if (isEmpty(this.albumData.artworkId))
      return Constants.emptyImage

    return this.fileAccess.coverArtHttpPath(this.albumData.artworkId)
  }

  public get albumArtist(): string {
    const albumArtists = DataDelimiter.fromDelimitedString(this.albumData.albumArtists)

    if (albumArtists && albumArtists.length > 0)
      return albumArtists[0]

    const trackArtists = DataDelimiter.fromDelimitedString(this.albumData.artists)

    if (trackArtists && trackArtists.length > 0)
      return trackArtists[0]

    return 'unknown-artist'
  }

  public get albumTitle(): string {
    if (isEmpty(this.albumData.albumTitle))
      return 'Unknown Album'

    return this.albumData.albumTitle
  }

  public get year(): number {
    return this.albumData.year
  }

  public get albumKey(): string {
    return this.albumData.albumKey
  }

  public get dateAddedInTicks(): number {
    return this.albumData.dateAdded
  }

  public get dateFileCreatedInTicks(): number {
    return this.albumData.dateFileCreated
  }

  public get dateLastPlayedInTicks(): number {
    return this.albumData.dateLastPlayed
  }
}
