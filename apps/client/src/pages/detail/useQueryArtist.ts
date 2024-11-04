import { useQuery } from '@tanstack/react-query'
import { getArtist, getArtistAlbum, getArtistDetail, getArtistMv, getSimiArtist } from '@/api/artist'

export default function useQueryArtist(id?: number | string) {
  const { data, isLoading } = useQuery(
    ['artist', 'detail', id],
    async () => {
      const [artist, hotSong, album, mv, simiArtist] = await Promise.all([
        getArtistDetail(+id),
        getArtist(+id),
        getArtistAlbum(+id),
        getArtistMv(+id),
        getSimiArtist(+id),
      ])
      return {
        // 不知怎滴 来源在获取热门歌曲接口里面
        artist: { ...artist?.data['artist'], ...hotSong['artist'], followed: hotSong['artist']?.['followed'] },
        hotSongs: hotSong['hotSongs'].slice(0, 20),
        hotAlbums: album['hotAlbums'],
        mvs: mv.mvs,
        simiArtists: simiArtist['artists'].slice(0, 6),
      }
    },
    {
      enabled: !!id,
      staleTime: 30 * 60 * 1000, // 缓存0.5小时
    },
  )

  return {
    data,
    isLoading,
  }
}
