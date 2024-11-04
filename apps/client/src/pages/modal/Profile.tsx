import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Typography, styled, useTheme,
} from '@mui/material'
import { useMemo } from 'react'
import {
  Close,
  EditRounded,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { ipcRenderer } from 'electron'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Md3Dialog from './Md3Dialog'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import is from '@/util/is'

function Profile() {
  const { showProfile: open, toggleProfile } = useAppStore()
  const { account } = useUserStore()
  const theme = useTheme()
  const { t } = useTranslation()
  const avatarUrl = useMemo(() => {
    return account?.profile.avatarUrl
  }, [account])

  const BottomButton = styled(Button)(() => ({
    'flex': 1,
    'height': 60,
    'boxShadow': 'none',
    'border': '1px solid transparent',
    'justifyContent': 'start',
    'gap': 4,
    '&:hover': {
      bgcolor: theme.palette.secondaryContainer.main,
      borderColor: theme.palette.primary.main,
    },
  }))
  BottomButton.defaultProps = {
    variant: 'contained',
    color: 'surface' as 'primary',
    disableElevation: true,
  }
  const goto = (url: string) => {
    if (is.electron())
      ipcRenderer.invoke('open-url', url)
    else
      window.open(url, '_blank')
  }
  function handleClose() {
    toggleProfile(false)
  }
  function handleLogout() {
    ipcRenderer.invoke('reset-direct')
    localStorage.clear()
    location.reload()
    // ipcRenderer.invoke('relaunch-direct')
  }
  function handleEdit() {
    ipcRenderer.invoke('open-url', 'https://music.163.com/#/user/update')
  }
  return (
    <Md3Dialog open={open} onClose={handleClose}>
      <Card
        sx={{
          width: 400,
          p: 1,
          bgcolor: theme.palette.surface.main,
          color: theme.palette.onSurface.main,
        }}
      >
        <Box display="flex" justifyContent="end">
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: 'relative',
            px: 1,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: 92,
              bgcolor: theme.palette.surfaceVariant.main,
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              borderRadius: 4,
              px: 2,
            }}
          >
            <Avatar
              sx={{
                height: 56,
                width: 56,
                mr: 2,
              }}
              src={avatarUrl}
            ></Avatar>
            <Box>
              <Typography variant="h6">{account?.profile.nickname}</Typography>
              <Typography variant="caption" className="line-clamp-1">
                {account?.profile.signature}
              </Typography>
            </Box>
          </Card>
          {/* <Button */}
          {/*  variant="contained" */}
          {/*  color="primary" */}
          {/*  sx={{ */}
          {/*    height: 48, */}
          {/*    width: 48, */}
          {/*    borderRadius: 3.5, */}
          {/*    minWidth: 48, */}
          {/*    position: 'absolute', */}
          {/*    bottom: -26, */}
          {/*    right: 25, */}
          {/*  }} */}
          {/*  onClick={handleEdit} */}
          {/* > */}
          {/*  <EditRounded /> */}
          {/* </Button> */}
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 0.5,
          }}
        >
          <BottomButton
            sx={{
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            }}
            onClick={handleEdit}
          >
            <EditRounded fontSize='small' />
            <Typography variant="caption">{t`message.edit_profile`}</Typography>
          </BottomButton>
          <BottomButton
            sx={{
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
            }}
            onClick={handleLogout}
          >
            <LogoutIcon fontSize='small' />
            <Typography variant="caption">{t`message.logout`}</Typography>
          </BottomButton>
        </Box>
        <Box display="flex" justifyContent="center" mt={2} gap={1}>
          <Button
            variant="text"
            size="small"
            onClick={() => goto('https://github.com/GuMengYu/music-you/blob/dev/README.md#声明')}
          >
            <Typography variant="caption">{t`message.disclaimer`} </Typography>
          </Button>
          <Divider orientation='vertical' flexItem variant='middle' />
          <Button
            size="small"
            variant="text"
            onClick={() => goto('https://github.com/GuMengYu/music-you')}
          >
            <Typography variant="caption">github </Typography>
          </Button>
        </Box>
      </Card>
    </Md3Dialog>
  )
}

export default Profile
