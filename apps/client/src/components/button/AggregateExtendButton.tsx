import { Button } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import useInForeground from '@/hooks/useInForeground'
import { ReloadIcon } from '@/components/icons/icons'

export default function AggregateExtendButton() {
  const navigate = useNavigate()
  const { isActive: needBack } = useInForeground([
    'podcast',
    'playlist',
    'album',
    'artist',
    'search',
    'video',
    'daily',
    'recent',
    'setting',
    'local-album',
    'local-artist',
    'local-playlist',
    'local-liked',
    'moods_and_genres',
    'moods_and_genres_detail',
    'list_collection',
    'cloud',
    'rank',
    'recent',
    'my_podcast',
    'podcast_detail',
    'podcast_genres',
  ])

  function back() {
    navigate(-1)
  }

  function reload() {
    location.reload()
  }

  return <Button
    color={'primaryContainer' as 'primary'}
    className='no-drag-area'
    variant="contained"
    sx={{
      height: 50,
      width: 50,
      borderRadius: 3.5,
      minWidth: 50,
    }}
    onClick={() => needBack ? back() : reload()}
  >
    {
      needBack ? <ArrowBackIcon/> : <ReloadIcon color={'onPrimaryContainer' as 'primary'}/>
    }
  </Button>
}
