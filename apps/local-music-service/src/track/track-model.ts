import { DataDelimiter } from '../utils/data-delimiter'
import { DateTime } from '../utils/date-time'
import { Strings } from '../utils/strings'
import { Track } from './track.entity'

export class TrackModel {
  constructor(private track: Track) {}

  public isPlaying: boolean = false
  public isSelected: boolean = false
  public showHeader: boolean = false

  public playlistPath: string = ''

  public get id(): number {
    return this.track.trackId
  }

  public get path(): string {
    return this.track.path
  }

  public get fileName(): string {
    return this.track.fileName
  }

  public get number(): number {
    return this.track.trackNumber
  }

  public get discNumber(): number {
    return this.track.discNumber
  }

  public get discCount(): number {
    return this.track.discCount
  }

  public get year(): number {
    return this.track.year
  }

  public get title(): string {
    if (!Strings.isNullOrWhiteSpace(this.track.trackTitle))
      return this.track.trackTitle

    return this.track.fileName
  }

  public get rawTitle(): string {
    if (Strings.isNullOrWhiteSpace(this.track.trackTitle))
      return ''

    return this.track.trackTitle
  }

  public get sortableTitle(): string {
    return Strings.getSortableString(this.title, false)
  }

  public get artists(): string {
    const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists)

    if (!trackArtists || trackArtists.length === 0)
      return 'unknown-artist'

    const commaSeparatedArtists: string = trackArtists.filter(x => !Strings.isNullOrWhiteSpace(x)).join(', ')

    if (commaSeparatedArtists.length === 0)
      return 'unknown-artist'

    return commaSeparatedArtists
  }

  public get rawArtists(): string[] {
    const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists)

    if (!trackArtists)
      return []

    const nonEmptyArtists: string[] = trackArtists.filter(x => !Strings.isNullOrWhiteSpace(x))

    return nonEmptyArtists
  }

  public get rawFirstArtist(): string {
    if (this.rawArtists.length === 0)
      return ''

    const nonEmptyArtists: string[] = this.rawArtists.filter(x => !Strings.isNullOrWhiteSpace(x))

    return nonEmptyArtists[0]
  }

  public get sortableArtists(): string {
    return Strings.getSortableString(this.artists, false)
  }

  public get genres(): string {
    const trackGenres: string[] = DataDelimiter.fromDelimitedString(this.track.genres)

    if (!trackGenres || trackGenres.length === 0)
      return 'unknown-genre'

    const commaSeparatedGenres: string = trackGenres.filter(x => !Strings.isNullOrWhiteSpace(x)).join(', ')

    if (commaSeparatedGenres.length === 0)
      return 'unknown-genre'

    return commaSeparatedGenres
  }

  public get sortableGenres(): string {
    return Strings.getSortableString(this.genres, false)
  }

  public get albumKey(): string {
    return this.track.albumKey
  }

  public get albumTitle(): string {
    if (Strings.isNullOrWhiteSpace(this.track.albumTitle))
      return 'unknown-album'

    return this.track.albumTitle
  }

  public get rawAlbumTitle(): string {
    if (Strings.isNullOrWhiteSpace(this.track.albumTitle))
      return ''

    return this.track.albumTitle
  }

  public get albumArtists(): string {
    const albumArtists: string[] = DataDelimiter.fromDelimitedString(this.track.albumArtists)

    if (albumArtists && albumArtists.length > 0)
      return albumArtists.join(', ')

    const trackArtists: string[] = DataDelimiter.fromDelimitedString(this.track.artists)

    if (trackArtists && trackArtists.length > 0)
      return trackArtists.join(', ')

    return 'unknown-artist'
  }

  public get sortableAlbumArtists(): string {
    return Strings.getSortableString(this.albumArtists, false)
  }

  public get sortableAlbumTitle(): string {
    return Strings.getSortableString(this.albumTitle, false)
  }

  public get durationInMilliseconds(): number {
    return this.track.duration
  }

  public get fileSizeInBytes(): number {
    return this.track.fileSize
  }

  public get playCount(): number {
    return this.track.playCount
  }

  public get skipCount(): number {
    return this.track.skipCount
  }

  public get rating(): number {
    return this.track.rating
  }

  public set rating(v: number) {
    this.track.rating = v
  }

  public get love(): number {
    return this.track.love
  }

  public set love(v: number) {
    this.track.love = v
  }

  public get dateLastPlayed(): number {
    return this.track.dateLastPlayed
  }

  public get dateAdded(): number {
    return this.track.dateAdded
  }

  public increasePlayCountAndDateLastPlayed(): void {
    const dateTime = new DateTime()
    this.track.playCount++
    this.track.dateLastPlayed = dateTime.convertDateToTicks(new Date())
  }

  public increaseSkipCount(): void {
    this.track.skipCount++
  }

  public get bitRate() {
    return this.track.bitRate
  }

  public get sampleRate() {
    return this.track.sampleRate
  }
}
