import { useCallback, useRef, useState } from 'react'
import './App.scss'
import { Box, ThemeProvider } from '@mui/material'
import { MaterialDesignContent, SnackbarProvider } from 'notistack'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { styled } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import Nav from './pages/layout/Nav'
import Main from './pages/layout/Main'
import LoginDialog from './pages/modal/Login'
import Profile from './pages/modal/Profile'
import QuickPanel from './pages/layout/QuickPanel'
import { client } from './plugins/query'
import is from './util/is'
import WindowControl from './components/WindowControl'
import NowPlayingBar from '@/components/nowPlaying/NowPlayingBar'
import NowPlayingList from '@/components/nowPlaying/NowPlayingList'
import BackToTop from '@/components/BackToTop'
import Header from '@/pages/layout/Header'
import useInForeground from '@/hooks/useInForeground'
import useCreateTheme from '@/hooks/useCreateTheme'
import { usePlayerStore } from '@/store/player'
import NowPlayingBlock from '@/components/nowPlaying/NowPlayingBlock'
import { useAppStore } from '@/store/app'
import NowPlayingPage from '@/components/nowPlaying/NowPlayingPage'
import CommentDialog from '@/components/comment/CommentDialog'

const notMacos = is.windows() || is.linux()

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.primaryContainer.main,
    color: theme.palette.onPrimaryContainer.main,
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.errorContainer.main,
    color: theme.palette.onErrorContainer.main,
  },
}))
function App() {
  const { theme } = useCreateTheme()
  const { track } = usePlayerStore()
  const { showNowPlayingBar } = useAppStore()

  const cacheOpacity = useRef(0)
  const appRef = useRef<HTMLDivElement>()
  const overlayContent = useRef<HTMLDivElement>()
  const [showBTT, setShowBTT] = useState(false)
  const { isActive: atHome } = useInForeground('home')

  const handleMainScroll = useCallback((instance: any, e: any) => {
    const scrollTop = e.target.scrollTop
    if (!overlayContent.current)
      overlayContent.current = e.target as HTMLDivElement

    const opacity = getOpacity(scrollTop, 64 + 56, 56)
    if (Number(cacheOpacity.current).toPrecision(2) !== Number(opacity).toPrecision(2)) {
      requestAnimationFrame(() => {
        appRef.current && appRef.current.style.setProperty('--top-bar-opacity', `${Number(opacity).toPrecision(2)}`)
      })
    }
    setShowBTT(scrollTop > 56)
    cacheOpacity.current = opacity
  }, [atHome])
  const onBackToTop = useCallback(() => {
    overlayContent.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider Components={
          {
            success: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
          }
        } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} variant='info' autoHideDuration={2000}>
          <ConfirmProvider>
            <Box
              ref={appRef}
              id='app-container'
              sx={{
                bgcolor: theme.palette.surface.main,
                color: theme.palette.onSurface.main,
                height: '100vh',
                width: '100vw',
                // borderRadius: 0,
                // borderColor: alpha(theme.palette.primary.main, 0.45),
                // borderWidth: border ?? 0,
                // borderStyle: 'solid',
                transform: 'scale(1)',
                overflowY: 'hidden',
                overflowX: 'hidden',
                boxSizing: 'border-box',
                display: 'grid',
                gap: 1,
                gridTemplateAreas: '"left-nav main" "now-playing-bar now-playing-bar"',
                gridTemplateRows: '1fr auto',
                gridTemplateColumns: 'auto 1fr',
                transition: 'border-width .3s ease',
              }}
            >
              <Header/>
              <Nav/>
              <Main onScroll={handleMainScroll}/>
              {
                track && ( showNowPlayingBar ? <NowPlayingBlock /> : <NowPlayingBar />)
              }
              <NowPlayingPage />
              <LoginDialog/>
              <Profile/>
              <QuickPanel/>
              <BackToTop show={showBTT} onBackToTop={onBackToTop} />
              <NowPlayingList />
              <CommentDialog />
              {
                notMacos && <WindowControl />
              }
              <ReactQueryDevtools
                toggleButtonProps={{
                  style: {
                    left: 4,
                    bottom: 90,
                    height: 42,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    appRegion: 'no-drag',
                  },
                }}
                closeButtonProps={{
                  style: {
                    right: 0,
                    left: 'auto',
                  },
                }}
              />
            </Box>
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export function getOpacity(current: number, range = 1, offset = 0) {
  // Check if n is greater than t, return 1
  if (offset > range)
    return 1

  // Calculate normalized value
  let opacity = (current - offset) / (range - offset)

  // Handle NaN (Not a Number)
  if (Number.isNaN(opacity))
    opacity = 1

  // Ensure the normalized value is between 0 and 1
  return Math.min(Math.max(opacity, 0), 1)
}

export default App
