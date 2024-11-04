import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Playlist {

  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  name: string

  artworkUrl: string
}
