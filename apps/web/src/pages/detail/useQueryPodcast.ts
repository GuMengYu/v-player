import { useQuery } from '@tanstack/react-query'
import { podcastDetail, podcastPrograms } from '@/api/podcast'

export default function useQueryPodcast(podcastId?: number | string) {
  const { data, isLoading } = useQuery(
    ['podcast', 'detail', podcastId],
    async () => {
      const { data: podcast } = await podcastDetail(Number(podcastId))
      const { programs } = await podcastPrograms(Number(podcastId))
      podcast.programs = programs
      return {
        programs,
        podcast,
      }
    },
    {
      enabled: !!podcastId,
      staleTime: 5 * 60 * 1000,
    },
  )

  return {
    data,
    isLoading,
  }
}
