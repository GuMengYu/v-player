import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'
import Image from '@/components/Image'
import { newAlbums } from '@/api/album'
import { getTopList, topMvs } from '@/api/top'
import VideoCover from '@/components/cover/VideoCover'

type CollectionType = 'new_album' | 'new_video' | 'leaderboard'
export default function ListCollection() {
  const theme = useTheme()
  const { t } = useTranslation()
  const param = useParams<{ type: CollectionType }>()
  const { data } = useQuery(['list-collection', param.type], async () => {
    let collection: any[] = []
    if (param.type === 'new_album') {
      const { albums } = await newAlbums({ area: 'ALL' })
      collection = albums
    }
    else if (param.type === 'new_video') {
      const { data } = await topMvs()
      collection = data
    }
    else if (param.type === 'leaderboard') {
      const { list } = await getTopList()
      collection = list
    }
    return { collection }
  }, { staleTime: 5 * 60 * 1000, enabled: !!param.type })
  const collection = useMemo(() => {
    return ({
      new_album: {
        name: t`main.new_releases_album`,
        cover: 'https://cdn.dribbble.com/userupload/5937173/file/original-f14b5cf31374d9e829baab07bbf571a9.jpg?resize=752x',
      },
      new_video: {
        name: t`main.new_releases_mv`,
        cover: 'https://cdn.dribbble.com/userupload/6383523/file/original-fdc01c77ebfaa0216cff6bbad12b353f.jpg?resize=752x',
      },
      leaderboard: {
        name: t`main.leader_board`,
        cover: 'https://cdn.dribbble.com/userupload/3005240/file/original-954788082556fd1aac4f983cce2af921.png',
      },
    })[param.type]
  }, [param])
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
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '256px' }}>
          <Image
            className="absolute"
            src={collection.cover}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-8 gap-2">
              <Typography variant="h3">{collection.name}</Typography>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    <div className='pr-2'>
      <GridRow>
        {
          data?.collection?.map((data) => {
            const children = []
            if (param.type === 'new_album')
              return <Cover data={data} type='album' key={data.id} />
            else if (param.type === 'new_video')
              return <VideoCover data={data} key={data.id} />

            else if (param.type === 'leaderboard')
              return <Cover data={data} type='playlist' key={data.id} />
            else
              return <></>
          })
        }
      </GridRow>
    </div>
  </PageTransition>
}
