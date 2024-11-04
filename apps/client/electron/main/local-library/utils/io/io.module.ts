import { Module } from '@nestjs/common'
import { Desktop } from '../desktop'
import { DateTime } from '../date-time'
import { FileAccess } from './file-access'

@Module({
  imports: [],
  providers: [FileAccess, Desktop, DateTime],
  exports: [FileAccess, Desktop],
})
export class IoModule {}
