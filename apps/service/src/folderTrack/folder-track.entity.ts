import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class FolderTrack {
  @PrimaryGeneratedColumn()
  folderTrackId: number

  @Column()
  folderId: number

  @Column()
  trackId: number
}
