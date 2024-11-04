import { IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { usePlayerControl } from '@/hooks/usePlayer'
import { PipBoldIcon } from '@/components/icons/icons'

export default function PIPPlayerToggle() {
  const { t } = useTranslation()
  const { togglePipPlayer, showPipLyric } = usePlayerControl()
  return <Tooltip title={showPipLyric ? t`common.hide_pip` : t`common.show_pip`} placement='top'>
    <IconButton color={showPipLyric ? 'primary' : 'default'} className="no-drag-area" onClick={togglePipPlayer}>
      <PipBoldIcon fontSize='small' />
    </IconButton>
  </Tooltip>

}
