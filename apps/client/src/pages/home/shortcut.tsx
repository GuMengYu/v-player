import { Box, Card, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import Image from '@/components/Image'
import type { Track } from '@/types'
import { getDailyRecommend, recent } from '@/api/user'
import { getTrackList } from '@/api/music'
import LoadingButton from '@/components/button/LoadingButton'
import { PlayIcon } from '@/components/icons/icons'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { cloudDiskMusicList } from '@/api/cloud'
import useUser from '@/hooks/useUser'
import { useAppStore } from '@/store/app'

export default function ShortCut({
  data,
  decoration,
  type,
}: {
  data: any
  decoration: {
    text?: string
    icon?: ReactNode
    color?: string
  }
  type: 'album' | 'playlist' | 'artist' | 'daily' | 'recent' | 'program' | 'cloud'
}) {
  const { logged } = useUser()
  const { toggleLogin } = useAppStore()
  const [isHovering, setIsHovering] = useState(false)
  const [loading, setLoading] = useState(false)
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const theme = useTheme()
  const navigate = useNavigate()
  async function handlePlay(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    try {
      setLoading(true)
      let info: {
        id?: number
        list: Track[]
      }
      if (type === 'daily') {
        const { data } = await getDailyRecommend()
        info = {
          list: data['dailySongs'],
        }
        replaceQueueAndPlay(info.list, 0, 'daily', '日推')
      }
      else if (type === 'recent') {
        const { data } = await recent()
        info = {
          list: data.list.map(i => i['data']),
        }
        replaceQueueAndPlay(info.list, 0, 'recent', '最近播放')
      }
      else if (type === 'cloud') {
        const { data } = await cloudDiskMusicList()
        info = {
          list: data.map(i => i.simpleSong),
        }
        replaceQueueAndPlay(info.list, 0, 'cloud', '云盘')
      }
      else {
        const _data = await getTrackList(type, data.id as number)
        info = {
          id: _data.id,
          list: _data.tracks,
        }
        replaceQueueAndPlay(info.list, info.id!, type, data.name!)
      }
    }
    catch (e) {
      console.debug(e)
    }
    finally {
      setLoading(false)
    }
  }
  function handleJump() {
    if (!logged) {
      toggleLogin(true)
      return
    }
    if (['album', 'playlist', 'daily', 'cloud'].includes(type)) {
      const to = ({
        playlist: `/playlist/${data.id}`,
        album: `/album/${data.id}`,
        daily: '/daily',
        cloud: '/cloud',
      })[type as 'album' | 'playlist' | 'daily' | 'cloud']
      navigate(to)
    }
  }
  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        height: 64,
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleJump}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '100%',
          height: 45,
          width: 45,
          bgcolor: decoration.color,
          ml: 1.5,
        }}
      >
        {decoration.icon}
        {decoration.text && <span>{decoration.text}</span>}
      </Box>
      <div className="flex flex-col items-start justify-between px-4 flex-1">
        <Typography
          title={data.title}
          className="line-clamp-1"
          variant="body2"
        >
          {data.title}
        </Typography>
        <Typography
          title={data.subTitle}
          className="line-clamp-1"
          variant="caption"
        >
          {data.subTitle}
        </Typography>
      </div>
      <Box
        sx={{
          height: 64,
          width: 64,
          position: 'relative',
        }}
      >
        <Image sizes="" src={data.picUrl} className="absolute" />
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="flex justify-center items-center top-0 w-full h-full absolute"
              initial={{
                opacity: 0,
                transform: 'translateX(30px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateX(0px)',
              }}
              exit={{
                opacity: 0,
                transform: 'translateX(30px)',
              }}
              transition={{
                duration: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <LoadingButton
                loading={loading}
                onClick={handlePlay}
                sx={{
                  'p': 0,
                  'bgcolor': `${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.7),
                  },
                }}
              >
                <PlayIcon sx={{ fontSize: '2.5rem' }} color={'onPrimary' as 'primary'} />
              </LoadingButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Card>
  )
}
