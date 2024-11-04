import Box from '@mui/material/Box'
import useQueryTrack from '@/pages/local/hooks/useQueryTrack'
import LocalTrackList from '@/pages/local/components/LocalTrackList'

export function LocalTracksPanel() {
  const { data, isLoading } = useQueryTrack()
  return <Box>
    <LocalTrackList tracks={data?.tracks}></LocalTrackList>
  </Box>
}
