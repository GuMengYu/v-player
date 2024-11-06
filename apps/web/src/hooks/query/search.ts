import { useQuery } from '@tanstack/react-query'
import { multiMatchSearch, search } from '@/api/music'
import { Album, Artist, MV, Playlist, Track } from '@/types'

const searchTypes = {
  song: { type: 1, limit: 4 },
  album: { type: 10, limit: 5 },
  artist: { type: 100, limit: 5 },
  playlist: { type: 1000, limit: 5 },
  mv: { type: 1004, limit: 3 },
}

export function useSearch(keyword: string) {
  return useQuery(['search', keyword], async () => {
    const requests = Object.entries(searchTypes).map(([, val]) => {
      return search(keyword, {
        type: val.type,
        limit: val.limit,
      })
    })
    const result: {
      bestMatch?: any
      songs?: Track[]
      albums?: Album[]
      artists?: Artist[]
      playlists?: Playlist[]
      mvs?: MV[]
    } = {}
    const [{ result: song }, { result: album }, { result: artist }, { result: playlist }, { result: mv }]
      = await Promise.all(requests)
    const { result: multi } = await multiMatchSearch(keyword)
    const orders = multi.orders.filter(i => ['artist', 'playlist', 'album'].includes(i)) // 排除掉无关内容( new_mlog ?)

    result.bestMatch = orders.map(order => ({
      object: multi[order]?.[0],
      type: order,
    }))
    result.songs = song.songs ?? []
    result.albums = album.albums ?? []
    result.artists = artist.artists ?? []
    result.playlists = playlist.playlists ?? []
    result.mvs = mv.mvs ?? []
    return {
      result,
    }
  }, {
    enabled: !!keyword,
  })
}
