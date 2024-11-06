import { useQuery } from '@tanstack/react-query'
import { Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { favPodcast } from '@/api/user'
import PageTransition from '@/components/PageTransition'
import Image from '@/components/Image'
import PodcastList from '@/pages/podcast/PodcastList'

export default function MyPodcast() {
  const { data } = useQuery(['podcast', 'subscribed'], () => favPodcast())
  const theme = useTheme()
  const { t } = useTranslation()

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
            src='https://cdn.dribbble.com/userupload/7954142/file/original-4cd286ec775b9153936a20019196bcd5.jpg'
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className='flex-1'></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{t`main.podcast.my_sub`}</Typography>
              <div className="flex flex-col">
                <Typography variant="caption"></Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
    <div className='flex flex-col pr-2'>
      {
        data?.djRadios?.length && <PodcastList podcasts={data.djRadios} />
      }
    </div>
  </PageTransition>
}
