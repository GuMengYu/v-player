import { useCallback, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { AnimatePresence, motion } from 'framer-motion'
import Box from '@mui/material/Box'
import { maxBy } from 'lodash'
import { useTheme } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useTranslation } from 'react-i18next'
import { sizeOfImage } from '@/util/fn'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import type { Track } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { useLikeTrack } from '@/hooks/useLike'
import { downloadMusic } from '@/hooks/useDownload'
import { PlayRecord } from '@/api/user'
import AlbumLink from '@/components/links/album'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'
import { TrackFrom } from '@/types'

function RecordItem({ record, onContextMenu, count }: {
  color?: string
  record: PlayRecord
  count: number
  max: number
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => void
}) {
  const { t } = useTranslation()
  const [isHovering, setIsHovering] = useState(false)
  const { isLiked, toggleLike } = useLikeTrack()
  const { addToQueueAndPlay } = useAddToPlayQueue()
  const liked = isLiked(record.song.id)
  const handlePlay = useCallback(()=> {
    addToQueueAndPlay(record.song, { id: 0, type: 'rank', name: '听歌排行' })
  }, [record])
  return <div
    className={
      cx('grid grid-cols-2 gap-4 px-1 h-16 items-center cursor-pointer mb-1 rounded-lg')
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
    onContextMenu={e => onContextMenu && onContextMenu(e, { ...record.song, liked })}
  >
    <div className='flex gap-2'>
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={sizeOfImage(record.song.al?.picUrl, 128)}/>
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
        <Typography className='line-clamp-1' variant='body1'>{record.song.name}</Typography>
        <Typography className='line-clamp-1' variant='caption' component='span'>
          <span>{record.song.ar && <ArtistLink artist={record.song.ar}/>}</span>
          {
            record.song.al && (<span> - <AlbumLink album={record.song.al}/></span>)
          }
        </Typography>
      </div>
    </div>
    <Box className='h-full relative flex justify-end items-center'>
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
                  toggleLike(record.song.id, liked)
                }}>{
                  liked ? <FavoriteIcon fontSize='small'/> : <FavoriteBorderIcon fontSize='small'/>
                } </IconButton>

            </motion.div>
        }

      </div>
      <Typography className='w-14 text-center' variant='body2'>{t('common.count', { count })}</Typography>
      <IconButton sx={{ p: 1.5 }} onClick={e => onContextMenu && onContextMenu(e, record.song)}><MoreVertIcon fontSize='small' /></IconButton>
    </Box>
  </div>
}

export default function RecordTrackList({ records, className }: {
  records: PlayRecord[]
  className?: string
}) {
  const { openContextMenu } = useContextMenu()
  const { t } = useTranslation()
  const { playNext } = useAddToPlayQueue()
  const theme = useTheme()
  const { getToPlaylistMenuItem } = useTrackOperation()
  const trackFrom: TrackFrom = { id: 0, type: 'rank', name: '听歌排行' }

  const maxCount = maxBy(records, r => r.playCount)?.playCount ?? 0

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`common.next_play`,
        onClick: () => {
          playNext(track, trackFrom)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: t`common.add_playlist`,
        items: getToPlaylistMenuItem(track.id),
      },
      {
        type: 'item',
        label: t`common.download_local`,
        onClick: async () => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [])

  return <div className={className}>
    {
      records.length && records.map((record) => {
        return <RecordItem
          key={record.song.id}
          record={record}
          count={record.playCount}
          max={maxCount}
          color={theme.palette.surfaceVariant.main}
          onContextMenu={handleContextMenu} />
      })
    }
  </div>
}
