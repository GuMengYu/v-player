import { useQuery } from '@tanstack/react-query'
import { mvDetail, simiMv } from '@/api/mv'

export default function useQueryVideo(id?: number | string) {
  const { data, isLoading } = useQuery(
    ['video', 'detail', id],
    async () => {
      const { data: video, subed } = await mvDetail(+id)
      const { mvs: relatedVideo = [] } = await simiMv(video.id)
      video.subed = subed
      return {
        video,
        relatedVideo,
      }
    },
    {
      enabled: !!id,
    },
  )

  return {
    data,
    isLoading,
  }
}
