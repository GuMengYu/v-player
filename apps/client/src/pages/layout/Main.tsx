import { useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import useInForeground from '@/hooks/useInForeground'
import { useAppStore } from '@/store/app'
import HeaderSpacer from '@/pages/layout/HeaderSpacer'

export default function Main({
  onScroll,
}: {
  onScroll?: (instance: any, e: Event) => void
}) {
  const { rail } = useAppStore()
  const theme = useTheme()
  const { isActive: inDetail } = useInForeground([
    'playlist',
    'album',
    'artist',
    'daily',
    'local-album',
    'local-artist',
    'local-playlist',
    'local-liked',
    'video',
    'moods_and_genres_detail',
    'list_collection',
    'cloud',
    'rank',
    'recent',
    'my_podcast',
    'podcast_detail',
    'podcast_genres',
  ])

  // const AppMain = styled(Box)(() => ({
  //   overflowY: "auto",
  //   marginTop: 16,
  //   marginBottom: 16,
  //   paddingLeft: 16,
  //   paddingRight: 16,
  //   // transition: theme.transitions.create("width", {
  //   //   easing: theme.transitions.easing.easeIn,
  //   //   duration: theme.transitions.duration.complex,
  //   // }),
  //   width: `calc(100vw - ${rail ? "256px" : "72px"} - 16px)`,
  // }));

  return (
    <Box
      sx={{
        gridArea: 'main',
        overflowY: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeIn,
          duration: theme.transitions.duration.complex,
        }),
      }}
      component="main"
      className="hide-scrollbar flex"
    >
      <div className='main-view-container flex-1 min-h-0 relative w-full'>
        <OverlayScrollbarsComponent
          className='h-full'
          defer
          events={{
            scroll: onScroll,
          }}
          options={{
            overflow: {
              x: 'hidden',
            },
            scrollbars: {
              visibility: 'hidden',
            },
          }}>
          {
            !inDetail && <HeaderSpacer />
          }
          <Box
          sx={{
            minHeight: 'calc(((100vh - 64px) - 90px) - 519px)',
            pr: inDetail ? 0 : 0.5,
          }}
          >
            <AnimatePresence mode='wait'>
              <Outlet/>
            </AnimatePresence>
          </Box>
        </OverlayScrollbarsComponent>
      </div>

    </Box>
  )
}
