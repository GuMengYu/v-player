import {
  Box, Card,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Image from '@/components/Image'
import { PlayIcon } from '@/components/icons/icons'
import { queryAlbumTracks } from '@/pages/local/hooks/useQueryAlbum'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { queryPlaylistTracks } from '@/pages/local/hooks/useQueryTrack'

function LocalCover({ data, type, onContextMenu }: {
  data: any
  type: 'album' | 'playlist'
  onContextMenu?: (e: any, data: any) => void
}) {
  const theme = useTheme()
  const [isHovering, setIsHovering] = useState(false)
  const { replaceQueueAndPlay } = useReplacePlayQueue()

  const navigate = useNavigate()

  function jumpTo() {
    navigate(`/local/${type}/${data.id}`, {
      state: data,
    })
  }

  const handlePlay = useCallback(async (e: any) => {
    e.stopPropagation()
    try {
      let tracks = []
      if (type === 'album')
        tracks = await queryAlbumTracks(data.id)

      else
        tracks = await queryPlaylistTracks(data.id)

      if (tracks?.length)
        replaceQueueAndPlay(tracks, 0, 'local', `本地音乐：${data.name}`)

    }
    catch (e) {
      console.log(e)
    }
  }, [type, data])

  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={jumpTo}
      onContextMenu={e => onContextMenu(e, data)}
    >
      <Box>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: 1,
          }}
        >
          <Image src={data?.picUrl} className="absolute"
            gradient={`linear-gradient(360deg, ${theme.palette.surface.main}e6 0%, rgb(0 0 0 / 0%) 100%)`} />
          <div className='absolute top-0 flex h-full w-full'>
            <Box className='flex items-end pr-16 py-4 pl-2' sx={{
              color: theme.palette.onSurface.main,
            }}>
              <Typography className="line-clamp-2" variant="subtitle2">
                {data.name}
              </Typography>
            </Box>
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
                    onClick={handlePlay}
                  >
                    <PlayIcon sx={{ fontSize: '2.5rem' }} color='primary'/>
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </Box>
      </Box>
    </Card>
  )
}

export default memo(LocalCover)
