import type {
  CSSObject,
  IconButtonProps,
} from '@mui/material'
import {
  Box,
  IconButton,
  useTheme,
} from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useScroll } from 'react-use'
import { useElementScrollSize } from '@/hooks/useElementScrollSize'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { goto } from '@/util/service'

function GridRow(props: PropsWithChildren & {
  singleLine?: boolean
  forceCount?: boolean
  rowType?: GridType
}) {
  const cardRowRef = useRef(null)
  const theme = useTheme()
  const FloatBtn = (
    props: IconButtonProps & { direction: 'prev' | 'next' },
  ) => {
    function handleClick() {
      scrollTo(props.direction === 'prev')
    }
    return (
      <IconButton
        {...props}
        onClick={handleClick}
        sx={{
          'width': 30,
          'height': 30,
          'position': 'absolute',
          'zIndex': 10,
          'top': 'calc(50% - 32px)',
          'bgcolor': theme.palette.surface.main,
          'color': theme.palette.onSurface.main,
          'boxShadow': theme.shadows[1],
          '&:hover': {
            bgcolor: theme.palette.primaryContainer.main,
          },
        }}
      >
        {props.direction === 'prev'
          ? (
          <ChevronLeft fontSize="small" />
            )
          : (
          <ChevronRight fontSize="small" />
            )}
      </IconButton>
    )
  }
  const [isHovering, setIsHovering] = useState(false)
  const { gap, count } = useResponsiveGrid(props.rowType ?? GridType.A)
  const {
    clientWidth: scrollPageOffset,
    willScroll,
    scrollWidth,
  } = useElementScrollSize(cardRowRef.current)
  const { x } = useScroll(cardRowRef)

  const showPrevious = useMemo(() => {
    return props.singleLine && x > 0
  }, [x])
  const showNext = useMemo(() => {
    const arriveRight = scrollWidth - (x + scrollPageOffset) < 1
    return props.singleLine && !arriveRight && willScroll
  }, [x, willScroll, scrollPageOffset])

  const cardRowStyle = useMemo(() => {
    const style: CSSObject = {
      columnGap: gap,
      display: 'grid',
      rowGap: gap,
    }
    if (props.singleLine) {
      style.overflowX = 'auto'
      style.gridAutoFlow = 'column'
      style.gridAutoColumns = `calc((100% - ${count - 1} * ${gap}) / ${
        props.forceCount ?? count
      })`
    }
    else {
      style.gridTemplateColumns = `repeat(${count}, 1fr)`
    }
    return style
  }, [gap, count])

  function scrollTo(forward: boolean) {
    const offset = scrollPageOffset + Number.parseInt(gap)
    if (cardRowRef.current) {
      goto(cardRowRef.current, {
        offset: forward ? -offset : offset,
      })
    }
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box sx={{}}>
        {showPrevious && isHovering && (
          <FloatBtn
            size="small"
            direction="prev"
            style={{ left: 0, transform: 'translateX(-50%)' }}
          />
        )}
        {showNext && isHovering && (
          <FloatBtn
            size="small"
            direction="next"
            style={{ right: 0, transform: 'translateX(50%)' }}
          />
        )}
      </Box>
      <Box
        sx={{
          pb: 0.5,
          ...cardRowStyle,
        }}
        className="hide-scrollbar"
        ref={cardRowRef}
      >
        {props.children}
      </Box>
    </div>
  )
}

export default GridRow
