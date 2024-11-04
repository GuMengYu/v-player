import { Box, Card, IconButton, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PauseIcon from '@mui/icons-material/Pause'

import { useTranslation } from 'react-i18next'
import Image from '@/components/Image'
import LoadingButton from '@/components/button/LoadingButton'
import { PlayIcon } from '@/components/icons/icons'
import { usePlayerStore } from '@/store/player'
import { sizeOfImage, toHttps } from '@/util/fn'
import { usePlayer } from '@/hooks/usePlayer'

export default function ShortCutFM() {
  const [isHovering, setIsHovering] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const { fmTrack, updatePersonalFmList, isCurrentFm, setIsCurrentFm, playing } = usePlayerStore()
  const { player } = usePlayer()
  const navigate = useNavigate()
  const { t } = useTranslation()
  useEffect(() => {
    updatePersonalFmList()
  }, [])

  const coverImgUrl = useMemo(() => {
    if (fmTrack?.album?.picUrl)
      return sizeOfImage(toHttps(fmTrack?.album?.picUrl), 256)
    else if (fmTrack?.al?.picUrl)
      return sizeOfImage(toHttps(fmTrack?.al?.picUrl), 256)
  }, [fmTrack])
  async function handlePlay() {
    try {
      if (isCurrentFm) {
        if (playing)
          player.pause()
        else
          player.play()
      }
      else if (fmTrack?.id) {
        setIsCurrentFm(true)
        await player.updatePlayerTrack(fmTrack.id, true, true, true) // 替换当前播放歌曲
      }
    }
    catch (e) {
      console.debug(e)
    }
  }
  function handleJump() {

  }
  return (
    <Card
      elevation={isHovering ? 1 : 0}
      sx={{
        height: 64,
        borderRadius: 4,
        bgcolor: theme.palette.surfaceVariant.main,
        color: theme.palette.onSurfaceVariant.main,
      }}
      className="cursor-pointer flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleJump}
    >
      <IconButton
        onClick={handlePlay}
        sx={{
          'display': 'flex',
          'justifyContent': 'center',
          'alignItems': 'center',
          'borderRadius': '100%',
          'height': 45,
          'width': 45,
          'bgcolor': theme.palette.primary.main,
          'color': theme.palette.onPrimary.main,
          '&:hover': {
            bgcolor: `${theme.palette.primary.main}F2`,
          },
          'ml': 1.5,
        }}
      >
        {
          playing && isCurrentFm ? <PauseIcon color={'onPrimary' as 'primary'}/> : <PlayIcon sx={{ fontSize: '2.5rem' }} color={'onPrimary' as 'primary'} />
        }

      </IconButton>
      <div className="flex flex-col items-start justify-between px-4 flex-1">
        <Typography
          className="line-clamp-1"
          variant="body2"
        >
          {t`main.discover.fm`}
        </Typography>
        <Typography
          title={''}
          className="line-clamp-1"
          variant="caption"
        >
          {fmTrack?.name}
        </Typography>
      </div>
      <Box
        sx={{
          height: 64,
          width: 64,
          position: 'relative',
        }}
      >
        <Image sizes="" src={coverImgUrl} className="absolute" />
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="flex justify-center items-center top-0 w-full h-full absolute"
              initial={{
                opacity: 0,
                transform: 'translateX(30px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateX(0px)',
              }}
              exit={{
                opacity: 0,
                transform: 'translateX(30px)',
              }}
              transition={{
                duration: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <LoadingButton
                loading={loading}
                onClick={() => {
                  player.nextFm()
                }}
                sx={{
                  'p': 0,
                  'bgcolor': `${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}F2`,
                  },
                  'color': theme.palette.onPrimary.main,
                }}
              >
                <SkipNextIcon />
              </LoadingButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Card>
  )
}
