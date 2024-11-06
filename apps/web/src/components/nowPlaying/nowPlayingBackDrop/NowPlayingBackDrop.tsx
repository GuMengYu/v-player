import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { usePlayerStore } from '@/store/player'
import { generateMUITheme } from '@/plugins/theme'
import { Vhs } from '@/components/nowPlaying/nowPlayingBackDrop/vhs'
import { sizeOfImage } from '@/util/fn'

export default function NowPlayingPageBackDrop() {
  const theme = useTheme()
  const canvasContainer = useRef<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const { track, playing } = usePlayerStore()
  const [colorPalette, setColorPalette] = useState<Record<string, string>>()
  const vhsRef = useRef<Vhs>()
  const coverUrl = useMemo(() => {
    return sizeOfImage(track.coverUrl ?? track?.al?.picUrl, 256)
  }, [track])

  const resizeCanvas = debounce(
    () => {
      if (canvasContainer.current) {
        const { width, height } = canvasContainer.current.getBoundingClientRect()
        if (canvasRef.current) {
          canvasRef.current.width = width
          canvasRef.current.height = height
        }
      }
    },
    500,
    { maxWait: 2000 },
  )

  useEffect(() => {
    initPixi()
    return () => {
      vhsRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === canvasContainer.current)
          resizeCanvas()
      })
    })
    observer.observe(canvasContainer.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (coverUrl)
      update()
  }, [coverUrl])

  useEffect(() => {
    if (playing)
      vhsRef.current?.play()
    else
      vhsRef.current?.stop()
  }, [playing])
  async function update() {
    const colors = await setColors(coverUrl)
    updateVhs(colors)
  }
  async function setColors(imageUrl: string) {
    try {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = imageUrl
      const muiTheme = await generateMUITheme(image, 'Palette')
      setColorPalette(muiTheme.palette.light)
      return muiTheme.palette.light
    }
    catch (e) {
      console.log(e)
    }
  }
  function updateVhs(colors: any) {
    const { primary, secondary, tertiary, primaryContainer } = colors
    vhsRef.current?.update([primary.main, secondary.main, tertiary.main], primaryContainer.main)
  }

  async function initPixi() {
    const colors = await setColors(coverUrl)

    if (canvasRef.current) {
      const { primary, secondary, tertiary, primaryContainer } = colors

      vhsRef.current = new Vhs(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        res: 12,
        brightness: 0.55,
        animate: true,
        autoPlay: playing,
        colors: [primary.main, secondary.main, tertiary.main],
        baseColor: primaryContainer.main,
      })
    }
  }

  return <Box ref={canvasContainer} className="canvas-container w-full h-full" sx={{
    'position': 'fixed',
    'top': 0,
    'bottom': 0,
    'left': 0,
    'right': 0,
    'display': 'flex',
    'bgcolor': theme.palette.surface.main,
    '& canvas': {
      imageRendering: 'pixelated',
    },
  }}>
    <canvas ref={canvasRef} className='h-full w-full'></canvas>
  </Box>
}
