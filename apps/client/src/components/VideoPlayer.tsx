import { Box, IconButton, IconButtonProps, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { useImmer } from 'use-immer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import MdSlider from '@/components/Slider'
import { formatDuring } from '@/util/fn'
import { PauseRoundedIcon, PlayRoundedIcon } from '@/components/icons/icons'

function ControlButton(props: IconButtonProps) {
  console.log('button render')
  return <IconButton {...props} sx={{ p: 2, bgcolor: 'rgba(255,255,255, 0.2)', backdropFilter: 'blur(10px)' }}></IconButton>
}

interface VideoState {
  playing: boolean
  duration: number
  fullscreen: boolean
}
function Control({
  video,
  videoState,
  title,
  currentTime,
  togglePlay,
  toggleFullscreen,
  onSeek,
}: {
  video: React.RefObject<HTMLVideoElement>
  videoState: VideoState
  togglePlay: () => void
  toggleFullscreen: () => void
  title?: string
  currentTime?: number
  onSeek?: (v: number) => void
}) {
  const [position, setPosition] = useState(0)
  const [dragging, setDragging] = useState(false)
  function dragStart(value: number) {
    if (!dragging)
      setDragging(true)

    setPosition(value)
    // player.pauseProgress()
  }
  function dragEnd(val: number) {
    setPosition(val)
    video.current.currentTime = val
    // 延迟一段时间防止 video 回调事件里还未更新到currentTime 导致 slider 为 no dragging 回到当前播放时间，造成抖动（value={dragging ? position : currentTime}）
    setTimeout(() => {
      setDragging(false)
    }, 500)
  }
  return <motion.div className='flex flex-col gap-2 px-12 py-4 absolute bottom-0 w-full'>
      <div className='flex justify-between items-center'>
        <Typography variant='h4'>{title}</Typography>
        <div className='flex gap-2'>
          <ControlButton onClick={togglePlay}> { videoState.playing ? <PauseRoundedIcon /> : <PlayRoundedIcon/>}</ControlButton>
          <ControlButton onClick={ toggleFullscreen}>{videoState.fullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}</ControlButton>
          <ControlButton><PictureInPictureIcon /></ControlButton>
          <ControlButton><MoreHorizIcon /></ControlButton>
        </div>
      </div>
      <div className="flex flex-grow items-center">
        <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(currentTime * 1000) }</Typography>
        <MdSlider
          className="track-slider mx-2"
          max={videoState.duration}
          min={0}
          value={dragging ? position : currentTime}
          valueLabelDisplay='auto'
          valueLabelFormat={v => formatDuring(v * 1000)}
          onChangeCommitted={(_, value) => dragEnd(value as number)}
          onChange={(_, value) => dragStart(value as number)}
        />
        <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(videoState.duration * 1000) }</Typography>
      </div>
   </motion.div>
}

function VideoPlayer({
  src,
  title,
  poster,
  controls,
  autoPlay,
}: {
  src: string
  title?: string
  poster?: string
  controls?: boolean
  autoPlay?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>()
  const videoContainerRef = useRef<HTMLDivElement>()
  const [currentTime, setCurrentTime] = useState(0)
  const [videoState, setVideoState] = useImmer({
    playing: false,
    duration: 0,
    fullscreen: false,
  })

  useEffect(() => {
    if (!src || !videoRef)
      return

    const onTimeUpdate = () => {
      console.log('onTimeUpdate')
      setCurrentTime(videoRef.current.currentTime)
    }
    const onPlay = () => {
      setVideoState((draft) => {
        draft.playing = true
      })
    }

    const onPause = () => {
      setVideoState((draft) => {
        draft.playing = false
      })
    }

    const onFullScreenChange = () => {
      setVideoState((draft) => {
        draft.fullscreen = !!document.fullscreenElement
      })
    }
    const onDurationChange = () => {
      setVideoState((draft) => {
        draft.duration = videoRef.current.duration
      })
    }
    videoRef.current.addEventListener('play', onPlay)
    videoRef.current.addEventListener('pause', onPause)
    videoRef.current.addEventListener('durationchange', onDurationChange)
    videoRef.current.addEventListener('timeupdate', onTimeUpdate)
    document.addEventListener('fullscreenchange', onFullScreenChange)
    return () => {
      videoRef.current?.removeEventListener('play', onPlay)
      videoRef.current?.removeEventListener('pause', onPause)
      videoRef.current?.removeEventListener('durationchange', onDurationChange)
      videoRef.current?.removeEventListener('timeupdate', onTimeUpdate)
      document.removeEventListener('fullscreenchange', onFullScreenChange)
    }
  }, [src])

  const togglePlay = useCallback(() => {
    videoState.playing ? videoRef.current?.pause() : videoRef.current?.play()
  }, [videoState])
  const onSeek = useCallback((val: number) => {
    videoRef.current.currentTime = val
  }, [videoRef])
  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      videoState.fullscreen = false
    }
    else {
      if (videoContainerRef.current) {
        videoContainerRef.current.requestFullscreen()
        videoState.fullscreen = true
      }
    }
  }, [videoState, videoContainerRef])

  return <Box className='w-full h-full relative' ref={videoContainerRef}>
    <video ref={videoRef} src={src} poster={poster} controls={false} autoPlay={autoPlay} ></video>
    { controls && <Control video={videoRef} videoState={videoState} toggleFullscreen={toggleFullscreen} currentTime={currentTime} togglePlay={togglePlay} onSeek={onSeek} title={title} />}
  </Box>
}

export default memo(VideoPlayer)
