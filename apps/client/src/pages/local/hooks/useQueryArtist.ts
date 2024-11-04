import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'

export interface LocalArtist {
  name: string
  avatar: string
}
export default function useQueryArtist() {
  const { data, isLoading } = useQuery(['local', 'artists'], async () => {
    const artists = await ipcRenderer.invoke('artist/all-artists') as LocalArtist[]
    return {
      artists,
    }
  }, {
    staleTime: 5 * 1000 * 60,
  })
  return {
    data,
    isLoading,
  }
}
