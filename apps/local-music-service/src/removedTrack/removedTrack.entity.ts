import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RemovedTrack {
  @PrimaryGeneratedColumn()
  removeTrackId: number

  @Column()
  trackId: number

  @Column()
  path: string

  @Column()
  safePath: string

  @Column()
  dateRemoved: string
}
