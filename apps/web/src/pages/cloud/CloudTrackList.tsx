import { useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import type { Track, TrackFrom } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { downloadMusic } from '@/hooks/useDownload'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'
import TrackItem from '@/components/TrackItem'

export default function CloudTrackList({ tracks, className }: {
  tracks: Track[]
  className?: string
}) {
  const { openContextMenu } = useContextMenu()
  const { t } = useTranslation()
  const trackFrom: TrackFrom = { id: 0, type: 'cloud', name: '云盘' }

  const { addToQueueAndPlay, playNext } = useAddToPlayQueue()

  const handleTrackPlay = useCallback((track: Track) => {
    addToQueueAndPlay(track, trackFrom)
  }, [trackFrom])
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`common.next_play`,
        onClick: () => {
          playNext(track, trackFrom)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'item',
        label: t`common.download_local`,
        onClick: async () => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [])

  return <div className={className}>
    {
      tracks.length && tracks.map((track, index) => {
        return <TrackItem track={track} key={track.id} onContextMenu={handleContextMenu} onPlay={handleTrackPlay} index={index + 1} />
      })
    }
  </div>
}
