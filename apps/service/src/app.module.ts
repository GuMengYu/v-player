import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FolderModule } from './folder/folder.module'
import { AlbumModule } from './album/album.module'
import { ArtistModule } from './artist/artist.module'
import { Folder } from './folder/folder.entity'
import { BaseModule } from './base/base.module'
import { Track } from './track/track.entity'
import { TrackModule } from './track/track.module'
import { FolderTrack } from './folderTrack/folder-track.entity'
import { FolderTrackModule } from './folderTrack/folder-track.module'
import { RemovedTrack } from './removedTrack/removedTrack.entity'
import { RemovedTrackModule } from './removedTrack/removedTrack.module'
import { AlbumArtworkModule } from './albumArtwork/albumArtwork.module'
import { AlbumArtwork } from './albumArtwork/albumArtwork.entity'
import { Playlist } from './playlist/playlist.entity'
import { PlaylistModule } from './playlist/playlist.module'
import { PlaylistTrack } from './playlistTrack/playlist-track.entity'
import { PlaylistTrackModule } from './playlistTrack/playlist-track.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { Desktop } from './utils/desktop'
import { ApplicationPaths } from './utils/io/file-access'

const OrmModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: `${Desktop.getApplicationDataDirectory()}/${ApplicationPaths.dbFolder}/musicYouDB.db`,
  entities: [Folder, Track, FolderTrack, RemovedTrack, AlbumArtwork, Playlist, PlaylistTrack],
  synchronize: true,
})

const SSModule = ServeStaticModule.forRoot({
  rootPath:`${Desktop.getApplicationDataDirectory()}/${ApplicationPaths.cacheFolder}/${ApplicationPaths.coverArtCacheFolder}`,  // 替换为封面图像的实际文件夹路径
  serveRoot: '/coverArt',         // 设置该路径可通过 /coverArt 访问
})

@Module({
  imports: [
    SSModule,
    OrmModule,
    TrackModule,
    FolderModule,
    AlbumModule,
    ArtistModule,
    BaseModule,
    FolderTrackModule,
    RemovedTrackModule,
    AlbumArtworkModule,
    PlaylistModule,
    PlaylistTrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
