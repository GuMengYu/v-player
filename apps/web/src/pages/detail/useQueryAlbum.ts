import { useQuery } from '@tanstack/react-query'
import { getAlbum, getAlbumDynamic } from '@/api/album'
import { getArtistAlbum } from '@/api/artist'
import { Album } from '@/types'

export default function useQueryAlbum(albumId?: number | string) {
  const { data, isLoading } = useQuery(
    ['album', 'detail', albumId],
    async () => {
      const { album, songs } = await getAlbum(+albumId)
      const { isSub } = await getAlbumDynamic(+albumId)
      let relatedAlbum: Album[] = []
      if (album?.artist.id) {
        const { hotAlbums = [] } = await getArtistAlbum(album.artist.id, 6)
        relatedAlbum = hotAlbums.filter(i => i.id !== album.id)
      }
      album.tracks = songs
      album.isSub = isSub
      return {
        album,
        relatedAlbum,
      }
    },
    {
      enabled: !!albumId,
      staleTime: 30 * 60 * 1000,
    },
  )

  return {
    data,
    isLoading,
  }
}
