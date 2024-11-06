import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { forwardRef, useCallback } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { motion } from 'framer-motion'
import NowPlayingLyric from '@/components/nowPlaying/NowPlayingLyric'
import Image from '@/components/Image'
import AlbumLink from '@/components/links/album'
import ArtistLink from '@/components/links/artist'
import { formatDuring } from '@/util/fn'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import LikeToggle from '@/components/toggle/likeToggle'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import MdControl from '@/components/nowPlaying/components/MdControl'

const BasicStyle = forwardRef((props, ref) => {
  const { toggleNowPlaying } = useAppStore()
  const { track, currentTime } = usePlayerStore()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const theme = useTheme()
  const onClose = useCallback(() => {
    toggleNowPlaying(false)
  }, [])
  return  <Box className='p-2 flex flex-col' sx={{
    color: theme.palette.onSurface.main,
    height: '100vh',
  }}>
    <div className="frame-header flex justify-end drag-area">
      <IconButton  sx={{
        'color': theme.palette.primary.main,
        '&:hover': {
          bgcolor: alpha(theme.palette.primaryContainer.main, theme.palette.action.focusOpacity),
        },
      }} className="no-drag-area" onClick={() => toggleNowPlaying(false)}>
        <KeyboardArrowDownIcon />
      </IconButton>
    </div>
    <Box className="frame-content flex justify-center items-center text-center hide-scrollbar overflow-y-auto" sx={{
      maxHeight: 'calc(70vh - 138px)',
    }}>
      <NowPlayingLyric enable={true} />
    </Box>
    <div className='frame-footer flex flex-col gap-3 mt-auto'>
      <motion.div
        initial={{
          transform: 'translateX(30px)',
        }}
        animate={{
          transform: 'translateX(0px)',
          transition: {
            duration: 0.3,
          },
        }}
      >
        <div className="flex gap-4">
          <Box className='overflow-hidden rounded-lg' sx={{ height: '30vh', width: '30vh', maxWidth: '30vh', minWidth: '30vh' }}>
            <Image src={coverUrl} />
          </Box>
          <div className="flex flex-col justify-center gap-4">
            <Typography variant='h5' className='line-clamp-1'><AlbumLink album={track?.al}/> - <ArtistLink artist={track?.ar} /></Typography>
            <Typography variant='h4' className="font-weight-regular line-clamp-1">{ track?.name }</Typography>
          </div>
        </div>
      </motion.div>
      <div className="flex justify-between items-center">
        <Box className='flex justify-center' sx={{
          width: '30vh',
          maxWidth: '30vh',
          minWidth: '30vh',
        }}>
         <MdControl />
        </Box>
        <div className="flex flex-grow items-center">
          <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(currentTime * 1000) }</Typography>
          <NowPlayingSlider className="track-slider mx-2" />
          <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(track?.['dt']) }</Typography>
        </div>
        <Box className='flex'>
          <LikeToggle id={track?.id}/>
        </Box>
      </div>
    </div>
  </Box>
})

export default BasicStyle
