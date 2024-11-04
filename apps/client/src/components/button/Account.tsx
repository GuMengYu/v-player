import { Avatar, IconButton, useTheme } from '@mui/material'
import { useMemo } from 'react'
import FaceIcon from '@mui/icons-material/Face'
import { alpha } from '@mui/material/styles'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'

export default function Account() {
  const { account } = useUserStore()
  const { toggleLogin, toggleQuick } = useAppStore()
  const theme = useTheme()
  const avatarUrl = useMemo(() => {
    return account?.profile.avatarUrl
  }, [account])
  return (
    <>
      {account
        ? (
        <IconButton className='no-drag-area' sx={{
          'backgroundColor': alpha(theme.palette.inverseSurface.main, 0.2),
          'p': 0.5,
          'transition': 'background-color 0.25s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.inverseSurface.main, 0.3),
          },
        }} onClick={() => toggleQuick()}>
          <Avatar sx={{ height: 36, width: 36 }} src={avatarUrl}></Avatar>
        </IconButton>
          )
        : (
        <IconButton className='no-drag-area' color="primary" onClick={() => toggleLogin(true)}>
          <FaceIcon />
        </IconButton>
          )}
    </>
  )
}
