import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'

export function useQueryLikedTracks() {
  const { data, isLoading, refetch } = useQuery(['local', 'liked', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await ipcRenderer.invoke('track/liked-tracks')
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
