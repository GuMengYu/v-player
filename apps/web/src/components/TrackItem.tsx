import { useMemo, useState } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { css, cx } from '@emotion/css'
import { AnimatePresence, motion } from 'framer-motion'
import { IconButton, Typography } from '@mui/material'
import PlayIcon from '@mui/icons-material/PlayArrow'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AlbumLink from '@/components/links/album'
import { formatDuring, sizeOfImage } from '@/util/fn'
import ArtistLink from '@/components/links/artist'
import Image from '@/components/Image'
import { useLikeTrack } from '@/hooks/useLike'
import { Track } from '@/types'
import { usePlayerStore } from '@/store/player'
import Wave from '@/components/Wave'
import useUser from '@/hooks/useUser'

export default function TrackItem({ track, onPlay, onContextMenu, index }: {
  index?: number
  track: Track
  onPlay: (track: Track) => void
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const { isLiked, toggleLike } = useLikeTrack()
  const { track: current, playing } = usePlayerStore()
  const theme = useTheme()
  const liked = isLiked(track.id)
  const isCurrent = useMemo(() => {
    return current?.id === track.id
  }, [current, track])

  const { logged, isVip } = useUser()

  const available = useMemo(() => {
    if (track.fee === 1) {
      if (logged && isVip) {
        return {
          enable: true,
        }
      }
      else {
        return {
          enable: false,
          text: 'VIP用户可用',
        }
      }
    }
    else if (track.fee === 4) {
      return {
        text: '付费专辑，先购买',
        enable: false,
      }
    }
    else if (track.noCopyrightRcmd) {
      return {
        text: '无版权',
        enable: false,
      }
    }
    else {
      return {
        enable: true,
      }
    }
  }, [isVip, logged])
  return <Box
    sx={{
      'transition': 'background-color .35s ease',
      'color': isCurrent ? theme.palette.primary.main : (available?.enable ? null : alpha(theme.palette.onSurface.main, 0.4)),
      '&:hover': {
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.2),
      },
    }}
    title={available?.enable ? '' : available.text}
    className={
      cx('grid grid-cols-3 gap-4 px-2 h-16 items-center cursor-pointer mb-1 rounded-lg', css`grid-template-columns: 1fr 1fr [last] 140px;`)
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
    onContextMenu={e => onContextMenu && onContextMenu(e, { ...track, liked })}
  >
    <div className='flex gap-2'>
      {
        index !== undefined && <div className='w-6 flex flex-shrink-0 justify-center items-center'>{ isCurrent ? <Wave animate={playing}/> : `${index}`.padStart(2, '0') }</div>
      }
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={sizeOfImage(track.al?.picUrl, 128)}/>
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
                  <IconButton onClick={() => onPlay(track)}><PlayIcon color='primary'/></IconButton>
              </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className='flex flex-col justify-center'>
        <Typography className='line-clamp-1' variant='body1'>{track.name}</Typography>
        <Typography className='line-clamp-1' variant='caption' component={'div'}>
          {track.ar && <ArtistLink artist={track.ar}/>}
        </Typography>
      </div>
    </div>

    <Typography className='line-clamp-1' variant='body2' component={'div'}>{track.al && <AlbumLink album={track.al}/>}</Typography>

    <div className='flex justify-between items-center'>
      <div className='h-11 w-11'>
        {
          (isHovering || liked) && <motion.div
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
                <IconButton sx={{ p: 1.5 }} onClick={() => {
                  toggleLike(track.id, liked)
                }}>{
                  liked ? <FavoriteIcon fontSize='small'/> : <FavoriteBorderIcon fontSize='small'/>
                } </IconButton>

            </motion.div>
        }

      </div>
      <Typography variant='body2'>{formatDuring(track.dt)}</Typography>
      <div className='h-11 w-11'>
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
                <IconButton sx={{ p: 1.5 }} onClick={e => onContextMenu && onContextMenu(e, track)}><MoreHorizIcon fontSize='small' /></IconButton>

            </motion.div>
        }

      </div>

    </div>
  </Box>
}
