import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cx } from '@emotion/css'
import { sizeOfImage, toHttps } from '@/util/fn'
import { PlayRoundedIcon } from '@/components/icons/icons'
import Image from '@/components/Image'
import { getTrackList } from '@/api/music'
import type { Artist } from '@/types'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'

function ArtistCover({ data, compact }: { data: Artist; compact?: boolean }) {
  const theme = useTheme()
  const coverBgUrl = sizeOfImage(toHttps(data.picUrl ?? data.picUrl))
  const [isHovering, setIsHovering] = useState(false)
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const navigate = useNavigate()

  function jumpTo() {
    navigate(`/artist/${data.id}`)
  }

  async function handlePlay(e: any) {
    e.stopPropagation()
    try {
      const info = await getTrackList('artist', data.id)
      replaceQueueAndPlay(info.tracks, info.id, 'artist', data.name)
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        borderRadius: compact ? '50%' : 4,
        bgcolor: compact ? 'transparent' : theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={jumpTo}
    >
      <Box>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: 1,
          }}
        >
          <Box className={cx('absolute h-full', !compact && 'p-4')}>
            <Image src={coverBgUrl} className="absolute rounded-full" fit='cover' />
          </Box>
          <AnimatePresence>
            {isHovering && (
              <motion.div
                className='absolute flex items-center justify-center h-full w-full'
                initial={{
                  opacity: 0,
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
                  onClick={handlePlay}
                >
                  <PlayRoundedIcon fontSize='large' color='primary' />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        {
          !compact && (
            <CardContent sx={{ px: 1.5 }}>
              <Typography className="line-clamp-1 text-center" variant="subtitle2">
                {data.name}
              </Typography>
            </CardContent>
          )
        }

      </Box>
    </Card>
  )
}

export default ArtistCover
