import { PaletteOptions, Slide, ThemeOptions, ThemeProvider, createTheme } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import useCreateTheme from '@/hooks/useCreateTheme'
import { sizeOfImage } from '@/util/fn'
import { generateMUITheme } from '@/plugins/theme'
import MaterialYouStyle from '@/components/nowPlaying/components/MaterialYouStyle'

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
const Transition = forwardRef((
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function NowPlayingPage() {

  const [palette, setPalette] = useState<PaletteOptions>()


  const { track } = usePlayerStore()
  const { theme: defaultTheme } = useCreateTheme()

  const theme = useMemo(() => {
    if (palette)
      return createTheme(getDesignTokens(palette))
    else
      return defaultTheme
  }, [palette])

  const { showNowPlaying, toggleNowPlaying } = useAppStore()


  useEffect(() => {
    if (track?.al?.picUrl && showNowPlaying) {
      let imageUrl = track?.al?.picUrl

      if (track?.source?.fromType !== 'local')
        imageUrl = sizeOfImage(track?.al?.picUrl)

      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = imageUrl
      generateMUITheme(image, 'Palette').then((res) => {
        setPalette(res.palette.dark)
      })
    }
  }, [track, showNowPlaying])

  const onClose = useCallback(() => {
    toggleNowPlaying(false)
  }, [])
  return <Modal
    open={showNowPlaying} onClose={onClose} sx={{
      '&:focus-visible': {
        outline: 'none',
      },
      '& .MuiModal-backdrop': {
        backdropFilter: 'blur(100px)',
      },
    }}
  >

    <Fade in={showNowPlaying}>
      <div>
        <ThemeProvider theme={theme}>
          <MaterialYouStyle />
        </ThemeProvider>
      </div>

    </Fade>

  </Modal>
}
