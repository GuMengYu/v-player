import { Module } from '@nestjs/common'
import { IndexingModule } from '../utils/indexing/indexing.module'
import { IoModule } from '../utils/io/io.module'
import { BaseController } from './base.controller'

@Module({
  imports: [IndexingModule, IoModule],
  controllers: [BaseController],
})
export class BaseModule {
}
