import { IconButton } from '@mui/material'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import { useAppStore } from '@/store/app'

export default function MenuToggle() {
  const { rail, toggleRail } = useAppStore()
  return <IconButton color="primary" className="no-drag-area" onClick={toggleRail} sx={{
    height: 36,
    width: 36,
  }}>
    {
      rail ? <MenuOpenIcon fontSize='small' /> : <MenuIcon fontSize='small' />
    }
  </IconButton>
}
