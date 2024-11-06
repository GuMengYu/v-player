import { useQuery } from '@tanstack/react-query'
import { getAllLikedTracks } from '../api/local'

export function useQueryLikedTracks() {
  const { data, isLoading, refetch } = useQuery(['local', 'liked', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await getAllLikedTracks()
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
