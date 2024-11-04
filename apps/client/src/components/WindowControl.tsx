import { PropsWithChildren, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl, FormControlLabel, IconButton, Radio,
  RadioGroup, Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { ipcRenderer } from 'electron'
import { WindowState } from '@shared/types'
import CloseIcon from '@mui/icons-material/Close'
import { CheckIndeterminateIcon, ChromeMaximizeIcon, ChromeMinimizeIcon, ChromeRestoreIcon } from './icons/icons'

import { ExitMode, useSettingStore } from '@/store/setting'
import { useAppStore } from '@/store/app'
import './windowcontrol.scss'

function ControlButton(props: PropsWithChildren & { onClick: () => void; color: string; bgColor: string }) {
  const theme = useTheme()

  return <IconButton onClick={props.onClick} sx={{
    'height': 15,
    'width': 15,
    'padding': 0,
    'bgcolor': alpha(theme.palette.inverseSurface.main, 0.7),
    'color': theme.palette.inverseOnSurface.main,
    '& .MuiSvgIcon-root': {
      visibility: 'hidden',
    },
    '&:hover':
     {
       'bgcolor': props.bgColor,
       'color': props.color,
       '& .MuiSvgIcon-root': {
         visibility: 'visible',
       },
     },
  }}>
    { props.children }
  </IconButton>
}
export default function WindowControl() {
  const theme = useTheme()
  const { exitMode, setExitMode } = useSettingStore()
  const { windowState } = useAppStore()
  const [openAlert, setAlert] = useState(false)
  const [remember, setRemember] = useState(false)
  const [exit, setExit] = useState(ExitMode.minimize)
  function handleMinimize() {
    ipcRenderer.invoke(WindowState.MINIMIZED)
  }
  function handleToggleMaximize() {
    if (windowState === WindowState.MAXIMIZED)
      ipcRenderer.invoke(WindowState.NORMAL)
    else
      ipcRenderer.invoke(WindowState.MAXIMIZED)
  }
  function handleClose() {
    if (exitMode === ExitMode.prompt)
      setAlert(true)

    else if (exitMode === ExitMode.minimize)
      ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
    else if (exitMode === ExitMode.exit)
      ipcRenderer.invoke(WindowState.CLOSED)
  }
  async function confirmExit() {
    if (remember)
      setExitMode(exit)
    else
      setExitMode(ExitMode.prompt)

    setAlert(false)
    if (exit === ExitMode.minimize)
      ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
    else if (exit === ExitMode.exit)
      ipcRenderer.invoke(WindowState.CLOSED)
  }
  return <Box sx={{
    position: 'absolute',
    top: '6px',
    left: '9px',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'space-between',
    width: 54,

  }} className="no-drag-area">
            <ControlButton
            onClick={handleClose}
              bgColor={theme.palette.error.main}
              color={theme.palette.onError.main }>
              <CloseIcon sx={{ fontSize: 13, fontWeight: 700 }} />
            </ControlButton>
            <ControlButton
            onClick={handleMinimize}
              bgColor={theme.palette.primaryContainer.main}
              color={theme.palette.onPrimaryContainer.main }>
              <CheckIndeterminateIcon sx={{ fontSize: 16, fontWeight: 700 }} />
            </ControlButton>
            <ControlButton
            onClick={handleToggleMaximize}
              bgColor={theme.palette.tertiaryContainer.main}
              color={theme.palette.onTertiaryContainer.main }>
                {
                  windowState === WindowState.MAXIMIZED
                    ? <ChromeRestoreIcon sx={{ fontSize: 13, fontWeight: 700 }} />
                    : <ChromeMaximizeIcon sx={{ fontSize: 13, fontWeight: 700 }} />
                }
            </ControlButton>
    <Dialog sx={{
      '& .MuiPaper-root': {
        borderRadius: 6,
      },
    }} open={openAlert} onClose={() => setAlert(false)}>
      <DialogContent>
        <div className='flex flex-col'>
          <FormControl size='small'>
            <RadioGroup
             value={exit}
             onChange={
               (event: React.ChangeEvent<HTMLInputElement>) => {
                 setExit(Number((event.target as HTMLInputElement).value))
               }
             }
            >
              <FormControlLabel value={ExitMode.exit} control={<Radio />} label="直接关闭" />
              <FormControlLabel value={ExitMode.minimize} control={<Radio />} label="最小化到系统托盘" />
            </RadioGroup>
          </FormControl>
        </div>
        <Checkbox size='small' value={remember} onChange={(event: any, v) => {
          setRemember(v)
        }} /><Typography variant='caption'>记住我的选择</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAlert(false)}>取消</Button>
        <Button onClick={() => confirmExit()}>确认</Button>
      </DialogActions>
    </Dialog>
  </Box>
}
