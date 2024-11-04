import type { SliderProps } from '@mui/material/Slider'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/player'
import { formatDuring } from '@/util/fn'
import MdSlider from '@/components/Slider'

export default function NowPlayingSlider(props: SliderProps) {
  const { player } = usePlayer()
  const { currentTime } = usePlayerStore()
  const { track } = usePlayerControl()
  const trackDt = track?.dt ?? track?.duration ?? 0
  const theme = useTheme()

  const [position, setPosition] = useState(0)
  const [dragging, setDragging] = useState(false)

  function dragStart(value: number) {
    if (!dragging)
      setDragging(true)

    setPosition(value)
    // player.pauseProgress()
  }
  function dragEnd(val: number) {
    setDragging(false)
    setPosition(val)
    player.setSeek(val)
    // player.setSeek(val)
    // player.restoreProgress()
  }

  return <MdSlider
    {...props}
    value={dragging ? position : currentTime}
    valueLabelFormat={(val) => {
      return formatDuring(val * 1000)
    }}
    max={trackDt / 1000}
    min={0}
    step={0.5}
    aria-label="track-slider"
    valueLabelDisplay={props.valueLabelDisplay ?? 'auto'}
    onChangeCommitted={(_, value) => dragEnd(value as number)}
    onChange={(_, value) => dragStart(value as number)}
  />
}
