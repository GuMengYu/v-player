import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import LocalTrackList from '../components/LocalTrackList'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDuring, randomPic } from '@/util/fn'
import Image from '@/components/Image'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useLocalStore } from '@/store/local'
import { useQueryLikedTracks } from '@/pages/local/hooks/useQueryLiked'

function Header({ data }: { data: any }) {
  const theme = useTheme()
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { refreshPlaylist } = useLocalStore()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const tracksDt = data?.tracks?.reduce((p: number, c: any) => p + c.dt, 0)

  function handlePlay() {
    replaceQueueAndPlay(data.tracks, 0, 'local', `本地播放列表: ${data.name}`)
  }
  const coverPic = useMemo(() => {
    return data?.picUrl ?? randomPic()
  }, [data])

  return (
    <motion.div
      initial={{
        opacity: 0, transform: 'translateX(15px)',
      }}
      animate={{
        opacity: 1, transform: 'translateX(0px)',
      }}
      transition={{
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Image
            className="absolute"
            src={coverPic}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{data?.name}</Typography>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {data?.tracks.length}
                  </Typography>
                  <Typography variant="caption">首曲目</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">列表</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {formatDuring(tracksDt)}
                  </Typography>
                  <Typography variant="caption">时长</Typography>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button
                  disableElevation
                  variant='contained'
                  sx={{
                    'bgcolor': `${theme.palette.primary.main}1f`,
                    'color': theme.palette.primary.main,
                    'borderRadius': 2.5,
                    'px': 1.5,
                    'py': 1.5,
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}38`,
                    },
                  }} onClick={handlePlay}>
                  <PlayArrowIcon color='primary' className='mr-1' />{t`common.play_all`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default function LocalLikedPage() {
  const { data, isLoading, refetch } = useQueryLikedTracks()
  const playlistData = useMemo(() => {
    return {
      name: 'Liked Songs',
      picUrl: 'https://cdn.dribbble.com/userupload/3005240/file/original-954788082556fd1aac4f983cce2af921.png',
      tracks: data?.tracks ?? [],
    }
  }, [data])
  return (
    <PageTransition>
      {isLoading}
      <Box>
        {
          isLoading ? <PlayListSkeleton/> : <Header data={playlistData}/>
        }
        <Box className='h-4'></Box>
        {
          playlistData.tracks && <LocalTrackList tracks={playlistData.tracks} reload={refetch} />
        }
      </Box>
    </PageTransition>

  )
}
