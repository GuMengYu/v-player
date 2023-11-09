import { useSnackbar } from 'notistack'
import { useCallback, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { opPlaylist } from '@/api/music'
import type { Playlist } from '@/types'
import { ContextMenuItem } from '@/components/contextMenu/types'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { arrayToObject, formatLyric } from '@/util/fn'

export function useTrackOperation() {
  const { enqueueSnackbar } = useSnackbar()
  const { createdPlaylist } = useMyPlaylist()

  const addToPlaylist = useCallback(async (trackId: number | number[], playlist: Playlist) => {
    try {
      const { code, message } = await opPlaylist('add', playlist.id, trackId)
      if (code === 200)
        enqueueSnackbar(`已添加到: ${playlist.name}`, { variant: 'success' })
      else
        enqueueSnackbar(message!, { variant: 'warning' })
    }
    catch (e) {
      enqueueSnackbar('添加到歌单失败了', { variant: 'error' })
    }
  }, [])
  const getToPlaylistMenuItem = useCallback((trackId: number): ContextMenuItem[] => {
    return createdPlaylist.map((list) => {
      return {
        type: 'item',
        label: list.name,
        onClick: async () => {
          await addToPlaylist(trackId, list)
        },
      }
    })
  }, [createdPlaylist, addToPlaylist])
  const removeFromPlaylist = useCallback(async (trackId: number | number[], playlist: Playlist) =>  {
    try {
      const { code, message } = await opPlaylist('del', playlist.id, trackId)
      if (code === 200)
        enqueueSnackbar(`已从: ${playlist.name}移除歌曲`, { variant: 'success' })
      else
        enqueueSnackbar(message!, { variant: 'warning' })
    }
    catch (e) {
      enqueueSnackbar('从歌单移除失败了', { variant: 'error' })
    }
  }, [])


  return { getToPlaylistMenuItem, addToPlaylist, removeFromPlaylist }
}

export interface Lyric {
  sentence: string
  time: number
  index?: number
  height?: number
}
export function useTrackLyric() {
  const { t } = useTranslation()
  const { track } = usePlayerStore()
  const { lyricTrans } = useSettingStore()
  const lyrics = useMemo<Lyric[]>(() => {
    if (track?.source?.fromType === 'local') {
      return [{
        sentence: t`main.local.local_music_playing`,
        time: 0,
        index:0,
      }]
    }
    const { tlyric, lrc } = track?.lyric ?? {}
    const lyric = lrc?.lyric ? formatLyric(lrc.lyric) : []
    const trans = arrayToObject(tlyric?.lyric ? formatLyric(tlyric.lyric) : [], 'time')
    if (!lyric?.length) {
      return [{
        sentence: t`common.no_lyric`,
        time: 0,
        index:0,
      }]
    }
    if (!isEmpty(trans) && lyricTrans) {
      return lyric.map((i, index) => {
        return {
          index,
          sentence: `${i.sentence}${trans[i.time] ? `<br>${trans[i.time].sentence}` : ''}`,
          time: i.time,
        }
      })
    }
    else {
      return lyric
    }
  }, [track])
  return {
    lyrics,
  }
}
