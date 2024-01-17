import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { alpha } from '@mui/material/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import { formatDuring } from '@/util/fn'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import NowPlayingLyric from '@/components/nowPlaying/NowPlayingLyric'
import TrackMore from '@/components/nowPlaying/TrackMore'
import MdControl from '@/components/nowPlaying/components/MdControl'
import useResponsiveSize from '@/components/nowPlaying/components/useResponsiveSize'
import { SimpleTrack } from '@/types'
import { playQueueStore } from '@/store/playQueue'
import { usePlayer } from '@/hooks/usePlayer'

const MaterialYouStyle = forwardRef((_, ref)=> {
  const theme = useTheme()
  const { responsiveSize } = useResponsiveSize()
  const { t } = useTranslation()
  const { toggleNowPlaying } = useAppStore()
  const { getNextTrack, getPrevTrack } = playQueueStore()

  const { track, playing, currentTime } = usePlayerStore()
  const { player } = usePlayer()
  const [nextTrack, setNextTrack] = useState<SimpleTrack>()
  const [prevTrack, setPrevTrack] = useState<SimpleTrack>()

  const coverUrl = useMemo(() => {
    return track?.coverUrl ?? track?.al?.picUrl ?? ''
  }, [track])
  const onClose = useCallback(() => {
    toggleNowPlaying(false)
  }, [])

  const maskColor = useMemo(() => {
    if (theme)
      return alpha(theme.palette.primaryContainer.main, 0.5)

    else
      return 'rgba(0 0 0, 0)'
  }, [theme])

  useEffect(() => {
    setNextTrack(getNextTrack())
    setPrevTrack(getPrevTrack())
  }, [track])

  return <Box ref={ref} sx={{
    height: '100vh',
    outline: 'none',
    color: theme.palette.onPrimaryContainer.main,
  }}
  className='grid grid-cols-2'
  >
    <Box className='p-4 flex flex-col gap-4 items-center' sx={{
      bgcolor: alpha(theme.palette.primaryContainer.main, 0.5),
      color: theme.palette.onPrimaryContainer.main,
    }}
    >
      <Box className='drag-area gap-x-2 flex' sx={{ width: '100%' }}>
        {
          prevTrack && <Box className='rounded-full overflow-hidden cursor-pointer no-drag-area ' onClick={() => player.prev()}>
            <Image src={prevTrack.al.picUrl} fit={'cover'}
                   gradient={`linear-gradient(90deg, ${maskColor} 0%, ${maskColor} 100%)`}
            />
          </Box>
        }

        <Box className='rounded-3xl overflow-hidden ' sx={{ minWidth: '30vw', maxWidth: '50vh' }}>
          <Image src={coverUrl} fit={'cover'}
                 gradient={`linear-gradient(90deg, ${maskColor} 0%, rgb(0 0 0 / 0%) 50%, ${maskColor} 100%), linear-gradient(360deg, ${maskColor} 0%, rgb(0 0 0 / 0%) 50%, ${maskColor} 100%)`}
          />
        </Box>
        {
          nextTrack &&  <Box className='rounded-full overflow-hidden cursor-pointer no-drag-area' onClick={() => player.next()}>
            <Image src={nextTrack?.al.picUrl} fit={'cover'}
                   gradient={`linear-gradient(90deg, ${maskColor} 0%, ${maskColor} 100%)`}
            />
          </Box>
        }

      </Box>
      <Box className='flex flex-col gap-8 mb-2 mt-auto' sx={{ width: '70%' }}>
        <div className="flex flex-col justify-center items-center no-drag-area">
          <Typography variant={responsiveSize.titleVariant as 'caption'} className="font-weight-regular line-clamp-1">{ track?.name }</Typography>
          <Typography variant={responsiveSize.subtitleVariant as 'caption'} className='line-clamp-1'><ArtistLink artist={track?.ar} /></Typography>
        </div>
        <MdControl />
        <div className="flex flex-col items-center w-full gap-1 no-drag-area">
          <NowPlayingSlider className="track-slider" />
          <div className='ml-auto flex gap-x-1 items-center'>
            <Typography variant='subtitle2' className="flex justify-center" >{ formatDuring(currentTime * 1000) }</Typography>
            <Typography variant='subtitle2' className="flex justify-center" >/</Typography>
            <Typography variant='subtitle2' className="flex justify-center"  >{ formatDuring(track?.['dt']) }</Typography>
          </div>
          <div className='ml-auto'>
            <TrackMore track={track} />
          </div>
        </div>
      </Box>

    </Box>
    <Box
      sx={{
        bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.5),
      }}
    >
      <div className='flex justify-end p-2 drag-area'>
        <IconButton
          className="no-drag-area"
          onClick={onClose}
          sx={{
            'color': theme.palette.primary.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.primaryContainer.main, theme.palette.action.focusOpacity),
            },
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </div>
      <Box sx={{
        maskImage: `linear-gradient(to bottom, transparent 0px, ${theme.palette.tertiaryContainer.main} 48px)`,
      }}>
        <Box
          className={'overflow-y-hidden'}
          sx={{
            color: theme.palette.onSurface.main,
            maxHeight: 'calc(100vh - 112px)',
            height: 'calc(100vh - 112px)',
            px: responsiveSize.padding,
            maskImage: `linear-gradient(to top, transparent 0px, ${theme.palette.tertiaryContainer.main} 48px)`,
          }}
        >
          <NowPlayingLyric enable={true} />
        </Box>
      </Box>
    </Box>
  </Box>
})

export default MaterialYouStyle
