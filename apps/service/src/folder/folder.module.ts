import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { FolderService } from './folder.service'
import { FolderController } from './folder.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Folder])],
  providers: [FolderService],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {
}
