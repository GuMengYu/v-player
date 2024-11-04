import './App.scss'
import { Box, IconButton, PaletteOptions, ThemeOptions, ThemeProvider, createTheme } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { useEffect, useMemo, useState } from 'react'
import NowPlayingMiniBar from '@/components/nowPlaying/NowPlayingMiniBar'
import { usePlayerStore } from '@/store/player'
import { generateMUITheme } from '@/plugins/theme'
import useCreateTheme from '@/hooks/useCreateTheme'
import { sizeOfImage } from '@/util/fn'

function getDesignTokens(palette: PaletteOptions): ThemeOptions {
  return {
    typography: {
      fontFamily: [
        'Quicksand',
        'Roboto',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette: {
      mode: 'light',
      ...palette,
    },
  }
}

export default function Minimal() {
  const [palette, setPalette] = useState<PaletteOptions>()
  const { track } = usePlayerStore()
  const { theme: defaultTheme } = useCreateTheme()

  const navigate = useNavigate()
  function back() {
    navigate('/', { replace: true })
    ipcRenderer.invoke('minimal', false)
  }

  useEffect(() => {
    if (track?.al?.picUrl) {
      let imageUrl = track?.al?.picUrl
      if (track?.source?.fromType !== 'local')
        imageUrl = sizeOfImage(track?.al?.picUrl, 128)

      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = imageUrl
      generateMUITheme(image, 'Palette').then((res) => {
        setPalette(res.palette.dark)
      })
    }
  }, [track])
  const theme = useMemo(() => {
    if (palette)
      return createTheme(getDesignTokens(palette))
    else
      return defaultTheme
  }, [palette])

  return (
      <ThemeProvider theme={theme}>
        <Box
          className='drag-area'
          sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
        >
          <NowPlayingMiniBar slot={
            <IconButton
              className='no-drag-area'
              sx={{

                height: 28,
                width: 28,
              }} size='small' onClick={back}>
              <ChevronLeftIcon fontSize='small'/>
            </IconButton>
          } />
        </Box>
      </ThemeProvider>
  )
}
