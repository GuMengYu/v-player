import { useCallback, useContext, useMemo } from 'react'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOneOnIcon from '@mui/icons-material/RepeatOneOn'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { PlayerContext } from '@/contexts/player'
import { playQueueStore } from '@/store/playQueue'
import { VolumeHighIcon, VolumeLowIcon, VolumeMediumIcon, VolumeMuteIcon } from '@/components/icons/icons'
import { Track, listType } from '@/types'

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
    currentTime,
  } = usePlayerStore()
  const {  shuffle: doShuffle, unShuffle: doUnShuffle, queue, updatePlayQueue } = playQueueStore()
  const isProgram = useMemo(() => track?.source?.fromType === 'program', [track])
  const playingIndex = useMemo(() => {
    return track ? queue.sequence.findIndex(_t => _t.id === track.id) : null
  }, [queue, track])

  const modeIcon = useMemo(() => {
    return (
      {
        [PLAY_MODE.NORMAL]: <RepeatIcon sx={{ fontSize: 16 }} />,
        [PLAY_MODE.REPEAT]: <RepeatOnIcon sx={{ fontSize: 16 }} />,
        [PLAY_MODE.REPEAT_ONCE]: <RepeatOneOnIcon sx={{ fontSize: 16 }} />,
      }[playMode] ?? <RepeatOnIcon />
    )
  }, [playMode])
  const shuffleIcon = useMemo(() => {
    return shuffle ? <ShuffleOnIcon sx={{ fontSize: 16 }} /> : <ShuffleIcon sx={{ fontSize: 16 }}  />
  }, [shuffle])
  const volumeIcon = useMemo(() => {
    if (volume === 0)
      return <VolumeMuteIcon sx={{ fontSize: 16 }} />
    else if (volume > 0 && volume <= 0.3)
      return <VolumeLowIcon sx={{ fontSize: 16 }} />
    else if (volume > 0.3 && volume <= 0.6)
      return <VolumeMediumIcon sx={{ fontSize: 16 }} />
    else
      return <VolumeHighIcon sx={{ fontSize: 16 }} />
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

  const addToQueueAndPlay = useCallback((tracks: Track[], id?: number, type?: listType, name?: string ) => {
    updatePlayQueue(id, type, name, tracks)
    player.next()
  }, [])

  return {
    playPrev,
    playNext,
    playToggle,
    shuffleToggle,
    playModeToggle,
    showPipLyric,
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
    currentTime,
    addToQueueAndPlay,
  }
}
