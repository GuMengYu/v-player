// components
import { Virtuoso } from 'react-virtuoso'
import { useNavigate, useParams } from 'react-router-dom'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useCopyToClipboard, useWindowSize } from 'react-use'
import { useSnackbar } from 'notistack'
import { Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { useConfirm } from 'material-ui-confirm'
import PageTransition from '@/components/PageTransition'
import ImageViewer from '@/components/ImageViewer'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'
import TrackItem from '@/components/TrackItem'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'

// hooks
import { useQueryPlaylist, useQueryRelatedPlaylist } from '@/pages/detail/useQueryPlaylist'
import { useAddToPlayQueue, useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import { useTrackOperation } from '@/hooks/useTrackOperation'

// utils and types
import { formatDate, formatDuring, formatNumber } from '@/util/fn'
import type { Playlist, TrackFrom } from '@/types'
import { Track } from '@/types'
import { sub } from '@/api/music'
import { deletePlayList } from '@/api/playlist'
import { PlayOutlinedIcon } from '@/components/icons/icons'
import useVirtualListScroll from '@/hooks/useVirtualListScroll'
import { useUserStore } from '@/store/user'
import { useCommentStore } from '@/store/comment'

const PlayListHeader = memo(({ playlist, cover }: { playlist: Playlist | undefined; cover?: string }) => {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const tracksDt = playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)

  const { openContextMenu } = useContextMenu()
  const { refreshPlaylist } = useUserStore()
  const { showComment } = useCommentStore()
  const confirm = useConfirm()
  const { isCreatedPlaylist, isMyFavList } = useMyPlaylist()
  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const { playNext } = useAddToPlayQueue()
  const { t } = useTranslation()

  const [subscribed, setSubscribed] = useState(false)
  const [_, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    setSubscribed(playlist.subscribed)
  }, [playlist])

  const handlePlay = useCallback(() => {
    replaceQueueAndPlay(playlist.tracks, playlist.id, 'playlist', playlist.name)
  }, [playlist])
  async function subscribe() {
    const { code, message } = await sub('playlist', playlist.id, subscribed ? 0 : 1)
    if (code === 200) {
      enqueueSnackbar(`${subscribed ? t`message.remove_from_library_success` : t`message.add_library_success`}`, { variant: 'success' })
      setSubscribed(!subscribed)
    }
    else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }
  async function del() {
    confirm({
      description: t`message.delete_list_alert`,
      title: t`message.delete_list`,
      dialogProps: { maxWidth: 'xs' },
    }).then(async () => {
      const { code, message } = await deletePlayList(playlist.id)
      if (code === 200) {
        enqueueSnackbar('已删除', { variant: 'success' })
        refreshPlaylist()
      }
      else {enqueueSnackbar(message, { variant: 'error' })}
    })
  }
  const handleMore = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const items = [{
      type: 'item' as any,
      label: t`common.add_to_queue`,
      onClick: () => {
        playNext(playlist.tracks, { id: playlist.id, name: playlist.name, type: 'playlist' })
      },
    },
    {
      type: 'divider',
    },
    ...(!isCreatedPlaylist(playlist) && subscribed
      ? [
          {
            type: 'item' as any,
            label: t`common.remove_from_library`,
            onClick: () => {
              subscribe()
            },
          },
        ]
      : []),
    ...(!isCreatedPlaylist(playlist) && !subscribed && !isMyFavList(playlist.id)
      ? [
          {
            type: 'item' as any,
            label: t`common.add_to_library`,
            onClick: () => {
              subscribe()
            },
          },
        ]
      : []),
    ...(isCreatedPlaylist(playlist)
      ? [
          {
            type: 'item' as any,
            label: t`main.playlist.edit`,
            onClick: () => {
              enqueueSnackbar('待开发...', { variant: 'warning' })
            },
          },
          {
            type: 'item' as any,
            label: t`main.playlist.delete`,
            onClick: () => {
              del()
            },
          },
          { type: 'divider' as any },
        ]
      : []),
    {
      type: 'item' as any,
      label: t`common.view_comment`,
      onClick: () => {
        showComment(playlist.id, 'playlist')
      },
    },
    {
      type: 'item' as any,
      label: t`common.check_cover`,
      onClick: () => {
        setShowImageView(true)
      },
    },
    {
      type: 'item',
      label: t`common.copy_share`,
      onClick: () => {
        copyToClipboard(`https://music.163.com/#/playlist?id=${playlist.id}`)
        enqueueSnackbar(t`message.copy_share_success`, { variant: 'success' })
      },
    },
    ]
    openContextMenu(e, items)
  }, [playlist, subscribed])
  return (
    <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Box
            className='absolute w-full h-full'
            sx={{
              backgroundImage: `linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`,
            }}
          >
            <img
              alt={playlist?.name}
              className='absolute h-full w-full -z-10 object-cover'
              src={ cover ?? playlist?.coverImgUrl}
              loading="lazy"
            />
          </Box>

          {/* <Image */}
          {/*  className="absolute" */}
          {/*  src={playlist?.coverImgUrl} */}
          {/*  fit="cover" */}
          {/*  gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`} */}
          {/* /> */}
          {
            playlist?.coverImgUrl
              && <ImageViewer open={showImageView} src={cover ?? playlist?.coverImgUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{playlist?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1" color='primary'>
                  {playlist?.['creator']?.nickname}
                </Typography>
                <Typography variant="caption">
                  {formatDate(playlist?.createTime, 'LL')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {playlist?.['trackCount']}
                  </Typography>
                  <Typography variant="caption">{t`main.tracks`}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">{t`main.playlists`}</Typography>
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
                  <Typography variant="body2">
                    {playlist?.playCount ? formatNumber(playlist?.['playCount']) : 0}
                  </Typography>
                  <PlayOutlinedIcon fontSize='small'/>
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
          playlist?.description && <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <Typography variant='body1'>{t`main.playlist.desc`}</Typography>
                <IconButton onClick={() => setShowDesc(true)}>
                  <ArrowForwardIcon/>
                </IconButton>
              </div>
            </div>
            <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
              <DialogTitle variant='body1'>{t`main.playlist.desc`}</DialogTitle>
              <DialogContent>
                <Typography variant='caption'>{playlist['description']}</Typography>
              </DialogContent>
            </Md3Dialog>
          </>
        }
      </div>
  )
})
export default function PlaylistPage() {
  const { t } = useTranslation()
  const params = useParams()
  const { showComment } = useCommentStore()
  const { isCreatedPlaylist, isMyPlaylist, isMyFavList } = useMyPlaylist()
  const isMyList = useMemo(() => {
    if (params.id)
      return isMyPlaylist(+params.id)
  }, [params])
  const { data, isLoading } = useQueryPlaylist(params.id, isMyList)
  const { data: relatedPlaylist } = useQueryRelatedPlaylist(params.id)
  const { height: windowHeight } = useWindowSize()
  const { playNext, addToQueueAndPlay } = useAddToPlayQueue()
  const navigate = useNavigate()
  const { openContextMenu } = useContextMenu()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()
  const cover = useMemo(() => {
    return isMyFavList(+params.id) ? data?.playlist?.tracks[0]?.al?.picUrl : data?.playlist.coverImgUrl
  }, [data, params])
  const trackFrom = useMemo<TrackFrom>(() => ({ type: 'playlist', id: data?.playlist.id, name: data?.playlist.name }), [data])

  const handleTrackPlay = useCallback((track: Track) => {
    addToQueueAndPlay(track, trackFrom)
  }, [trackFrom])

  const toArtist = useCallback((id: number) => {
    navigate(`/artist/${id}`)
  }, [])
  const toAlbum = useCallback((id: number) => {
    navigate(`/album/${id}`)
  }, [])
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`common.next_play`,
        onClick: () => {
          playNext(track, trackFrom)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'item',
        label: t`common.view_comment`,
        onClick: () => {
          showComment(track.id, 'music')
        },
      },
      {
        label: t`common.to_artist`,
        ...(track.ar && track.ar.length > 1
          ? {
              type: 'submenu',
              items: track.ar?.map((artist) => {
                return {
                  type: 'item',
                  label: artist.name,
                  onClick: () => {
                    toArtist(artist.id)
                  },
                }
              }),
            }
          : {
              type: 'item',
              onClick: (i) => {
                toArtist(track.ar![0].id)
              },
            }),
      },

      {
        type: 'item',
        label: t`common.to_album`,
        onClick: () => {
          toAlbum(track.al!.id)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: t`common.add_playlist`,
        items: getToPlaylistMenuItem(track.id),
      },
      ...(isCreatedPlaylist(data.playlist)
        ? [{
            type: 'item' as any,
            label: t`common.remove_from_playlist`,
            onClick: () => {
              removeFromPlaylist(track.id, data.playlist)
              // todo remove from playlist
            },
          }]
        : []),
    ], {
      useCursorPosition: true,
    })
  }, [data, trackFrom])

  const { handleScroll } = useVirtualListScroll()
  // const cacheOpacity = useRef(0)
  // const appRef = useRef<HTMLDivElement>()
  //
  // useEffect(() => {
  //   appRef.current = document.getElementById('app-container') as HTMLDivElement
  //   return () => {
  //     appRef.current && appRef.current.style.setProperty('--top-bar-opacity', '0')
  //   }
  // }, [])
  //
  // const handleScroll = useCallback(throttle((e: any) => {
  //   const scrollTop = e.target.scrollTop
  //   const opacity = getOpacity(scrollTop, 36 + 56, 56)
  //   if (Number(cacheOpacity.current).toPrecision(2) !== Number(opacity).toPrecision(2)) {
  //     requestAnimationFrame(() => {
  //       appRef.current && appRef.current.style.setProperty('--top-bar-opacity', `${Number(opacity).toPrecision(2)}`)
  //     })
  //   }
  //   cacheOpacity.current = opacity
  // }, 250, { trailing: true, leading: true }), [appRef])
  return (
    <PageTransition>
      {
        isLoading
          ? <PlayListSkeleton/>
          : <Virtuoso
          className='hide-scrollbar'
          style={
            {
              height: `${windowHeight - 80}px`,
            }
          }
          itemContent={(index, track) => {
            return <TrackItem
              key={track.id}
              track={track}
              onPlay={handleTrackPlay}
              onContextMenu={handleContextMenu}
              index={index + 1}
            />
          }}
          data={data?.playlist.tracks}
          totalCount={data?.playlist.trackCount}
          fixedItemHeight={64}
          overscan={16}
          components={{
            Header: () => <PlayListHeader playlist={data?.playlist} cover={cover} />,
            Footer: () =>
              <Col variant='h6' title={t`main.playlist.simi`} className='pr-2'>
                <GridRow singleLine>
                  {
                    relatedPlaylist?.relatedPlaylists?.map((i) => {
                      return <Cover data={i} key={i.id} type='playlist' />
                    })
                  }
                </GridRow>
              </Col>,
          }}
          onScroll={handleScroll}
        >
        </Virtuoso>
      }

    </PageTransition>
  )
}
