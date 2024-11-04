import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { ArtistType } from '../artist/artist-type'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
  ) {}

  @IpcHandle('all-albums')
  async getAlbums() {
    return this.albumService.getAllAlbums()
  }

  @IpcHandle('artist-albums')
  async getAlbumsForArtists(args: [artists: string[], artistType: ArtistType ]) {
    console.log(args[0], args[1])
    return this.albumService.getAlbumsForArtists(args[0], args[1])
  }
}
