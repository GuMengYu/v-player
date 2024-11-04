import { client } from '@/plugins/query'
import { Track } from '@/types'
import { getLyricNew } from '@/api/song'

export function fetchLyric(id: Track['id']) {
  return client.fetchQuery(
    ['track', 'lyric', id],
    () => {
      return getLyricNew(id)
    },
    {
      retry: 3,
      retryDelay: (retryCount: number) => {
        return retryCount * 500
      },
      staleTime: Number.POSITIVE_INFINITY,
    },
  )
}
