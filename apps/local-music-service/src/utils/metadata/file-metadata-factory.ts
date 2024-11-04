import { Injectable } from '@nestjs/common'
import { FileFormats } from '../constant/file-formats'
import { FileAccess } from '../io/file-access'
import { IFileMetadata } from './i-file-metadata'
import { MusicMetadataFileMetadata } from './music-metadata-file-meta-data'
import { TagLibFileMetadata } from './tag-lib-file-metadata'

@Injectable()
export class FileMetadataFactory {
  public constructor(private fileAccess: FileAccess) {}

  public async createAsync(path: string): Promise<IFileMetadata> {
    let fileMetadata: IFileMetadata

    const fileExtension = this.fileAccess.getFileExtension(path).toLowerCase()

    switch (fileExtension) {
      case FileFormats.mp3:
        fileMetadata = new TagLibFileMetadata(path)
        break
      case FileFormats.flac:
        fileMetadata = new TagLibFileMetadata(path)
        break
      case FileFormats.ogg:
        fileMetadata = new TagLibFileMetadata(path)
        break
      case FileFormats.m4a:
        fileMetadata = new MusicMetadataFileMetadata(path)
        break
      case FileFormats.opus:
        fileMetadata = new MusicMetadataFileMetadata(path)
        break
      case FileFormats.wav:
        fileMetadata = new TagLibFileMetadata(path)
        break
      default:
        fileMetadata = new TagLibFileMetadata(path)
        break
    }

    await fileMetadata.loadAsync()

    return fileMetadata
  }
}
