import {
  Box, IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isArray } from 'lodash'
import { AnimatePresence, motion } from 'framer-motion'
import { formatNumber, toHttps } from '@/util/fn'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import { PlayIcon } from '@/components/icons/icons'

function VideoCover({ data }: {
  data: any
}) {
  const theme = useTheme()
  const coverBgUrl = toHttps(data.picUrl ?? data.cover ?? data.coverUrl ?? data.imgurl16v9)
  const id = data.id ?? data.vid
  const [isHovering, setIsHovering] = useState(false)

  const navigate = useNavigate()

  const artists = useMemo(() => {
    if (data.artistId) {
      return [
        {
          userId: data.artistId,
          userName: data.artistName,
        },
      ]
    }
    if (data.artists && data.artists.length)
      return data.artists

    if (data.creator) {
      if (isArray(data.creator))
        return data.creator
      else
        return [data.creator]
    }
    return []
  }, [data])
  function jumpTo() {
    navigate(`/video/${id}`)
  }

  return (
    <Box
      sx={{
        bgcolor: 'transparent',
      }}
      className="cursor-pointer"

    >
      <Box>
        <Box
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={{
            position: 'relative',
            aspectRatio: 16 / 9,
            overflow: 'hide',
          }}
          onClick={jumpTo}

        >
          <Image fit='cover' src={coverBgUrl} className="absolute rounded-lg" />
          <div className='absolute top-0 flex h-full w-full'>
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{
                    opacity: 0,
                    position: 'absolute',
                    bottom: 0,
                    padding: 16,
                    right: 0,
                    transform: 'translateY(20px)',
                  }}
                  animate={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <IconButton
                    sx={{
                      'p': 0,
                      'bgcolor': `${theme.palette.primary.main}66`,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.main}4D`,
                      },
                    }}
                    onClick={jumpTo}
                  >
                    <PlayIcon sx={{ fontSize: '2.5rem' }} color='primary'/>
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Box>
        <Box sx={{ p: 0.5 }}>
          <Typography className="line-clamp-1" variant="subtitle2">
            {data.name ?? data.title}
          </Typography>
          <div className='flex justify-between items-center'>
            <Typography className="line-clamp-1" variant="caption">
              <ArtistLink artist={artists} />
            </Typography>
            <Typography variant="caption">
              {formatNumber(data.playCount ?? data.playTime)}
            </Typography>

          </div>

        </Box>
      </Box>
    </Box>
  )
}

export default VideoCover
