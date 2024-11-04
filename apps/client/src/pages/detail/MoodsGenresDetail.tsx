import { useQuery } from '@tanstack/react-query'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'
import { personalizedPlaylist } from '@/api/personalized'
import { getTopPlaylist, getTopPlaylistHighQuality } from '@/api/top'
import type { Playlist } from '@/types'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'
import useSearchParams from '@/hooks/useSearchParams'

export default function MoodsGenresDetail() {
  const theme = useTheme()
  const params = useParams()
  const { searchParams } = useSearchParams()
  const { data, isLoading } = useQuery(['moodsgenres', 'detail', params.type], async () => {
    let playlists: Playlist[] = []
    if (params.type === '推荐') {
      playlists = await personalizedPlaylist()
    }
    else if (params.type === '精品') {
      const { playlists: list } = await getTopPlaylistHighQuality()
      playlists = list
    }
    else {
      const condition = { cat: params.type, offset: 0, limit: 50 }
      const { playlists: list } = await getTopPlaylist(condition)
      playlists = list
    }
    return {
      playlists,
    }
  }, {
    enabled: !!params.type,
    staleTime: 5 * 60 * 1000,
  })
  return <PageTransition>
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
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '217px' }}>
          <Box className='h-full w-full absolute' sx={{
            backgroundColor: `${searchParams.get('color')}`,
            backgroundImage: `linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`,
          }}></Box>

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-8 gap-2">
              <Typography variant="h3">{params.type}</Typography>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    <div className='flex flex-col gap-4 pr-2'>
      <Col title='精选歌单'>
        <GridRow>
          {
            data?.playlists?.slice(0, 4).map((playlist) => {
              return <Cover data={playlist} type='playlist' key={playlist.id} />
            })
          }
        </GridRow>
      </Col>
      <Col title='热门歌单'>
        <GridRow>
          {
            data?.playlists?.slice(4).map((playlist) => {
              return <Cover data={playlist} type='playlist' key={playlist.id} />
            })
          }
        </GridRow>
      </Col>

    </div>
  </PageTransition>
}
