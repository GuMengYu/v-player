import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

export default function NavigateButton() {
  const theme = useTheme()
  const navigate = useNavigate()

  return <div className='flex items-center gap-2 no-drag-area'>
    <IconButton
      color="primary"
      onClick={() => navigate(-1)}
      sx={{
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.35),
        p: 0,
        height: 42,
        width: 42,
      }}>
      <ChevronLeftIcon/>
    </IconButton>
    <IconButton
      color="primary"
      onClick={() => navigate(1)}
      sx={{
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.35),
        p: 0,
        height: 42,
        width: 42,
      }}>
      <ChevronRightIcon/>
    </IconButton>
  </div>
}
