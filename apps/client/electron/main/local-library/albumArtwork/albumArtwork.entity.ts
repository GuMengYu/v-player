import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class AlbumArtwork {
  @PrimaryGeneratedColumn()
  albumArtworkId: number

  @Column()
  albumKey: string

  @Column()
  artworkId: string
}
