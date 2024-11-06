import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import { Box, Card, IconButton, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as React from 'react'
import SkipNextIcon from '@mui/icons-material/SkipNextOutlined'
import NowPlayingBarToggle from '@/components/toggle/NowPlayingBarToggle'
import { usePlayerStore } from '@/store/player'
import { usePlayer } from '@/hooks/usePlayer'
import PodcastLink from '@/components/links/podcast'
import ArtistLink from '@/components/links/artist'
import PlayToggle from '@/components/toggle/PlayToggle'
import Image from '@/components/Image'
import TrackMore from '@/components/nowPlaying/TrackMore'

export default function NowPlayingBlock() {
  const theme = useTheme()
  const { track, playing } = usePlayerStore()
  const { t } = useTranslation()
  const [isHovering, setIsHovering] = useState(false)
  const { player } = usePlayer()
  const cover = track?.al?.picUrl
  const isProgram = useMemo(() => track?.source?.fromType === 'program', [track])

  const subTitle = useMemo(() => {
    if (isProgram && track) {
      return <span><PodcastLink podcast={track.radio as any} /> - [{t`main.podcast.program`}]</span>
    }
    else if (track?.ar) {
      return <Typography className="line-clamp-1" variant="caption">
        <ArtistLink artist={track?.ar} />
      </Typography>
    }
    else {
      return <span>{t`common.unknown`}</span>
    }
  }, [isProgram, track])
  return  <motion.div
    initial={{
      opacity: 0,
      transform: 'translate3d(10px, 10px, 0)',
    }}
    animate={{
      opacity: 1,
      transform: 'translate3d(0px, 0px, 0)',
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }}
    style={{
      position: 'absolute',
      bottom: 16,
      height: 56,
      width: 300,
      right: 16,
      zIndex: theme.zIndex.appBar + 1,
    }}
    className='no-drag-area rounded-lg overflow-hidden'
  >
    <Card className='h-full w-full flex items-center px-1.5 gap-1' sx={{
      bgcolor: theme.palette.tertiaryContainer.main,
    }}>
      {/*<div className='overflow-hidden rounded-lg h-12 w-12 flex-shrink-0'>*/}
      {/*  <MotionImage src={cover} />*/}
      {/*</div>*/}
      <Box
        sx={{
          height: 46,
          width: 46,
          minWidth: 46,
          minHeight: 46,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseEnter={ () => setIsHovering(true)}
        onMouseLeave={ () => setIsHovering(false)}
      >
        <Image src={cover} className="absolute"></Image>
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className='w-full h-full absolute bottom-0 right-0 flex items-center justify-center'
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <NowPlayingBarToggle />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <div className="flex flex-col justify-center ml-2">
        <Typography className="line-clamp-1" variant='body2'>
          {
            track?.al?.id ? <RouterLink to={`/album/${track.al.id}`}>{track.name}</RouterLink> : track?.name
          }
        </Typography>
        <Typography className="line-clamp-1 opacity-90" variant='caption'>
          { subTitle }
        </Typography>
      </div>
      <div className='ml-auto actions flex gap-1 items-center'>
        <PlayToggle size='small' />
        <IconButton
          className='no-drag-area'
          onClick={() => player.next()}
        >
          <SkipNextIcon fontSize='small'/>
        </IconButton>
        <TrackMore track={track} />
      </div>

    </Card>

    {/*<NowPlayingMiniBar slot={*/}
    {/*  <NowPlayingBarToggle />*/}
    {/*} />*/}
  </motion.div>
}
