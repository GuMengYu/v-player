import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import { useSnackbar } from 'notistack'
import { useCopyToClipboard } from 'react-use'
import { useTranslation } from 'react-i18next'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import TrackList from '@/components/TrackList'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import type { Artist } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import useQueryArtist from '@/pages/detail/useQueryArtist'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'
import ArtistCover from '@/components/cover/ArtistCover'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { sub } from '@/api/music'

function Header({ artist, onPlay }: { artist: Artist | undefined; onPlay: () => void }) {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  const [copied, copyToClipboard] = useCopyToClipboard()

  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setSubscribed(artist.followed)
  }, [artist])

  async function subscribe() {
    const { code, message } = await sub('artist', artist.id, subscribed ? 0 : 1)
    if (code === 200) {
      enqueueSnackbar(`${subscribed ? t`message.remove_from_library_success` : t`message.add_library_success`}`, { variant: 'success' })
      setSubscribed(!subscribed)
    }
    else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  function handleMore(e: React.MouseEvent<HTMLElement>) {
    const items = [
      ...(subscribed
        ? [
            {
              type: 'item' as any,
              label: t`common.unfollow_artist`,
              onClick: () => {
                subscribe()
              },
            },
          ]
        : [
            {
              type: 'item' as any,
              label: t`common.follow_artist`,
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
        label: t`common.copy_share`,
        onClick: () => {
          copyToClipboard(`https://music.163.com/#/playlist?id=${artist.id}`)
          enqueueSnackbar(t`message.copy_share_success`, { variant: 'success' })
        },
      },
    ]
    openContextMenu(e, items)
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
            src={artist.picUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            artist?.picUrl
              && <ImageViewer open={showImageView} src={artist?.picUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{artist?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant='body1'>
                  {artist.transNames.join('·')}
                  {artist.alias?.length ? `(${artist.alias.join('/')})` : ''}
                </Typography>
                <Typography variant='caption'>
                  {[...(artist['identifyTag'] ?? []), ...(artist['identities'] ?? [])].join('·')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">{t`main.artists`}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">{t`main.tracks`}</Typography>
                  <Typography variant="caption">{artist.musicSize}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">{t`main.albums`}</Typography>
                  <Typography variant="caption">{artist.albumSize}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">{t`main.mvs`}</Typography>
                  <Typography variant="caption">{artist.mvSize}</Typography>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button
                    disableElevation
                    variant='contained'
                    sx={{
                      'bgcolor': `${theme.palette.primary.main}1f`,
                      'color': theme.palette.primary.main,
                      'borderRadius': 2.5,
                      'px': 1.5,
                      'py': 1.5,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.main}38`,
                      },
                    }} onClick={onPlay}>
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
          artist?.briefDesc && <>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                        <Typography variant='body1'>{t`main.artist.desc`}</Typography>
                        <IconButton onClick={() => setShowDesc(true)}>
                            <ArrowForwardIcon/>
                        </IconButton>
                    </div>
                </div>
                <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
                    <DialogTitle variant='body1'>{t`main.artist.desc`}</DialogTitle>
                    <DialogContent>
                        <Typography variant='caption'>{artist.briefDesc}</Typography>
                    </DialogContent>
                </Md3Dialog>
            </>
        }
      </div>
    </motion.div>
  )
}

export default function ArtistPage() {
  const params = useParams()
  const { t } = useTranslation()
  const theme = useTheme()
  const { data, isLoading } = useQueryArtist(params.id)
  const [more, setMore] = useImmer({
    showMoreSong: false,
    showMoreAlbum: false,
    showMoreEps: false,
    showMoreCollection: false,
    showMoreMVs: false,
    showMoreDesc: false,
  })
  const albums = useMemo(() => data?.hotAlbums.filter(a => a.type === '专辑'), [data])
  const epAndSingle = useMemo(() => data?.hotAlbums.filter(a => ['EP/Single', 'EP', 'Single'].includes(a.type)), [data])
  const collection = useMemo(() => data?.hotAlbums.filter(a => a.type === '合集'), [data])

  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const handlePlay = useCallback(() => {
    if (data.artist)
      replaceQueueAndPlay(data.hotSongs, data.artist.id, 'artist', data.artist.name)
  }, [data])
  return (
    <PageTransition>
      {isLoading}
      <Box sx={{ color: theme.palette.onSurface.main, display: 'flex', flexDirection: 'column', gap: 2 }} className='pr-2'>
        {
          isLoading ? <PlayListSkeleton/> : <Header artist={data.artist} onPlay={handlePlay}/>
        }
        {
          data?.hotSongs && <Col
                variant='body1'
                title={t`main.artist.hot`}
                more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreSong = !draft.showMoreSong
                })
              }}>
                  {
                    more.showMoreSong ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
                  }
                </IconButton>
          }
            >
                <TrackList tracks={more.showMoreSong ? data.hotSongs : data.hotSongs.slice(0, 5)} trackFrom={{ id: data.artist.id, name: data.artist.name, type: 'artist' }} />
            </Col>
        }

        {
          albums?.length && <Col title={t`main.artist.albums`} variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreAlbum = !draft.showMoreAlbum
                })
              }}>
              {
                more.showMoreAlbum ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreAlbum ? albums : albums.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col>
        }

        {
          epAndSingle?.length && <Col title={t`main.artist.epAndSingle`} variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreEps = !draft.showMoreEps
                })
              }}>
              {
                more.showMoreEps ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreEps ? epAndSingle : epAndSingle.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col>
        }
        {
          collection?.length
            ? <Col title={t`main.artist.collection`} variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreCollection = !draft.showMoreCollection
                })
              }}>
              {
                more.showMoreCollection ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreCollection ? collection : collection.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col>
            : null
        }
        {
          <Col title={t`main.artist.simi`}>
            <GridRow>
              {
                data?.simiArtists && data.simiArtists.map((artist) => {
                  return <ArtistCover data={artist} key={artist.id} compact />
                })
              }
            </GridRow>
          </Col>
        }

      </Box>
    </PageTransition>

  )
}
