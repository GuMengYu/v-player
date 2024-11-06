import { useCallback, useContext, useMemo } from 'react'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { PlayerContext } from '@/contexts/player'
import { playQueueStore } from '@/store/playQueue'
import {
  InOrderIcon,
  RepeatIcon,
  RepeatOneIcon, ShuffleIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMediumIcon,
  VolumeMuteIcon,
} from '@/components/icons/icons'

export function usePlayer() {
  const player = useContext(PlayerContext)
  return {
    player,
  }
}

export function usePlayerControl() {
  const { player } = usePlayer()
  const {
    isCurrentFm,
    playing,
    track,
    loadingTrack,
    playMode,
    setPlayMode,
    shuffle,
    setShuffle,
    volume,
    showPipLyric,
    setShowPipLyric,
  } = usePlayerStore()
  const { shuffle: doShuffle, unShuffle: doUnShuffle, queue, updatePlayQueue } = playQueueStore()
  const isProgram = useMemo(() => track?.source?.fromType === 'program', [track])
  const playingIndex = useMemo(() => {
    return track ? queue.sequence.findIndex(_t => _t.id === track.id) : null
  }, [queue, track])

  const modeIcon = useMemo(() => {
    return (
      {
        [PLAY_MODE.NORMAL]: <InOrderIcon sx={{ fontSize: 16 }}  />,
        [PLAY_MODE.REPEAT]: <RepeatIcon sx={{ fontSize: 16 }}  color='primary' />,
        [PLAY_MODE.REPEAT_ONCE]: <RepeatOneIcon sx={{ fontSize: 16 }}  color='primary' />,
      }[playMode] ?? <RepeatIcon sx={{ fontSize: 16 }}  />
    )
  }, [playMode])
  const shuffleIcon = useMemo(() => {
    return shuffle ? <ShuffleIcon sx={{ fontSize: 16 }} color='primary' /> : <ShuffleIcon sx={{ fontSize: 16 }} />
  }, [shuffle])
  const volumeIcon = useMemo(() => {
    if (volume === 0)
      return <VolumeMuteIcon fontSize='small' />
    else if (volume > 0 && volume <= 0.3)
      return <VolumeLowIcon fontSize='small' />
    else if (volume > 0.3 && volume <= 0.6)
      return <VolumeMediumIcon fontSize='small' />
    else
      return <VolumeHighIcon fontSize='small' />
  }, [volume])
  const playPrev = useCallback(() => {
    player.prev()
  }, [player])
  const playNext = useCallback(() => {
    if (isCurrentFm)
      player.nextFm()
    else
      player.next()
  }, [player])
  const playToggle = useCallback(() => {
    player.togglePlay()
  }, [player])
  const playModeToggle = useCallback(() => {
    if (playMode === PLAY_MODE.NORMAL)
      setPlayMode(PLAY_MODE.REPEAT)
    else if (playMode === PLAY_MODE.REPEAT)
      setPlayMode(PLAY_MODE.REPEAT_ONCE)
    else if (playMode === PLAY_MODE.REPEAT_ONCE)
      setPlayMode(PLAY_MODE.NORMAL)
  }, [playMode])

  const shuffleToggle = useCallback(() => {
    if (shuffle) {
      doUnShuffle()
      setShuffle(false)
    }
    else {
      doShuffle()
      setShuffle(true)
    }
  }, [shuffle])

  const togglePipPlayer = useCallback(() => {
    if (!showPipLyric)
      player.pipLyric?.enter()
    else
      player.pipLyric?.leave()
  }, [player, showPipLyric])

  return {
    playPrev,
    playNext,
    playToggle,
    shuffleToggle,
    playModeToggle,
    showPipLyric,
    togglePipPlayer,
    volume,
    volumeIcon,
    playing,
    playingIndex,
    track,
    isCurrentFm,
    isProgram,
    loadingTrack,
    playMode,
    modeIcon,
    shuffle,
    shuffleIcon,
  }
}
