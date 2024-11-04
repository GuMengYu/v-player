import {
  Box,
  Button,
  Card, Checkbox, Dialog,
  IconButton, TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { sampleSize } from 'lodash'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AlbumIcon from '@mui/icons-material/Album'
import HistoryIcon from '@mui/icons-material/History'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import { useTranslation } from 'react-i18next'
import { alpha } from '@mui/material/styles'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { useSnackbar } from 'notistack'
import MYTabs from '@/components/Tabs'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import Cover from '@/components/cover/Cover'
import { useUserAlbums, useUserArtists, useUserMVs } from '@/hooks/query/user'
import ArtistCover from '@/components/cover/ArtistCover'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import VideoCover from '@/components/cover/VideoCover'
import { GridType } from '@/hooks/useResponsiveGrid'
import SwitchCard from '@/components/SwitchCard'
import { Track } from '@/types'
import { formatNumber, sizeOfImage } from '@/util/fn'
import Image from '@/components/Image'
import { useUserStore } from '@/store/user'
import { getSongData } from '@/api/song'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import { getTrackList } from '@/api/music'
import Col from '@/components/Col'
import { createPlaylist } from '@/api/playlist'

const AlbumCovers = memo(({ tracks }: { tracks: Track[] }) => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-shrink-0 gap-2'>
      {tracks?.map(track => (
        <div className='h-24 w-24 cursor-pointer' key={track.id}>
          <Image
            src={sizeOfImage(track.al?.picUrl)}
            className='aspect-square rounded-2xl'
            onClick={() => navigate(`/album/${track.al.id}`)}
          />
        </div>

      ))}
    </div>
  )
})

function CreatePlaylist() {
  const theme = useTheme()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => {
    setOpen(false)
  }, [])
  return <>
    <Tooltip title={t`main.playlist.new`} placement='left'>
    <IconButton
      sx={{
        bgcolor: alpha(theme.palette.tertiaryContainer.main, theme.palette.action.activatedOpacity),
      }}
      color={'tertiary' as 'primary'}
      size='small'
      onClick={() => setOpen(true)}
    >
      <AddCircleOutlineOutlinedIcon fontSize='small' />
    </IconButton>
    </Tooltip>
    <CreateDialog open={open} onClose={onClose} />
  </>
}

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {

  const theme = useTheme()
  const { refreshPlaylist } = useUserStore()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [playlist, setPlaylist] = useState({
    playlistName: '',
    playlistPrivate: false,
  })
  useEffect(() => {
    if (!open) {
      setPlaylist({
        playlistPrivate: false,
        playlistName: '',
      })
    }
    return () => {
      setPlaylist({
        playlistPrivate: false,
        playlistName: '',
      })
    }
  }, [open])

  async function createNewPlaylist() {
    try {
      await createPlaylist({
        name: playlist.playlistName,
        privacy: playlist.playlistPrivate ? 10 : 0,
      })
      enqueueSnackbar('创建成功', { variant: 'success' })
      refreshPlaylist()
      onClose()
    }
    catch (e) {
      enqueueSnackbar('something_wrong', { variant: 'error' })
    }
  }
  return <Dialog sx={{
    '& .MuiPaper-root': {
      borderRadius: 8,
    },
  }} open={open} onClose={onClose}>
    <Box className='pt-5 pb-4 px-2 flex flex-col' sx={{
      bgcolor: theme.palette.surfaceVariant.main,
      color: theme.palette.onSurfaceVariant.main,
      minWidth: 320,
    }}>
      <div className='flex flex-col items-center mb-4 gap-1'>
        <PlaylistAddIcon />
        <Typography variant='body1'>{t`main.playlist.new`}</Typography>
      </div>

      <div className='px-3'>
        <TextField className='w-full' variant='outlined'  label={t`main.playlist.name`} value={playlist.playlistName} onChange={(e: any) => {
          setPlaylist(state => ({
            ...state,
            playlistName: e.target.value,
          }))
        }} />
      </div>
      <div className='flex items-center'>
        <Checkbox checked={playlist.playlistPrivate} onChange={(_, val) => {
          setPlaylist(prevState => ({
            ...prevState,
            playlistPrivate: val,
          }))
        }} />
        <Typography variant='caption'>{t`main.playlist.private`}</Typography>
      </div>
      <div className='flex justify-end'>
        <Button variant='text' onClick={onClose}>{t`common.cancel`}</Button>
        <Button variant='text' onClick={createNewPlaylist}>{t`common.confirm`}</Button>
      </div>
    </Box>
  </Dialog>
}

