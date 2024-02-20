import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'

import { useWindowSize } from 'react-use'
import { Lyric, useTrackLyric } from '@/hooks/useTrackOperation'
import { usePlayerStore } from '@/store/player'
import LyricItemView from '@/components/nowPlaying/components/LyricItemView'
import { player } from '@/contexts/player'

export default function NowPlayingLyric({ enable }: { enable: boolean }) {
  const { currentTime, track } = usePlayerStore()
  const lyricContainer = useRef(null)
  const { height } = useWindowSize()
  const defaultOffset = useMemo(() => {
    return height / 2 - 56 - 32
  }, [height])
  const [translateY, setTranslateY] = useState(0)
  const [activeIndex, setActiveIdx] = useState(-1)
  const { lyrics } = useTrackLyric()
  const [lyricList, setLyricList] = useState<(Lyric & { translateY?: number })[]>([])

  const lyricsRef = useRef({
    loaded: false,
    count: 0,
    height: 0,
    list: [],
  })
  useEffect(() => {
    if (lyrics?.length) {
      setLyricList(lyrics)
      setTranslateY(-defaultOffset)
    }
  }, [lyrics])

  useLayoutEffect(() => {
    if (lyricsRef.current.loaded) {
      const lys = lyricsRef.current.list
      const activeIdx = findIndex(lys, (o: Lyric, idx) => {
        const next = lys[idx + 1]
        return (next ? currentTime < next.time : true) && currentTime >= o.time
      })
      const active = lyricsRef.current.list[activeIdx] as Lyric
      if (active) {
        const before = lyricsRef.current.list.slice(0, activeIdx)
        const offset = before.reduce((p, c) => (p + c.height), 0) - defaultOffset
        setTranslateY(offset)
        setActiveIdx(activeIdx)
      }
    }
  }, [currentTime, defaultOffset])

  const onLoaded = useCallback((lyric: Lyric) => {
    // reset
    if (lyricsRef.current.loaded) {
      lyricsRef.current = {
        loaded: false,
        count: 0,
        height: 0,
        list: [],
      }
    }
    lyricsRef.current.count++
    lyricsRef.current.height += lyric.height
    lyricsRef.current.list.push(lyric)
    if (lyricsRef.current.count === lyrics.length) {
      lyricsRef.current.loaded = true
      lyricsRef.current.list = sortBy(lyricsRef.current.list, (i: Lyric) => i.index)
      console.log('loaded all', lyricsRef.current)
    }
  }, [lyrics])
  const delayTime = useCallback((index: number) => {
    if (index - activeIndex <= 0)
      return 0
    else
      return (index - activeIndex) * 20
  }, [activeIndex])

  const onLyricClick = useCallback((idx: number) => {
    const lyric = lyricsRef.current.list[idx]
    if (lyric)
      player.setSeek(lyric.time)
  }, [])
  return <div className="scroll-lyric h-full">
    <ul ref={lyricContainer} className="lyrics">
      {
        lyricList.map((item, index) => {
          return <LyricItemView highLight={activeIndex === index} played={activeIndex > index} lyric={item} key={item.index} animationDelay={ delayTime(index)} onClick={onLyricClick} onLoaded={onLoaded} translateY={translateY} />
        })
      }
  </ul>
</div>
}
