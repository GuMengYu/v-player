import { ipcRenderer } from 'electron'
import { useNavigate } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { MinimizeSquareIcon } from '@/components/icons/icons'

export default function MinimalButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  async function minimal(e: any) {
    e.preventDefault()
    await ipcRenderer.invoke('minimal', true)
    navigate('/minimal')
  }
  return <Tooltip title={t`common.minimal`} placement='top'>
    <IconButton
      onClick={minimal}>
      <MinimizeSquareIcon fontSize='small' />
    </IconButton>
  </Tooltip>
}
