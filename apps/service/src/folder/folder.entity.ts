import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  folderId: number

  @Column()
  path: string
}
