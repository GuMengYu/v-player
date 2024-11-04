import { Typography } from '@mui/material'

import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { sizeOfImage } from '@/util/fn'
import Image from '@/components/Image'
import type { Podcast } from '@/types'

function PodcastItem({ podcast }: {
  podcast: Podcast
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const jumpTo = () => {
    navigate(`/podcast/${podcast.id}`)
  }
  return <Box
    sx={{
      'transition': 'background-color .35s ease',
      '&:hover': {
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.2),
      },
    }}
    className='grid grid-cols-5 gap-4 p-1 items-center cursor-pointer mb-3 rounded-lg'
    onClick={jumpTo}
  >
    <div className='flex gap-2 col-span-3'>
      <div className='h-16 w-16 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={sizeOfImage(podcast?.picUrl, 128)}/>
        </div>
      </div>
      <div className='flex flex-col justify-center'>
        <Typography className='line-clamp-1' variant='body1'>{podcast.name}</Typography>
      </div>
    </div>
    <Typography className='line-clamp-1 col-span-1' variant='body2'>by - {podcast.dj.nickname}</Typography>
    <Typography className='text-right pr-2 col-span-1' variant='body2' >声音 {podcast.programCount}</Typography>
  </Box>
}

export default function PodcastList({ podcasts, className }: {
  podcasts: Podcast[]
  className?: string
}) {
  return <div className={className}>
    {
      podcasts?.length && podcasts.map((track) => {
        return <PodcastItem podcast={track} key={track.id} />
      })
    }
  </div>
}
