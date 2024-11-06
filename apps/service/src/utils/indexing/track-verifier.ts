import { Injectable } from '@nestjs/common'
import { Track } from '../../track/track.entity'
import { FileAccess } from '../io/file-access'

@Injectable()
export class TrackVerifier {
  constructor(private fileAccess: FileAccess) {}

  public async isTrackOutOfDateAsync(track: Track): Promise<boolean> {
    if (track.fileSize === 0)
      return true

    if (track.fileSize !== (await this.fileAccess.getFileSizeInBytesAsync(track.path)))
      return true

    return track.dateFileModified !== (await this.fileAccess.getDateModifiedInTicksAsync(track.path))
  }

  public doesTrackNeedIndexing(track: Track): boolean {
    if (track.needsIndexing === undefined)
      return true

    if (Number.isNaN(track.needsIndexing))
      return true

    return track.needsIndexing === 1
  }
}
