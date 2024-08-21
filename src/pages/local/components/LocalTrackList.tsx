import { useCallback, useMemo, useState } from 'react'
import { Box, Divider, IconButton, Typography } from '@mui/material'
import { css, cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { AnimatePresence, motion } from 'framer-motion'
import { LocalTrack } from '@shared/types'
import { useTranslation } from 'react-i18next'
import { alpha, useTheme } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import { formatDuring, formatFrequency } from '@/util/fn'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useLocalStore } from '@/store/local'
import { usePlayerStore } from '@/store/player'
import { addTrackToPlaylist, removeTrackFromPlaylist } from '@/pages/local/api/playlist'

function Track({ track, index, playlistId }: {
  track: LocalTrack
  index: number
  playlistId?: number
}) {
  const [isHovering, setIsHovering] = useState(false)
  const { addToQueueAndPlay } = useAddToPlayQueue()
  const { playlist } = useLocalStore()
  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslation()
  const { track: current } = usePlayerStore()
  const theme = useTheme()

  const isCurrent = useMemo(() => {
    return current?.id === track.id
  }, [current, track])

  const handlePlay = useCallback(()=> {
    addToQueueAndPlay(track as any, { id: 0, type: 'local', name: '本地音乐' })
  }, [track])

  const addToPlaylist = useCallback(async (playlist: any) => {
    await addTrackToPlaylist(track.id, playlist.id)
    enqueueSnackbar('已添加到播放列表', { variant: 'info' })

  }, [track])

  const removeFromPlaylist = useCallback(async (trackId: any) => {
    await removeTrackFromPlaylist(track.id, playlistId)
  }, [track, playlistId])

  const playNext = useCallback((track: any) => {

  }, [track])

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`common.next_play`,
        onClick: () => {
          playNext(track)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: t`common.add_playlist`,
        items: playlist.map((list: any) => {
          return {
            type: 'item',
            label: list.name,
            onClick: async () => {
              addToPlaylist(list)
            },
          }
        }),
      },
      ...(playlistId
        ? [{
            type: 'item' as any,
            label: t`common.remove_from_playlist`,
            onClick: () => {
              removeFromPlaylist(track.id)
            },
          }]
        : []),
    ], {
      useCursorPosition: true,
    })
  }, [track])
  return <Box
    sx={{
      'transition': 'background-color .35s ease',
      'color': isCurrent ? theme.palette.primary.main : null,
      '&:hover': {
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.2),
      },
    }}
    onContextMenu={handleContextMenu}
    className={
      cx('grid grid-cols-3 gap-4 px-2 h-16 items-center cursor-pointer mb-1 rounded-lg', css`grid-template-columns: 3fr 2fr 1fr [last] 126px;`)
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}>
    <div className='flex gap-2'>
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden flex justify-center items-center'>
          {/* <Image src={track}/> */}
          {!isHovering && <Typography>
            {String(index + 1).padStart(2, '0')}
          </Typography>}
        </div>
        <AnimatePresence>
          {
            isHovering && <motion.div className='absolute top-0 h-12 w-12 flex justify-center items-center'
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateX(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(10px)' }}
              transition={{
                duration: 0.25,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <IconButton onClick={handlePlay}><PlayIcon color='primary'/></IconButton>
            </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className='flex flex-col justify-center'>
        <Typography className='line-clamp-1' variant='body1'>{track.name}</Typography>
        {/* <Typography className='line-clamp-1' variant='caption'>{ track.ar?.map(i => i.name).join(',') }</Typography> */}
      </div>
    </div>

    <Typography className='line-clamp-1' variant='body2'>{ track.al.name }</Typography>
    <Typography className='line-clamp-1' variant='body2'>{ formatFrequency(track.sample) }</Typography>
    <div className='flex justify-between items-center'>
      <div className='h-9 w-9'>
        {
          isHovering && <motion.div
            initial={{
              opacity: 0, transform: 'translateY(12px)',
            }}
            animate={{
              opacity: 1, transform: 'translateY(0px)',
            }}
            transition={{
              duration: 0.25,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <IconButton><FavoriteBorderIcon fontSize='small'/></IconButton>

          </motion.div>
        }

      </div>
      <Typography variant='body2'>{formatDuring(track.dt)}</Typography>
      <div className='h-9 w-9'>
        {
          isHovering && <motion.div
            initial={{
              opacity: 0, transform: 'translateY(12px)',
            }}
            animate={{
              opacity: 1, transform: 'translateY(0px)',
            }}
            transition={{
              duration: 0.25,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <IconButton onClick={handleContextMenu}><MoreHorizIcon fontSize='small'/></IconButton>

          </motion.div>
        }

      </div>

    </div>
  </Box>
}

export default function LocalTrackList({ tracks, className }: {
  tracks: LocalTrack[]
  className?: string
}) {
  return <div className={className}>
    <div>
      <div
       className={
         cx('grid gap-4 px-1 items-center', css`grid-template-columns: 3fr 2fr 1fr [last] 126px;`)
       }
      >
        <div className='flex items-center gap-2'>
          <div className='w-12 text-center'>
            <Typography variant='caption'>#</Typography>
          </div>
          <Typography variant='caption'>标题</Typography>
        </div>
        <Typography variant='caption'>专辑</Typography>
        <Typography variant='caption'>采样率</Typography>
        <Typography variant='caption' className='text-center'>时长</Typography>
    </div>
    <Divider className="mx-4 my-2" />
  </div>
    {
      tracks?.length && tracks.map((track, index) => {
        return <Track track={track} key={track.id} index={index} />
      })
    }
  </div>
}
