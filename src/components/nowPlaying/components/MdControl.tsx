import { IconButton } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import SkipPreviousIcon from '@mui/icons-material/SkipPreviousOutlined'
import SkipNextIcon from '@mui/icons-material/SkipNextOutlined'
import { PauseRoundedIcon, PlayRoundedIcon } from '@/components/icons/icons'
import { usePlayerStore } from '@/store/player'
import useResponsiveSize from '@/components/nowPlaying/components/useResponsiveSize'
import { usePlayerControl } from '@/hooks/usePlayer'

export default function MdControl() {
  const theme = useTheme()
  const {  playing } = usePlayerStore()
  const { playNext, playPrev, playToggle } = usePlayerControl()
  const { responsiveSize } = useResponsiveSize()

  return  <div className='flex justify-evenly items-center no-drag-area w-full'>
    <IconButton
      onClick={playPrev}
      sx={{
        'height': responsiveSize.button,
        'width': responsiveSize.button,
        'p': 0,
        'bgcolor': theme.palette.tertiaryContainer.main,
        'color': theme.palette.onTertiaryContainer.main,
        'borderRadius': '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.6),
        },
      }}
    >
      <SkipPreviousIcon sx={{ fontSize: responsiveSize.icon }} />
    </IconButton>
    <IconButton
      onClick={playToggle}
      sx={{
        'height': responsiveSize.button * 1.3,
        'width': responsiveSize.button * 1.3,
        'p': 0,
        'bgcolor': theme.palette.primaryContainer.main,
        'color': theme.palette.onPrimaryContainer.main,
        'borderRadius': playing ? `${responsiveSize.radius}px` : '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.primaryContainer.main, 0.6),
        },
      }}
    >
      {
        playing ? <PauseRoundedIcon  sx={{ fontSize: responsiveSize.icon }} /> : <PlayRoundedIcon   sx={{ fontSize: responsiveSize.icon }}/>
      }
    </IconButton>
    <IconButton
      onClick={playNext}
      sx={{
        'height': responsiveSize.button,
        'width': responsiveSize.button,
        'p': 0,
        'bgcolor': theme.palette.tertiaryContainer.main,
        'color': theme.palette.onTertiaryContainer.main,
        'borderRadius': '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.6),
        },
      }}
    >
      <SkipNextIcon sx={{ fontSize: responsiveSize.icon }} />
    </IconButton>
  </div>
}
