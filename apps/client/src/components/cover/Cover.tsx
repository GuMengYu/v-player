import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { sizeOfImage, sleep, toHttps } from '@/util/fn'
import Image from '@/components/Image'
import { getTrackList } from '@/api/music'
import { PlayIcon } from '@/components/icons/icons'
import LoadingButton from '@/components/button/LoadingButton'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'

function Cover({ data, subTitle, type, inset, noTitle }: {
  data: any
  subTitle?: string
  type: 'album' | 'playlist'
  inset?: boolean
  noTitle?: boolean
}) {
  const theme = useTheme()
  const coverBgUrl = sizeOfImage(toHttps(data.picUrl ?? data.coverImgUrl))
  const _subTitle = subTitle ?? data.copywriter
  const [isHovering, setIsHovering] = useState(false)
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { openContextMenu } = useContextMenu()

  function jumpTo() {
    navigate(`/${type}/${data.id}`)
  }

  const handlePlay = useCallback(async (e: any) => {
    e.stopPropagation()
    try {
      setLoading(true)
      await sleep(2000)
      const info = await getTrackList(type, data.id)
      replaceQueueAndPlay(info.tracks, info.id, type, data.name)
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  }, [type, data])

  function handleContextMenu(e: any) {
    e.preventDefault()
    // openContextMenu(e, [{
    //   type: 'item',
    //   label: '',
    //
    // }], {
    //   useCursorPosition: true,
    // })
  }

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
      onContextMenu={handleContextMenu}
    >
      <Box>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: 1,
          }}
        >
          {/* <CardMedia
            component="img"
            image={coverBgUrl}
            sx={{ aspectRatio: 1 / 1, borderRadius: 4 }}
          ></CardMedia> */}
          <Image src={coverBgUrl} className="absolute"
            gradient={inset ? `linear-gradient(360deg, ${theme.palette.surface.main}e6 0%, rgb(0 0 0 / 0%) 100%)` : ''}/>
          <div className='absolute top-0 flex h-full w-full'>
            {
              !noTitle && inset && (<Box className='flex items-end pr-16 py-4 pl-2' sx={{
                color: theme.palette.onSurface.main,
              }}>
                <Typography className="line-clamp-2" variant="body2">
                  {data.name}
                </Typography>
              </Box>)
            }
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
                  <LoadingButton
                    loading={loading}
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
                  </LoadingButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </Box>
        {
          !noTitle && !inset && <CardContent sx={{ px: 1.5 }}>
            <Typography className="line-clamp-1" variant="body2">
              {data.name}
            </Typography>
            <Typography className="line-clamp-1" variant="body2">
              {_subTitle}
            </Typography>
          </CardContent>
        }
      </Box>
    </Card>
  )
}

export default memo(Cover)
