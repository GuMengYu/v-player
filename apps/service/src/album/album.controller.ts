import { Controller, Post, Get, Body } from '@nestjs/common'

import { ArtistType } from '../artist/artist-type'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
  ) {}

  @Get('all-albums')
  async getAlbums() {
    return this.albumService.getAllAlbums()
  }

  @Post('artist-albums')
  async getAlbumsForArtists(@Body() req) {
    const {artists, artistType} = req
    return this.albumService.getAlbumsForArtists(artists, artistType)
  }
}
