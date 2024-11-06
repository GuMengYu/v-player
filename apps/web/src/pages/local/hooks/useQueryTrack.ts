import { useQuery } from '@tanstack/react-query'
import { client as queryClient } from '@/plugins/query'
import { getAllLikedTracks, getAllTracks, getPlaylistTracks } from '../api/local'
import { LocalTrack } from '@shared/types'

export default function useQueryTrack() {
  const { data, isLoading } = useQuery(['local', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await getAllTracks()
    return {
      tracks: data,
      totalDt,
      totalSize,
    }
  })
  return {
    data,
    isLoading,
  }
}

export function useQueryLocalPlaylistTrack(id: number) {
  const { data, isLoading, refetch } = useQuery(['local', 'playlist', 'tracks', id], async () => {
    const { data, totalDt, totalSize } = await getPlaylistTracks(id)
    return {
      tracks: data,
      totalDt,
      totalSize,
    }
  })
  return {
    data,
    isLoading,
    refetch,
  }
}

export async function queryPlaylistTracks(id: number) {
  return await queryClient.fetchQuery({
    queryKey: ['local', 'playlist', 'tracks', id],
    queryFn: async () => {
      const { data } = await getPlaylistTracks(id)
      return data ?? []
    },
  })
}

export async function queryLikedTracks() {
  return await queryClient.fetchQuery<{
    data: LocalTrack[]
  }>({
    queryKey: ['local', 'liked', 'tracks'],
    queryFn: async () => {
      return await getAllLikedTracks()
    },
  })
}
