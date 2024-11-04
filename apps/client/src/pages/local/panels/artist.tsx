import useQueryArtist from '@/pages/local/hooks/useQueryArtist'
import GridRow from '@/components/GridRow'
import LocalArtistCover from '@/pages/local/components/ArtistCover'


export function LocalArtistPanel() {
  const { data, isLoading } = useQueryArtist()
  return <GridRow>
    {
      data?.artists.map((artist => (<LocalArtistCover key={artist.name} data={artist} />)))
    }
  </GridRow>
}
