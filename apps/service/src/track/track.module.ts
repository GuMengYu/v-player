import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MetadataModule } from '../utils/metadata/metadata.module'
import { Track } from './track.entity'
import { TrackService } from './track.service'
import { TrackController } from './track.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Track]), forwardRef(() => MetadataModule)],
  providers: [TrackService],
  exports: [TrackService],
  controllers: [TrackController],
})
export class TrackModule {}
