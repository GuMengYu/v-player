import { IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PlayToggle from './toggle/PlayToggle'
import {
  SkipNextIcon,
  SkipPreviousIcon,
} from '@/components/icons/icons'
import { usePlayerControl } from '@/hooks/usePlayer'

function Control({ compact }: { compact?: boolean }) {
  const { t } = useTranslation()
  const { playNext, playPrev, modeIcon, shuffleIcon, shuffle, shuffleToggle, playModeToggle } = usePlayerControl()
  return (
    <div className="flex items-center gap-x-1.5">
      {
        !compact && <Tooltip title={shuffle ? t`common.un_shuffle` : t`common.shuffle`} placement='top'>
          <IconButton sx={{ p: 1.25 }} onClick={shuffleToggle}>
          {shuffleIcon}
          </IconButton>
        </Tooltip>
      }

      <IconButton sx={{ p: 1.25 }} onClick={playPrev}>
        <SkipPreviousIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <div className='px-1'>
        <PlayToggle />
      </div>
      <IconButton sx={{ p: 1.25 }} onClick={playNext}>
        <SkipNextIcon sx={{ fontSize: 16 }} />
      </IconButton>
      {
        !compact && <IconButton sx={{ p: 1.25 }} onClick={playModeToggle}>
          {modeIcon}
          </IconButton>
      }

    </div>
  )
}

export {
  Control,
}