function ArtistPanel() {
  const { data } = useUserArtists()
  return <GridRow>
    {
      data?.artists.map(art => <ArtistCover data={art} key={art.id} />)
    }
  </GridRow>
}
function PlaylistPanel() {
  const { t } = useTranslation()
  const { createdPlaylist, subscribePlaylist } = useMyPlaylist()
  return <div className='flex flex-col gap-4'>
    <Col title={t`main.nav.created_list`} variant='body1' more={<CreatePlaylist />}>
      <GridRow>
        {
          createdPlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </Col>
    <Col title={t`main.nav.start_list`} variant='body1'>
      <GridRow>
        {
          subscribePlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </Col>
  </div>
}
function AlbumPanel() {
  const { data } = useUserAlbums()
  return <GridRow>
    {
      data?.albums.map((al => (<Cover type='album' inset key={al.id} data={al} />)))
    }
  </GridRow>
}
function MVPanel() {
  const { data } = useUserMVs()
  return <GridRow rowType={GridType.B}>
    {
      data?.mvs.map((mv => (<VideoCover key={mv.vid} data={mv} />)))
    }
  </GridRow>
}

function FavCard() {
  const theme = useTheme()
  const { t } = useTranslation()
  const { likes, account } = useUserStore()
  const { favList } = useMyPlaylist()
  const { replaceQueueAndPlay } = useReplacePlayQueue()

  const [randomTracks, setRandomTracks] = useState<Track[]>()

  useEffect(() => {
    const tracks = sampleSize(likes, 3)
    if (tracks && tracks.length) {
      getSongData(tracks).then((res) => {
        setRandomTracks(res.songs)
      })
    }

    setRandomTracks([])
  }, [likes])
  async function handlePlayMyFav() {
    const _data = await getTrackList('playlist', favList.id)

    replaceQueueAndPlay(_data.tracks, favList.id, 'playlist', favList.name)
  }

  return <Card  className='flex flex-col col-span-3' variant='outlined' sx={{
    flex: 1,
    bgcolor: theme.palette.surfaceVariant.main,
    color: theme.palette.onSurfaceVariant.main,
    borderRadius: 4,
    // border: 'none',
    p: 2,
  }}>
    <div className='flex items-start flex-col'>
      <Typography
        component={Link}
        to={`/playlist/${favList?.id}`}
        variant='h5'>
        {account?.profile?.nickname} {t`main.discover.liked`}
      </Typography>
      <Typography variant='caption'>{t('common.list_count', { list_count: favList?.trackCount, play_count: formatNumber(favList?.playCount) })}</Typography>
     </div>
    <div className='flex justify-between items-end mt-auto'>
      <Button
        disableElevation
        color={'tertiaryContainer' as 'primary'}
        className='no-drag-area'
        variant="contained"
        sx={{
          height: 56,
          width: 56,
          borderRadius: 4,
          minWidth: 50,
        }}
        onClick={handlePlayMyFav}
      ><PlayArrowIcon color={'onTertiaryContainer' as 'primary'}/> </Button>
      <AlbumCovers tracks={randomTracks} />
    </div>
  </Card>
}

function Library() {
  const [currentTab, setCurrentTab] = useState('playlist')
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  return <PageTransition className='pr-2'>
    <div
      className='grid grid-cols-4 gap-4 mb-2'
    >

      <FavCard />
      <div className='grid grid-cols-1 grid-rows-4 gap-2 col-span-1'>
        <SwitchCard color={theme.palette.tertiaryContainer.main} title={t`main.ranking`} icon={<ThumbUpAltIcon fontSize='small' />} onChange={() => {
          navigate('/rank')
        }} />
        <SwitchCard color={theme.palette.secondaryContainer.main} title={t`main.disk`} icon={<AlbumIcon fontSize='small' />} onClick={() => {
          navigate('/cloud')
        }} />
        <SwitchCard color={theme.palette.errorContainer.main} title={t`common.recent`} icon={<HistoryIcon fontSize='small' />} onClick={() => {
          navigate('/recent')
        }} />
        <SwitchCard color={theme.palette.primaryContainer.main} title={t`main.podcast.my`}  icon={<PodcastsIcon fontSize='small' />} onClick={() => {
          navigate('/my_podcast')
        }} />
      </div>
    </div>
    <Box sx={{ color: theme.palette.onSurface.main }} className='h-full'>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
        tabs={[{
          value: 'playlist',
          label: t`main.playlists`,
        },
        { value: 'album', label: t`main.albums` },
        { value: 'artist', label: t`main.artists` },
        { value: 'mv', label: t`main.mvs` }]}/>
      <Box className='overflow-y-auto my-2 h-full hide-scrollbar'>
        {
          {
            artist: <ArtistPanel />,
            playlist: <PlaylistPanel />,
            album: <AlbumPanel />,
            mv: <MVPanel />,
          }[currentTab]
        }
      </Box>
    </Box>
  </PageTransition>
}

export default Library
