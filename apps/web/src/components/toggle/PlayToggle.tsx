import { IconButton, useTheme } from '@mui/material'
import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import { usePlayer } from '@/hooks/usePlayer'
import { useFlubber } from '@/hooks/useFlubber'
import { usePlayerStore } from '@/store/player'

const playPath = 'M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z'
const pausePath = 'M16 19q-.825 0-1.413-.588T14 17V7q0-.825.588-1.413T16 5q.825 0 1.413.588T18 7v10q0 .825-.588 1.413T16 19Zm-8 0q-.825 0-1.413-.588T6 17V7q0-.825.588-1.413T8 5q.825 0 1.413.588T10 7v10q0 .825-.588 1.413T8 19Z'
export default function PlayToggle({ size }: { size?: 'small' | 'default' }) {
  const theme = useTheme()
  const { playing } = usePlayerStore()
  const { player } = usePlayer()
  const progress = useMotionValue(playing ? 1 : 0)
  const path = useFlubber(progress, [pausePath, playPath])
  useEffect(() => {
    animate(progress, playing ? 0 : 1, { duration: 0.3, ease: 'easeInOut' })
  }, [playing])
  function playToggle() {
    player.togglePlay()
  }
  return (
    <IconButton
      className='no-drag-area'
      onClick={playToggle}
      sx={{
        'height': size === 'small' ? 42 : 50,
        'width': size === 'small' ? 42 : 50,
        'p': 0,
        'bgcolor': theme.palette.primaryContainer.main,
        'color': theme.palette.onPrimaryContainer.main,
        'borderRadius': playing ? (size === 'small' ? '12px' : '14px') : '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.primaryContainer.main, 0.9),
        },
      }}
    >

      <svg width="24" height="24">
        <g>
          <motion.path fill={theme.palette.onPrimaryContainer.main} d={path} />
        </g>
      </svg>
    </IconButton>
  )
}
