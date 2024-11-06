import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class PlaylistTrack {
  @PrimaryGeneratedColumn()
  playlistTrackId: number

  @Column()
  playlistId: number

  @Column()
  trackId: number
}
