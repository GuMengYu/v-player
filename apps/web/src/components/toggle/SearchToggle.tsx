import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { alpha, useTheme } from '@mui/material/styles'
import { useAppStore } from '@/store/app'

export default function SearchToggle() {
  const theme = useTheme()

  const { showSearch, toggleSearch } = useAppStore()
  return <IconButton
    color="primary"
    className="no-drag-area"
    onClick={() => toggleSearch()}
    sx={{
      bgcolor: alpha(theme.palette.surfaceVariant.main, showSearch ? 0.5 : 0.25),
      p: 0,
      height: 42,
      width: 42,
    }}
  >
    <SearchIcon sx={{ height: 20, width: 20 }} />
  </IconButton>
}
