import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  trackId: number

  @Column()
  path: string

  @Column({ nullable: true })
  artists?: string

  @Column({ nullable: true })
  genres?: string

  @Column({ nullable: true })
  public albumTitle?: string

  @Column({ nullable: true })
  public albumArtists?: string

  @Column({ nullable: true })
  public albumKey?: string

  @Column({ nullable: true })
  public fileName: string

  @Column({ nullable: true })
  public mimeType?: string

  @Column({ nullable: true })
  public fileSize?: number

  @Column({ nullable: true })
  public bitRate?: number

  @Column({ nullable: true })
  public sampleRate?: number

  @Column({ nullable: true })
  public trackTitle?: string

  @Column({ nullable: true })
  public trackNumber?: number

  @Column({ nullable: true })
  public trackCount?: number

  @Column({ nullable: true })
  public discNumber?: number

  @Column({ nullable: true })
  public discCount?: number

  @Column({ nullable: true })

  public duration?: number

  @Column({ nullable: true })
  public year?: number

  @Column({ nullable: true })
  public hasLyrics?: number

  @Column({ nullable: true })
  public dateAdded?: number

  @Column({ nullable: true })
  public dateFileCreated?: number

  @Column({ nullable: true })
  public dateLastSynced?: number

  @Column({ nullable: true })
  public dateFileModified?: number

  @Column({ nullable: true })
  public needsIndexing?: number

  @Column({ nullable: true })
  public needsAlbumArtworkIndexing?: number

  @Column({ nullable: true })
  public indexingSuccess?: number

  @Column({ nullable: true })
  public indexingFailureReason?: string

  @Column({ nullable: true })
  public rating?: number

  @Column({ nullable: true })
  public love?: number

  @Column({ nullable: true })
  public playCount?: number

  @Column({ nullable: true })
  public skipCount?: number

  @Column({ nullable: true })
  public dateLastPlayed?: number
}
