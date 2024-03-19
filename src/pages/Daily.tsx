import { useQuery } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import { Button, IconButton, Typography, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import { getDailyRecommend } from '@/api/user'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import TrackList from '@/components/TrackList'
import Image from '@/components/Image'
import { useAddToPlayQueue, useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import i18n from '@/i18n/i18n'
import { TrackFrom } from '@/types'

const trackFrom = { id: 0, name: i18n.t`main.discover.daily`, type: 'daily' } as TrackFrom
function Header({
  data,
}: { data: any }) {
  const theme = useTheme()
  const [loading, toggleLoading] = useState(false)
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const { playNext } = useAddToPlayQueue()
  const cover = data.dailySongs[0]?.al?.picUrl

  function handlePlay() {
    toggleLoading(true)
    replaceQueueAndPlay(data.dailySongs, 0, 'daily', '日推')
    toggleLoading(false)
  }
  const handleMore = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    openContextMenu(e, [{
      type: 'item' as any,
      label: t`common.add_to_queue`,
      onClick: () => {
        playNext(data.dailySongs, trackFrom)
      },
    },
    {
      type: 'item' as any,
      label: t`common.add_all_to_playlist`,
      onClick: () => {
        // todo 批量收藏到歌单
        enqueueSnackbar('开发中')
      },
    }])
  }, [])

  return (
    <motion.div
      initial={{
        opacity: 0, transform: 'translateX(15px)',
      }}
      animate={{
        opacity: 1, transform: 'translateX(0px)',
      }}
      transition={{
        duration: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Image
            className="absolute"
            src={cover}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{t`main.daily.title`}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1">
                  {t`main.daily.sub`}
                </Typography>
              </div>
              <div className='flex gap-3'>
                <Button disableElevation variant='contained' sx={{
                  'bgcolor': `${theme.palette.primary.main}1f`,
                  'color': theme.palette.primary.main,
                  'borderRadius': 2.5,
                  'px': 1.5,
                  'py': 1.5,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}38`,
                  },
                }} onClick={handlePlay}>
                  <PlayArrowIcon color='primary' className='mr-1' /> {t`common.play_all`}
                </Button>
                <IconButton size='large' sx={{
                  bgcolor: `${theme.palette.tertiary.main}1f`,
                }}
                onClick={handleMore}
                >
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default function DailyPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery(['daily', 'tracks'], async () => {
    const { data } = await getDailyRecommend()
    return data
  })
  return <PageTransition>
    <Box>
      {
        isLoading ? <PlayListSkeleton/> : <Header data={data} />
      }
      <Box className='h-4'></Box>
      {
        <TrackList tracks={data?.dailySongs} trackFrom={trackFrom} />
      }
    </Box>
  </PageTransition>
}
