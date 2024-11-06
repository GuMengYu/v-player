import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TrackItem from './TrackItem'
import type { Track, TrackFrom } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { downloadMusic } from '@/hooks/useDownload'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'
import { useCommentStore } from '@/store/comment'

export default function TrackList({ tracks, trackFrom, className }: {
  tracks?: Track[]
  trackFrom?: TrackFrom
  className?: string
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { openContextMenu } = useContextMenu()
  const { showComment } = useCommentStore()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()
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
        label: t`common.view_comment`,
        onClick: () => {
          showComment(track.id, 'music')
        },
      },
      {
        label: t`common.to_artist`,
        ...(track.ar && track.ar.length > 1
          ? {
              type: 'submenu',
              items: track.ar?.map((artist) => {
                return {
                  type: 'item',
                  label: artist.name,
                  onClick: () => {
                    toArtist(artist.id)
                  },
                }
              }),
            }
          : {
              type: 'item',
              onClick: (i) => {
                toArtist(track.ar![0].id)
              },
            }),
      },

      {
        type: 'item',
        label: t`common.to_album`,
        onClick: () => {
          toAlbum(track.al!.id)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: t`common.add_playlist`,
        items: getToPlaylistMenuItem(track.id),
      },
      {
        type: 'item',
        label: t`common.download_local`,
        onClick: async (i) => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [trackFrom])

  function toArtist(id: number) {
    navigate(`/artist/${id}`)
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
  }
  return <div className={className}>
    {
      tracks?.length && tracks.map((track, index) => {
        return <TrackItem track={track} key={track.id} onPlay={handleTrackPlay} onContextMenu={handleContextMenu} index={index + 1} />
      })
    }
  </div>
}
