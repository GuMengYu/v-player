import { useQueryAlbums } from '@/pages/local/hooks/useQueryAlbum'
import GridRow from '@/components/GridRow'
import LocalCover from '@/pages/local/components/Cover'

export function LocalAlbumPanel() {
  const { data, isLoading } = useQueryAlbums()
  return <GridRow>
    {
      data?.albums.map(((al: any) => (<LocalCover type='album' key={al.id} data={al} />)))
    }
  </GridRow>
}
