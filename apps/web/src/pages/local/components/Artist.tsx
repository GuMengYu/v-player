import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDuring } from '@/util/fn'
import Image from '@/components/Image'
import { queryAlbumTracks, useQueryAlbumForArtist } from '@/pages/local/hooks/useQueryAlbum'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import GridRow from '@/components/GridRow'
import LocalCover from '@/pages/local/components/Cover'
import { Track } from '@/types'

function Header({ data }: { data: any }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const theme = useTheme()
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { t } = useTranslation()

  const trackDt = useMemo(() => {
    if (tracks.length === 0)
      return 0

    return tracks.reduce((acc, cur) => acc + cur.dt, 0)
  }, [tracks])
  async function loadTracks() {
    let tracks: Track[] = []
    for (const al of data.albums) {
      const list = await queryAlbumTracks(al.id)
      tracks = [...tracks, ...list]
    }
    setTracks(tracks)
  }

  useEffect(() => {
    loadTracks()
  }, [data])

  async function handlePlay() {
    replaceQueueAndPlay(tracks, 0, 'local', `本地歌曲-歌手：${data.name}`)
  }

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
            src={data?.avatar}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{data?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1" color='primary'>
                  { data?.ar }
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {data?.albums.length}
                  </Typography>
                  <Typography variant="caption">个专辑</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">歌手</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {formatDuring(trackDt)}
                  </Typography>
                  <Typography variant="caption">总时长</Typography>
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
export default function LocalArtistPage() {
  const params = useParams()
  const { data, isLoading } = useQueryAlbumForArtist(params.name)

  const artistData = useMemo(() => {
    return {
      ...history.state.usr,
      albums: data?.albums ?? [],
    }
  }, [data])
  return (
    <PageTransition>
      {isLoading}
      <Box>
        {
          isLoading ? <PlayListSkeleton/> : <Header data={artistData}/>
        }
        <Box className='h-4'></Box>
        <GridRow>
          {
            artistData?.albums?.map((album: any) => (
              <LocalCover data={album} key={album.id} type='album'/>
            ))
          }
        </GridRow>
      </Box>
    </PageTransition>

  )
}
