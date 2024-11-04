import { Controller, Post } from '@nestjs/common'

import { ArtistType } from '../artist/artist-type'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
  ) {}

  @Post('all-albums')
  async getAlbums() {
    return this.albumService.getAllAlbums()
  }

  @Post('artist-albums')
  async getAlbumsForArtists(args: [artists: string[], artistType: ArtistType ]) {
    console.log(args[0], args[1])
    return this.albumService.getAlbumsForArtists(args[0], args[1])
  }
}
