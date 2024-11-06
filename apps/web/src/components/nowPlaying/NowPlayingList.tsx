import Modal from '@mui/material/Modal'
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { css, cx } from '@emotion/css'
import type { VirtuosoHandle } from 'react-virtuoso'
import { Virtuoso } from 'react-virtuoso'
import { useWindowSize } from 'react-use'
import CloseIcon from '@mui/icons-material/Close'
import Fade from '@mui/material/Fade'
import { alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { useAppStore } from '@/store/app'
import { playQueueStore } from '@/store/playQueue'
import type { Track, TrackSource } from '@/types'
import { sizeOfImage, sleep } from '@/util/fn'
import Wave from '@/components/Wave'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import { Track as TrackType } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { downloadMusic } from '@/hooks/useDownload'
import { useLikeTrack } from '@/hooks/useLike'
import { ContextMenuItem } from '@/components/contextMenu/types'

function TrackItem({
  track,
  index,
  isCurrentPlaying,
  playing,
  onPlay,
  onContextMenu,
}: {
  track?: Track
  index: number
  playing: boolean
  isCurrentPlaying: boolean
  onPlay?: (id: number) => void
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => void
}) {
  const theme = useTheme()
  const itemRef = useRef()
  const [hovered, setHovered] = useState(false)

  const coverUrl = useMemo(() => {
    return sizeOfImage(track?.al?.picUrl || track?.radio?.picUrl, 256)
  }, [track])
  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={itemRef}
      className='mb-1 pl-1 pr-2 rounded-xl flex items-center justify-between cursor-pointer h-16 transition-all'
      onClick={(e) => {
        if (e.detail === 2 && track?.id)
          onPlay && onPlay(track.id)

      }}
      onContextMenu={e => onContextMenu && onContextMenu(e, track)}
      sx={{
        bgcolor: hovered ? alpha(theme.palette.inverseOnSurface.main, 0.3) : '',
      }}
    >
      {/* Cover */}
      {
        coverUrl && <img alt='Cover' className='mr-4 aspect-square h-14 w-14 flex-shrink-0 rounded-xl' src={coverUrl} />
      }

      {/* Track info */}
      <div className='flex-grow'>
        <Typography className='line-clamp-1' variant='body1'
          color={isCurrentPlaying ? 'primary' : ''}>{track?.name}</Typography>
        {/*<Typography variant='body2'> {track?.ar && <ArtistLink artist={track?.ar}/>}</Typography>*/}
      </div>

      {isCurrentPlaying
        ? (
        <Wave animate={playing}/>
          )
        : (
        <Typography variant='body1'>
          {String(index + 1).padStart(2, '0')}
        </Typography>
          )}
    </Box>
  )
}
function NowPlayingTrackList({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { player } = usePlayer()
  const theme = useTheme()
  const { openContextMenu } = useContextMenu()
  const { queue, removeFromQueue, setIndex } = playQueueStore()
  const { track: playingTrack, playing, playingIndex } = usePlayerControl()
  const { getToPlaylistMenuItem } = useTrackOperation()
  const { toggleLike } = useLikeTrack()
  const { height: windowHeight } = useWindowSize()
  const virtuoso = useRef<VirtuosoHandle | null>(null)
  const listHeight = windowHeight - 150 // padding 150
  const [currentRange, setCurrentRange] = useState({
    startIndex: 0,
    endIndex: 0,
  })
  const [animateScroll, setAnimateScroll] = useState(false)
  useEffect(() => {
    if (!playingIndex)
      return
    // todo need to scroll to position
    const offset = -3 // todo 需计算

    // not in view range
    if (playingIndex < currentRange.startIndex || playingIndex > currentRange.endIndex) {
      const toIndex = playingIndex + offset
      setTimeout(() => {
        virtuoso.current?.scrollToIndex({
          index: toIndex,
          align: 'start',
          behavior: animateScroll ? 'smooth' : undefined,
        })
        setAnimateScroll(true)
      }, 0)
    }
  }, [playingTrack])
  function toArtist(id: number) {
    navigate(`/artist/${id}`)
    onClose()
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
    onClose()
  }
  function toSource(source: TrackSource) {
    navigate(source.fromUrl)
    onClose()
  }
  const handleContextMenu = useCallback((e: any, track: Track) => {
    let fromName = `"${track.source?.fromName}"`
    if (track.source?.fromType === 'program')
      fromName = `电台: ${track.source?.fromName}`
    else if (track.source?.fromType === 'playlist')
      fromName = `歌单: ${track.source?.fromName}`
    else if (track.source?.fromType === 'album')
      fromName = `专辑: ${track.source?.fromName}`
    else if (track.source?.fromType === 'artist')
      fromName = `歌手: ${track.source?.fromName}`



    const normalItems: ContextMenuItem[] = [
      {
        type: 'item',
        label: '从队列中移除',
        onClick: () => {
          removeFromQueue(track.id)
        },
      },
    ]
    if (track.source) {
      normalItems.push({
        type: 'item',
        label: `来自${fromName}`,
        onClick: () => {
          toSource(track.source)
        },
      })
    }
    if (track?.source?.fromType !== 'local') {
      normalItems.push(...[
        {
          type: 'divider',
        },
        {
          type: 'submenu',
          label: t`common.add_playlist`,
          items: getToPlaylistMenuItem(track.id),
        },
        {
          type: 'item',
          label: '添加到喜欢的音乐',
          onClick: () => {
            toggleLike(track.id, false)
          },
        },
        {
          type: 'divider',
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
                onClick: () => {
                  toArtist(track.ar![0].id)
                },
              }),
        },
        {
          type: 'item',
          label: t`common.to_album`,
          onClick: () => {
            toAlbum(track.al!.id)
            onClose()
          },
        },
        {
          type: 'item',
          label: t`common.download_local`,
          onClick: async () => {
            await downloadMusic(track)
          },
        },
      ] as ContextMenuItem[])
    }
    openContextMenu(e, normalItems, {
      useCursorPosition: true,
    })

  }, [])
  const handlePlay = useCallback((index: number) => {
    setIndex(index)
    player.load()
  }, [])
  return <div
    className={cx('w-full', css`
      mask-image: linear-gradient(to bottom, transparent 22px, ${theme.palette.primary.main} 48px);
    `)}
  >
    <Virtuoso
      ref={virtuoso}
      rangeChanged={setCurrentRange}
      className={
        cx('hide-scrollbar', css`
          mask-image: linear-gradient(to top, transparent 8px, ${theme.palette.primary.main} 48px);
        `)
      }
      style={
        {
          height: `${listHeight}px`,
        }
      }
      itemContent={(idx, track) => {
        return <TrackItem
          key={track.id}
          track={track}
          index={idx}
          isCurrentPlaying={playingIndex === idx}
          playing={playing}
          onContextMenu={handleContextMenu}
          onPlay={() => handlePlay(idx)}
        ></TrackItem>
      }}
      data={queue.sequence}
      totalCount={queue.sequence.length}
      fixedItemHeight={72}
      overscan={10}
      components={{
        Header: () => <div className='h-8'></div>,
        Footer: () => <div className='h-8'></div>,
      }}
    />
  </div>
}

