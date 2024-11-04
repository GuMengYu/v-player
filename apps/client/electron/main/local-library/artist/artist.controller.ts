import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { TrackService } from '../track/track.service'
import { ArtistService } from './artist.service'
import { ArtistType } from './artist-type'

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,

  ) {}

  @IpcHandle('all-artists')
  async allArtists() {
    return this.artistService.getArtists(ArtistType.allArtists)
  }
}
