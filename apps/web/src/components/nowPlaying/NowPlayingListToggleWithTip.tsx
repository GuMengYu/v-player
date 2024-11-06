import { Tooltip } from '@mui/material'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import NowPlayingListToggle from '@/components/toggle/NowPlayingListToggle'
import { useToolTipStore } from '@/store/tooltip'

export default function NowPlayingListToggleWithTip() {
  const { play, queue, toggleQueueToolTip, togglePlayToolTip } = useToolTipStore()
  const { t } = useTranslation()
  const open = useMemo(() => {
    return play || queue
  }, [play, queue])
  const onClose = useCallback(() => {
    togglePlayToolTip(false)
    toggleQueueToolTip(false)
  }, [])
  useEffect(() => {
    if (queue) {
      setTimeout(() => {
        toggleQueueToolTip(false)
      }, 2000)
    }
    if (play) {
      setTimeout(() => {
        togglePlayToolTip(false)
      }, 2000)
    }
  }, [queue, play])
  const title = useMemo(() => {
    if (play)
      return t`message.already_play`
    else if (queue)
      return t`message.add_queue`
    else
      return ''

  }, [play, queue])
  return <Tooltip title={title} open={open} arrow={true} onClose={onClose}>
    <div>
      <NowPlayingListToggle />
    </div>
  </Tooltip>
}
