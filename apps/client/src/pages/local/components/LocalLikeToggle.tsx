import type { AnimationItem } from 'lottie-web'

import { IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useState } from 'react'
import LottieIcon from '@/components/LottieIcon'
import heart from '@/assets/lottie-assets/heart.json'
import { sleep } from '@/util/fn'
import { useLocalStore } from '@/store/local'

export default function LocalLikeToggle({
  id,
  size,
  color,
}: {
  id: number
  size?: 'small' | 'medium' | 'large'
  color?: string
}) {
  const { likes, likeSong } = useLocalStore()

  const liked = !!likes.includes(id)

  const heartOptions = {
    animationData: heart,
    loop: false,
    autoplay: true,
  }
  const [heartAnim, setHeartAnim] = useState<AnimationItem | null>(null)
  const [showAnim, setShowAnim] = useState(false)

  function handleAnimation(animation: AnimationItem) {
    setHeartAnim(animation)
  }
  async function toggleSong() {
    const _liked = liked
    const success = await likeSong(id!, !_liked)
    if (!_liked && success) {
      setShowAnim(true)
      heartAnim?.goToAndPlay(0, true)
      await sleep(1000)
      setShowAnim(false)
    }
  }
  return (
    <Tooltip title={ liked ? '从本地喜欢的音乐移除' : '收藏到本地喜欢的音乐'} placement='top'>
    <IconButton
      className='no-drag-area'
      onClick={toggleSong}
      sx={{ p: 0, height: size === 'small' ? 28 : 36, width: size === 'small' ? 28 : 36 }}
      color="error"
    >
      {showAnim
        ? (
        <LottieIcon
          option={heartOptions}
          height={size === 'small' ? 28 : 36}
          width={size === 'small' ? 28 : 36}
          animCreated={handleAnimation}
        ></LottieIcon>
          )
        : liked
          ? (
        <FavoriteIcon fontSize='small' />
            )
          : (
        <FavoriteBorderIcon fontSize='small' />
            )}
    </IconButton>
    </Tooltip>
  )
}
