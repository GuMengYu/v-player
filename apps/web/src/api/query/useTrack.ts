import { Track, TrackFrom } from '@/types'
import { client } from '@/plugins/query'
import { getSongData } from '@/api/song'
import { fetchLyric } from '@/api/query/useLyric'
import { getProgramData } from '@/api/podcast'
import { getMusicUrl } from '@/api/music'
import { getLocalTrack } from '@/pages/local/api/local'

export function fetchTracks(ids: Track['id'][]) {
  return client.fetchQuery(
    ['track', 'data', ids],
    () => {
      return getSongData(ids)
    },
    {
      retry: 3,
      retryDelay: (retryCount: number) => {
        return retryCount * 500
      },
      staleTime: 10 * 60 * 1000,
    },
  )
}

export function fetchAudioUrl(track: Track) {
  return client.fetchQuery(
    ['track', 'url', track.id],
    () => {
      return getMusicUrl(track)
    },
    {
      retry: 3,
      retryDelay: (retryCount: number) => {
        return retryCount * 500
      },
      staleTime: 10 * 60 * 1000,
    },
  )
}

export async function fetchTrack(id: Track['id'], from: TrackFrom) {

  return client.fetchQuery({
    queryKey: ['track', 'canplay', 'data', id],
    queryFn: async () => {
      let track: Track | null = null
      let lyric = null

      if (from?.type === 'local') {
        const localTrack = await getLocalTrack(id)
        track = localTrack
        return {
          track,
          trackMeta: {
            url: localTrack.url as string,
            br: 0,
            type: '',
            encodeType: '',
            sourceFromUnlockMusic: false,
            sourceFromLocalMusic: true,
          },
        }
      }
      // track from program
      if (from?.type === 'program') {
        const { program } = await getProgramData(id)
        track = program as unknown as Track
      }
      else {
        const [tracks, lyricData] = await Promise.all([fetchTracks([id]), fetchLyric(id)])
        track = tracks?.songs?.[0]
        lyric = lyricData
      }
      const trackMeta = await fetchAudioUrl(track)
      return { track, trackMeta, lyric }
    },
    staleTime: 10 * 60 * 1000, // 缓存 10分钟
  })
}
