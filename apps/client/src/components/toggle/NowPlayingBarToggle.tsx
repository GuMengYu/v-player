import { IconButton } from '@mui/material'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAppStore } from '@/store/app'

export default function NowPlayingBarToggle() {
  const { showNowPlayingBar, toggleNowPlayingBar } = useAppStore()
  return <IconButton className="no-drag-area" onClick={() => toggleNowPlayingBar()} sx={{
    height: 36,
    width: 36,
  }}>
    {
      showNowPlayingBar ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowUpIcon fontSize='small' />
    }
  </IconButton>
}
