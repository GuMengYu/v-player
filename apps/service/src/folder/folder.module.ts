import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { FolderService } from './folder.service'
import { FolderController } from './folder.controller'
import { IoModule } from '../utils/io/io.module'

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), IoModule],
  providers: [FolderService],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {
}
