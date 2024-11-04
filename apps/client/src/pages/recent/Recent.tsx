import { useQuery } from '@tanstack/react-query'
import { Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { recent } from '@/api/user'
import PageTransition from '@/components/PageTransition'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import Image from '@/components/Image'
import TrackList from '@/components/TrackList'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'

export default function Recent() {
  const { data } = useQuery(['recent'], async () => {
    const [recentTracks, recentPlaylists, recentAlbums] = await Promise.all([recent(), recent('playlist'), recent('album')])

    return {
      recentTrack: recentTracks.data,
      recentPlaylist: recentPlaylists.data,
      recentAlbum: recentAlbums.data,
    }
  })
  const theme = useTheme()
  const { t } = useTranslation()
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  function handlePlay() {
    // const tracks = value === 0 ? data.weekData.map(i => i.song) : data.allData.map(i => i.song)
    // if (tracks?.length)
    //   replaceQueueAndPlay(tracks)
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
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '256px' }}>
          <Image
            className="absolute"
            src='https://cdn.dribbble.com/users/10429876/screenshots/17908057/media/f790d6b040075136491e1c0194edba39.png'
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className='flex-1'></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{t`common.recent`}</Typography>
              <div className="flex flex-col">
                <Typography variant="caption"></Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
    <div className='flex flex-col pr-2'>
      <Tabs className='self-start' value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label={t`main.tracks`} value={0} />
        <Tab label={t`main.playlists`} value={1} />
        <Tab label={t`main.albums`} value={2} />
      </Tabs>
      <Box className='overflow-y-auto my-2 h-full hide-scrollbar'>
        <CustomTabPanel value={value} index={0} >
          <TrackList tracks={data?.recentTrack.list.map((i: any) => i.data)} trackFrom={{ id: 0, name: '最近播放', type: 'recent' }} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} >
          <GridRow>
            {
              data?.recentPlaylist.list.map((i: any) => {
                return <Cover inset data={i.data} type='playlist' key={i.data.id} />
              })
            }
          </GridRow>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} >
          <GridRow>
            {
              data?.recentAlbum.list.map((i: any) => {
                return <Cover inset data={i.data} type='album' key={i.data.id} />
              })
            }
          </GridRow>
        </CustomTabPanel>
      </Box>
    </div>

  </PageTransition>
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  )
}
