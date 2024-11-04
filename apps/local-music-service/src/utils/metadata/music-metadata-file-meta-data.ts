import * as mm from 'music-metadata'
import { IAudioMetadata } from 'music-metadata'
import { IFileMetadata } from './i-file-metadata'

export class MusicMetadataFileMetadata implements IFileMetadata {
  public constructor(public path: string) {}

  public bitRate: number
  public sampleRate: number
  public durationInMilliseconds: number
  public title: string
  public album: string
  public albumArtists: string[]
  public artists: string[]
  public genres: string[]
  public comment: string
  public grouping: string
  public year: number
  public trackNumber: number
  public trackCount: number
  public discNumber: number
  public discCount: number
  public lyrics: string
  public picture: Buffer
  public rating: number

  public save(): void {
    // Do nothing
  }

  public async loadAsync(): Promise<void> {
    const audioMetadata: IAudioMetadata = await mm.parseFile(this.path)

    if (!audioMetadata)
      return

    if (!audioMetadata.format)
      return

    if (audioMetadata.format.bitrate && !Number.isNaN(audioMetadata.format.bitrate))
      this.bitRate = audioMetadata.format.bitrate

    if (audioMetadata.format.sampleRate && !Number.isNaN(audioMetadata.format.sampleRate))
      this.sampleRate = audioMetadata.format.sampleRate

    if (audioMetadata.format.duration && !Number.isNaN(audioMetadata.format.duration))
      this.durationInMilliseconds = audioMetadata.format.duration * 1000

    if (!audioMetadata.common)
      return

    if (audioMetadata.common.title)
      this.title = audioMetadata.common.title

    if (audioMetadata.common.album)
      this.album = audioMetadata.common.album

    if (audioMetadata.common.albumartist)
      this.albumArtists = [audioMetadata.common.albumartist]

    if (audioMetadata.common.artists)
      this.artists = audioMetadata.common.artists

    if (audioMetadata.common.genre)
      this.genres = audioMetadata.common.genre

    if (audioMetadata.common.comment && audioMetadata.common.comment.length > 0)
      this.comment = audioMetadata.common.comment[0] as any

    if (audioMetadata.common.grouping && audioMetadata.common.grouping.length > 0)
      this.grouping = audioMetadata.common.grouping[0]

    if (audioMetadata.common.year && !Number.isNaN(audioMetadata.common.year))
      this.year = audioMetadata.common.year

    if (audioMetadata.common.track) {
      if (audioMetadata.common.track.no && !Number.isNaN(audioMetadata.common.track.no))
        this.trackNumber = audioMetadata.common.track.no

      if (audioMetadata.common.track.of && !Number.isNaN(audioMetadata.common.track.of))
        this.trackCount = audioMetadata.common.track.of
    }

    if (audioMetadata.common.disk) {
      if (audioMetadata.common.disk.no && !Number.isNaN(audioMetadata.common.disk.no))
        this.discNumber = audioMetadata.common.disk.no

      if (audioMetadata.common.disk.of && !Number.isNaN(audioMetadata.common.disk.of))
        this.discCount = audioMetadata.common.disk.of
    }

    if (audioMetadata.common.rating && audioMetadata.common.rating.length > 0)
      this.rating = audioMetadata.common.rating[0].rating

    if (audioMetadata.common.lyrics && audioMetadata.common.lyrics.length > 0)
      this.lyrics = audioMetadata.common.lyrics[0] as any

    if (audioMetadata.common.picture && audioMetadata.common.picture.length > 0)
      this.picture = audioMetadata.common.picture[0].data as any
  }
}
