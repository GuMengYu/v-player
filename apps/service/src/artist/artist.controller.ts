import { Controller, Get } from '@nestjs/common'

import { ArtistService } from './artist.service'
import { ArtistType } from './artist-type'

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
  ) {}

  @Get('all-artists')
  async allArtists() {
    return this.artistService.getArtists(ArtistType.allArtists)
  }
}
