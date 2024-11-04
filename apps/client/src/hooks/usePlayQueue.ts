import { useCallback } from 'react'
import { Track, TrackFrom, listType } from '@/types'
import { usePlayer } from '@/hooks/usePlayer'
import { playQueueStore } from '@/store/playQueue'
import { useToolTipStore } from '@/store/tooltip'

export function useReplacePlayQueue() {
  const { player } = usePlayer()
  const { updatePlayQueue, setIndex } = playQueueStore()
  const { togglePlayToolTip } = useToolTipStore()

  const replaceQueueAndPlay = useCallback((tracks: Track[], id?: number, type?: listType, name?: string) => {
    updatePlayQueue(id, type, name, tracks)
    setIndex(0)
    player.load()
    togglePlayToolTip(true)
  }, [])
  return {
    replaceQueueAndPlay,
  }
}

export function useAddToPlayQueue() {
  const { player } = usePlayer()
  const { addToPlayQueue, setIndex, addToPlayQueueBatch } = playQueueStore()
  const { toggleQueueToolTip, togglePlayToolTip } = useToolTipStore()

  const addToQueueAndPlay = useCallback((track: Track, from?: TrackFrom) => {
    const index = addToPlayQueue(track, from, true)
    setIndex(index)
    player.load()
    togglePlayToolTip(true)
  }, [])
  /**
   * 下一首播放
   * autoPlay 立即播放
   */
  const playNext = useCallback((track: Track | Track[], from?: TrackFrom) => {
    if (Array.isArray(track))
      addToPlayQueueBatch(track, from, true)
    else
      addToPlayQueue(track, from, true)
    toggleQueueToolTip(true)
  }, [])
  return {
    addToQueueAndPlay,
    playNext,
  }
}
