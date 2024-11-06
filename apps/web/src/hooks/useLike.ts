import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { useUserStore } from '@/store/user'

export function useLikeTrack() {
  const { likes, favSong } = useUserStore()
  const { enqueueSnackbar } = useSnackbar()
  const isLiked = (trackId: number) => !!likes.includes(trackId)

  const toggleLike =  useCallback(async (trackId: number, liked: boolean) => {
    const success = await favSong(trackId, !liked)
    if (success)
      enqueueSnackbar(`${liked ? '已从“喜欢的歌曲”移除' : '已添加到“喜欢的歌曲”'}`, { variant: 'success' })
    else
      enqueueSnackbar('出现错误，稍后再试', { variant: 'error' })
  }, [])
  return {
    likes,
    isLiked,
    toggleLike,
  }
}
