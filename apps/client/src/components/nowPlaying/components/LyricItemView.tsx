import { Typography } from '@mui/material'
import { memo, useLayoutEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import { Lyric } from '@/hooks/useTrackOperation'
import useResponsiveSize from '@/components/nowPlaying/components/useResponsiveSize'

function LyricItemView({ highLight, lyric, translateY, onClick, onLoaded, animationDelay, animation, played }: {
  highLight?: boolean
  lyric: Lyric
  translateY?: number
  animation?: boolean
  animationDelay?: number
  onClick?: (idx: number) => void
  onLoaded?: (lyric: Lyric) => void
  played?: boolean
}) {
  const ref = useRef<HTMLDivElement>()
  const [height, setHeight] = useState(0)
  const theme = useTheme()
  const { responsiveSize } = useResponsiveSize()

  useLayoutEffect(() => {
    const info = ref.current.getBoundingClientRect()
    setHeight(info.height)
    onLoaded?.({ ...lyric, height: info.height })
  }, [lyric])
  return <Box
    onClick={() => onClick(lyric.index)}
    ref={ref}
    className='cursor-pointer'
    current-time={lyric.time}
    current-height={height}
    sx={{
      'p': responsiveSize.lyricPadding,
      'borderRadius': 2,
      'color': highLight ? theme.palette.primary.main : alpha(theme.palette.onTertiaryContainer.main,  played ? 0.5 : 1),
      '&:hover': {
        color:theme.palette.onTertiaryContainer.main,
        bgcolor: alpha(theme.palette.primaryContainer.main, theme.palette.action.focusOpacity),
      },
    }}
    style={{
      transform: `translateY(${-translateY || 0}px)`,
      transitionProperty: 'transform',
      transitionDelay: `${animationDelay || 0}ms`,
      transitionTimingFunction: 'ease-in-out',
      transitionDuration: '650ms',
    }}
  >
    <Typography
      variant={(responsiveSize.titleVariant ?? 'h6') as 'h1'}
      dangerouslySetInnerHTML={{
        __html: lyric.sentence,
      }}
      />
  </Box>
}

export default memo(LyricItemView)
