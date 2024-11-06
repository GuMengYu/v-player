import { useQuery } from '@tanstack/react-query'
import { getPlayList } from '../api/local'

export function useQueryPlaylist() {
  const { data, isLoading } = useQuery(['local', 'playlist'], async () => {
    return getPlayList()
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
  }
}