function NowPlayingList() {
  const { showNowPlayingList, toggleNowPlayingList } = useAppStore()
  const { clearQueue } = playQueueStore()
  const theme = useTheme()
  const { t } = useTranslation()

  const onClose = useCallback(() => {
    toggleNowPlayingList(false)
  }, [])
  const onClear = useCallback(async () => {
    clearQueue()
    await sleep(200)
    toggleNowPlayingList(false)
  }, [])
  return (
    <Modal open={showNowPlayingList} onClose={onClose} sx={{
      '&:focus-visible': {
        outline: 'none',
      },
      '& .MuiModal-backdrop': {
        backdropFilter: 'blur(100px)',
      },
    }}>
      <Fade in={showNowPlayingList}>
        <Box sx={{
          color: theme.palette.onSurface.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          outline: 'none',
        }}>
          <div className='flex flex-col items-center w-1/2 relative'>
            <NowPlayingTrackList onClose={onClose}/>
            <div className='mt-4 relative flex justify-center w-full items-center'>
              <IconButton onClick={onClose} sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.35),
              }} size='large'><CloseIcon/></IconButton>
              <Tooltip title={t`common.clear_queue`} placement='top'>
                <IconButton onClick={onClear} sx={{
                  position: 'absolute',
                  right: 0,
                }}><ClearAllIcon/>
                </IconButton>
              </Tooltip>
            </div>

          </div>
        </Box>
      </Fade>
    </Modal>)
}
export default NowPlayingList
