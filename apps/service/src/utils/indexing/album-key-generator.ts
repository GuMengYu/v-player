import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { DataDelimiter } from '../data-delimiter'

@Injectable()
export class AlbumKeyGenerator {
  constructor() {}

  public generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
    if (!isEmpty(albumTitle)) {
      const albumKeyItems: string[] = []
      albumKeyItems.push(albumTitle)

      if (albumArtists && albumArtists.length > 0)
        albumKeyItems.push(...albumArtists)

      return DataDelimiter.toDelimitedString(albumKeyItems)
    }

    return ''
  }
}
