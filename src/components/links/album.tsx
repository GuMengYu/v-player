import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Album } from '@/types'

export default function AlbumLink({ album }: { album: Album[] | Album }) {
  const { t } = useTranslation()
  let albums = []
  if (Array.isArray(album))
    albums = album
  else
    albums = [album]

  return <span>
    {
      albums?.map((al, idx) => {
        if (al?.id && al?.name) {
          return <RouterLink
            key={al.id}
            to={`/album/${al.id}`}>
            {al.name}
            {idx !== albums.length - 1 ? ', ' : ''}
          </RouterLink>
        }
        else {
          return <span key={idx}>{t`common.unknown`}</span>
        }
      })
    }
  </span>
}
