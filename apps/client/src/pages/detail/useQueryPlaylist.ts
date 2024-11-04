import { useQuery } from '@tanstack/react-query'
import { getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList } from '@/api/playlist'

/**
 *
 * @param playlistId
 * @param createdList 用户自建歌单
 */
export function useQueryPlaylist(playlistId?: number | string, createdList?: boolean) {
  const { data, isLoading } = useQuery(
    ['playlist', 'detail', 'info', playlistId],
    async () => {
      const { playlist } = await getPlaylistDetail(Number(playlistId), createdList)
      // 自建歌单 有tracks完整列表
      if (!createdList) {
        const { songs } = await getPlaylistTrackAll(+playlistId, 1000, undefined)
        playlist.tracks = songs
      }
      return {
        playlist,
      }
    },
    {
      enabled: !!playlistId,
      staleTime: createdList ? 0 : 5 * 60 * 1000, // 歌单信息缓存5分钟
    },
  )
  return {
    data,
    isLoading,
  }
}
export function useQueryPlaylistTracks(playlistId: number | string) {
  const { data, isLoading } = useQuery(['playlist', 'detail', 'tracks', playlistId], () => {
    return getPlaylistTrackAll(+playlistId, 1000, undefined)
  }, {
    staleTime: 5 * 60 * 1000, //
    enabled: !!playlistId,
  })
  return {
    tracks: data?.songs ?? [],
    isLoading,
  }
}

export function useQueryRelatedPlaylist(playlistId?: number | string, fresh?: boolean) {
  const { data, isLoading } = useQuery(
    ['playlist', 'detail', 'related', playlistId],
    async () => {
      const { playlists } = await getRelatedPlayList(Number(playlistId))
      return {
        relatedPlaylists: playlists,
      }
    },
    {
      enabled: !!playlistId,
      staleTime: 5 * 60 * 1000, // 缓存5分钟
    },
  )
  return {
    data,
    isLoading,
  }
}
