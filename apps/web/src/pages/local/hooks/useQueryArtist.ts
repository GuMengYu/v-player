import { useQuery } from '@tanstack/react-query'
import { getAllArtists } from '../api/local'

export interface LocalArtist {
  name: string
  avatar: string
}
export default function useQueryArtist() {
  const { data, isLoading } = useQuery(['local', 'artists'], async () => {
    const artists = await getAllArtists() as LocalArtist[]
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
