import { IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/app'
import { PlaylistIcon } from '@/components/icons/icons'

export default function NowPlayingListToggle() {
  const { t } = useTranslation()
  const { toggleNowPlayingList } = useAppStore()
  return <Tooltip title={t`common.now_playing_list`} placement='top'>
    <IconButton className="no-drag-area" onClick={() => toggleNowPlayingList()}>
      <PlaylistIcon fontSize='small' />
    </IconButton>
  </Tooltip>
}
