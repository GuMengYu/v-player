import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'
import { client as queryClient } from '@/plugins/query'

export default function useQueryTrack() {
  const { data, isLoading } = useQuery(['local', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await ipcRenderer.invoke('track/all-tracks')
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
    const { data, totalDt, totalSize } = await ipcRenderer.invoke('track/get-playlist-tracks', id)
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
      const { data } = await ipcRenderer.invoke('track/get-playlist-tracks', id)
      return data ?? []
    },
  })
}
