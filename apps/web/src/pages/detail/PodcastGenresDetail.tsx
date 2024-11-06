import { useQuery } from '@tanstack/react-query'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import { catHots, catNewRecommend } from '@/api/podcast'
import PodcastCover from '@/components/cover/PodcastCover'
import { TabPanel } from '@/components/TabPanel'
import Image from '@/components/Image'

export default function PodcastGenresDetail() {
  const theme = useTheme()
  const params = useParams()
  const { data, isLoading } = useQuery(['podcast', 'genres', params.categoryId], async () => {
    const [{ djRadios: hots }, { djRadios: news }] = await Promise.all([
      catHots(+params.categoryId),
      catNewRecommend(+params.categoryId),
    ])

    return {
      hots,
      news,
    }
  }, {
    enabled: !!params.categoryId,
    staleTime: 5 * 60 * 1000,
  })
  const cover = data?.hots?.[0].picUrl
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
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
          <Image
            className="absolute"
            src={cover}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-8 gap-2">
              <Typography variant="h3">{params.categoryName}</Typography>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    <div className='flex flex-col gap-4 pr-2'>
      <Tabs className='self-start' value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="热门播客" value={0} />
        <Tab label="新播客" value={1} />
      </Tabs>
      <Box className='overflow-y-auto my-2 h-full hide-scrollbar'>
        <TabPanel value={value} index={0} >
          <GridRow>
            {
              data?.hots?.map((podcast) => {
                return <PodcastCover data={podcast} key={podcast.id} />
              })
            }
          </GridRow>
        </TabPanel>
        <TabPanel value={value} index={1} >
          <GridRow>
            {
              data?.news?.map((podcast) => {
                return <PodcastCover data={podcast} key={podcast.id} />
              })
            }
          </GridRow>
        </TabPanel>
      </Box>
    </div>
  </PageTransition>
}
