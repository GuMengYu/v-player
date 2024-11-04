import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import AlbumIcon from '@mui/icons-material/Album'
import CopyrightIcon from '@mui/icons-material/Copyright'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useCopyToClipboard } from 'react-use'
import { useTranslation } from 'react-i18next'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import TrackList from '@/components/TrackList'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDate, formatDuring } from '@/util/fn'
import type { Album } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import useQueryAlbum from '@/pages/detail/useQueryAlbum'
import ArtistLink from '@/components/links/artist'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { sub } from '@/api/music'
import { useCommentStore } from '@/store/comment'

function Header({ album }: { album: Album | undefined }) {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)

  const tracksDt = album?.tracks?.reduce((p, c: any) => p + c.dt, 0)

  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { showComment } = useCommentStore()
  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()
  const [copied, copyToClipboard] = useCopyToClipboard()
  const { t } = useTranslation()

  const [subscribed, setSubscribed] = useState(false)
  useEffect(() => {
    setSubscribed(album.isSub)
  }, [album])
  function handlePlay() {
    replaceQueueAndPlay(album.tracks, album.id, 'album', album.name)
  }
  async function subscribe() {
    const { code, message } = await sub('album', album.id, subscribed ? 0 : 1)
    if (code === 200) {
      enqueueSnackbar(`${subscribed ? t`message.remove_from_library_success` : t`message.add_library_success`}`, { variant: 'success' })
      setSubscribed(!subscribed)
    }
    else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    openContextMenu(e, [
      ...(subscribed
        ? [
            {
              type: 'item' as any,
              label: t`common.remove_from_library`,
              onClick: () => {
                subscribe()
              },
            },
          ]
        : [
            {
              type: 'item' as any,
              label: t`common.add_to_library`,
              onClick: () => {
                subscribe()
              },
            },
          ]),
      {
        type: 'item' as any,
        label: t`common.check_cover`,
        onClick: () => {
          setShowImageView(true)
        },
      },
      {
        type: 'item' as any,
        label: t`common.view_comment`,
        onClick: () => {
          showComment(album.id, 'album')
        },
      },
      {
        type: 'item',
        label: t`common.copy_share`,
        onClick: () => {
          copyToClipboard(`https://music.163.com/#/album?id=${album.id}`)
          enqueueSnackbar(t`message.copy_share_success`, { variant: 'success' })
        },
      },
    ])
  }
  return (
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
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Image
            className="absolute"
            src={album.picUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            album?.picUrl
              && <ImageViewer open={showImageView} src={album?.picUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{album.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1" color='primary'>
                  <ArtistLink artist={album.artist} />
                </Typography>
                <Typography variant="caption">
                  {formatDate(album.publishTime, 'LL')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {album.size}
                  </Typography>
                  <Typography variant="caption">{t`main.tracks`}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <AlbumIcon fontSize='small'/>
                  <Typography variant="caption">{t`main.albums`}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {formatDuring(tracksDt)}
                  </Typography>
                  <Typography variant="caption">{t`common.duration`}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center pl-4"
                  style={{ minWidth: '96px' }}
                >
                  <CopyrightIcon fontSize='small'/>
                  <Typography variant="caption">
                    { album.company }
                  </Typography>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button disableElevation variant='contained' sx={{
                  'bgcolor': `${theme.palette.primary.main}1f`,
                  'color': theme.palette.primary.main,
                  'borderRadius': 2.5,
                  'px': 1.5,
                  'py': 1.5,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}38`,
                  },
                }} onClick={handlePlay}>
                  <PlayArrowIcon color='primary' className='mr-1' /> {t`common.play_all`}
                </Button>
                <IconButton size='large' sx={{
                  bgcolor: `${theme.palette.tertiary.main}1f`,
                }} onClick={handleMore}>
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {
          album?.description && <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <Typography variant='body1'>{t`main.album.desc`}</Typography>
                <IconButton onClick={() => setShowDesc(true)}>
                  <ArrowForwardIcon/>
                </IconButton>
              </div>
            </div>
            <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
              <DialogTitle variant='body1'>{t`main.album.desc`}</DialogTitle>
              <DialogContent>
                <Typography variant='caption'>{album['description']}</Typography>
              </DialogContent>
            </Md3Dialog>
          </>
        }
      </div>
    </motion.div>
  )
}
export default function AlbumPage() {
  const params = useParams()
  const theme = useTheme()
  const { data, isLoading } = useQueryAlbum(params.id)
  return (
    <PageTransition>
      <Box className='pr-2'>
        {
          isLoading ? <PlayListSkeleton/> : <Header album={data?.album}/>
        }
        <Box className='h-4'></Box>
        {
          <TrackList tracks={data?.album?.tracks} trackFrom={{ id: data?.album.id, name: data?.album.name, type: 'album' }}/>
        }
      </Box>
    </PageTransition>

  )
}
