import { isEmpty } from 'lodash'
import { FileAccess } from '../utils/io/file-access'
import { Constants } from '../utils/constant/constants'
import { Playlist } from './playlist.entity'

export class PlaylistModel {
  constructor(private playlistEntity: Playlist, private fileAccess: FileAccess) {}
  public get name(): string {
    return this.playlistEntity.name
  }

  public get id(): number {
    return this.playlistEntity.id
  }

  public get artworkUrl(): string {
    if (isEmpty(this.playlistEntity.artworkUrl))
      return Constants.emptyImage

    return `file:///${this.fileAccess.coverArtFullPath(this.playlistEntity.artworkUrl)}`
  }

}
