import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'

export function useQueryPlaylist() {
  const { data, isLoading } = useQuery(['local', 'playlist'], async () => {
    return ipcRenderer.invoke('playlist/all-playlist')
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
  }
}
