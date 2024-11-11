import { LyricLine, parseLrc, parseYrc } from '@applemusic-like-lyrics/lyric'
import { LyricPlayer } from '@applemusic-like-lyrics/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { usePlayerStore } from '@/store/player'
import { usePlayer } from '@/hooks/usePlayer'
import { useSettingStore } from '@/store/setting'
  
export default function AMLL() {
  const theme = useTheme()

  const { track, playing } = usePlayerStore()
  const { lyricBlur } = useSettingStore()
  const { player } = usePlayer()
  const [lyricLines, setLyricLines] = useState([])
  const [requestId, setRequestId] = useState(-1)
  const lyricPlayerRef = useRef<any>()
  const { t } = useTranslation()

  let lastTime = -1
  const onFrame = useCallback(
    (time: number) => {
      if (player.howler) {
        if (lastTime === -1)
          lastTime = time
        if (lyricPlayerRef.current) {
          lyricPlayerRef.current?.lyricPlayer?.update(time - lastTime)
          lastTime = time
          lyricPlayerRef.current?.lyricPlayer?.setCurrentTime((player.howler.seek() * 1000) | 0)
          setRequestId(requestAnimationFrame(onFrame))
        }
      }
    },
    [playing],
  )
  useEffect(() => {
    if (track?.source?.fromType === 'local') {
      setLyricLines([{
        words: [{
          endTime: 0,
          startTime: 1331,
          word: t`main.local.local_music_playing`,
        }],
        startTime: 0,
        endTime: Number.POSITIVE_INFINITY,
        translatedLyric: '',
        romanLyric: '',
        isBG: false,
        isDuet: false,
      }])
      return
    }
    let paresed: LyricLine[] = []

    if (track.lyric.yrc?.lyric)
      paresed = parseYrc(track.lyric.yrc.lyric)

    else if (track.lyric.lrc)
      paresed = parseLrc(track.lyric.lrc.lyric)

    const converted = paresed.map((line, i, lines) => ({
      words: line.words,
      startTime: line.words[0]?.startTime ?? 0,
      endTime: lines[i + 1]?.words?.[0]?.startTime ?? Number.POSITIVE_INFINITY,
      translatedLyric: '',
      romanLyric: '',
      isBG: false,
      isDuet: false,
    }))
    setLyricLines(converted)
  }, [track])
  useEffect(() => {
    if (playing) {
      onFrame(0)
    }
    else {
      console.log('cancel-1', requestId)

      cancelAnimationFrame(requestId)
    }

    return () => {
      console.log('cancel-2', requestId)
      cancelAnimationFrame(requestId)
    }
  }, [playing])

  const onLyricLineClick = useCallback(
    (e: any) => {
      const time = e.line.lyricLine.startTime / 1000
      player.setSeek(time)
    },
    [player],
  )
  return (
    <LyricPlayer
      style={{
        'position': 'absolute',
        'top': '0',
        'left': 12,
        'width': '100%',
        'height': '100%',
        'maxWidth': '100%',
        'maxHeight': '100%',
        'contain': 'paint layout',
        'overflow': 'hidden',
        'mixBlendMode': 'plus-lighter',
        '--amll-lyric-view-color': theme.palette.primary.main,
        '--amll-lyric-player-font-size': '1.75rem',
      } as any}
      enableSpring={true}
      enableBlur={lyricBlur ?? false}
      enableScale={true}
      alignAnchor={'center'}
      ref={lyricPlayerRef}
      lyricLines={lyricLines}
      onLyricLineClick={onLyricLineClick}
    />
  )
}
