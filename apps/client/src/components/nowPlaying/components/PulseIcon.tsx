import { MusicNote } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { usePlayerStore } from '@/store/player'

export default function PulseIcon() {
  const theme = useTheme()
  const { playing } = usePlayerStore()

  return <MusicNote sx={{
    'borderRadius': '50%',
    'padding': '4px',
    'transform': 'scale(1)',
    'animation': playing ? 'pulse 1s infinite' : 'none',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.95)',
        boxShadow: `0 0 0 0 ${theme.palette.primary.main}`,
      },
      '70%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0)',
      },
      '100%': {
        transform: 'scale(0.95)',
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
      },
    },
  }}>

  </MusicNote>
}
