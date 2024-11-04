import { IconButton, Paper } from '@mui/material'
import { useMemo } from 'react'
import SkipPreviousIcon from '@mui/icons-material/SkipPreviousOutlined'
import SkipNextIcon from '@mui/icons-material/SkipNextOutlined'
import { alpha, useTheme } from '@mui/material/styles'
import { usePlayerStore } from '@/store/player'
import MotionImage from '@/components/Image'
import { usePlayer } from '@/hooks/usePlayer'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import PlayToggle from '@/components/toggle/PlayToggle'
import LikeToggleButton from '@/components/toggle/likeToggle'

export default function NowPlayingMiniBar(props: { slot?: React.ReactElement }) {
  const { track, playing } = usePlayerStore()
  const theme = useTheme()
  const { player } = usePlayer()
  const cover = track?.al?.picUrl

  const maskColor = useMemo(() => {
    if (theme)
      return alpha(theme.palette.primary.main, 0.6)

    else
      return 'rgba(0 0 0, 0)'
  }, [theme])
  return <Paper className='h-full w-full flex flex-col rounded-lg' elevation={24} sx={{
    borderRadius: 4,
  }}>
    <div className='absolute overflow-hidden rounded-lg'>
      <MotionImage src={cover} gradient={`linear-gradient(90deg, ${maskColor} 0%, ${maskColor} 100%)`} />
    </div>

    <div className="flex flex-col justify-between h-full p-1">
      <div className="flex justify-between">
        <LikeToggleButton track={track} size='small'></LikeToggleButton>
        { props.slot }
      </div>
      <div className="flex justify-center flex-col items-center">
        <PlayToggle />
      </div>
      <div className="flex justify-between items-center gap-1">
        <IconButton
          className='no-drag-area'
          sx={{
            height: 28,
            width: 28,
          }} size='small' onClick={() => player.prev()}>
          <SkipPreviousIcon fontSize='small'/>
        </IconButton>
        <NowPlayingSlider size='small' valueLabelDisplay='off' className='no-drag-area' />
        <IconButton
          className='no-drag-area'
          sx={{
            height: 28,
            width: 28,
          }} size='small' onClick={() => player.next()}>
          <SkipNextIcon fontSize='small'/>
        </IconButton>
      </div>
    </div>
  </Paper>
}
