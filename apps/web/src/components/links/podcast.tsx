import { isArray } from 'lodash'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Podcast } from '@/types'

export default function PodcastLink({ podcast }: { podcast: Podcast[] | Podcast }) {
  const { t } = useTranslation()
  let podcasts = []
  if (isArray(podcast))
    podcasts = podcast
  else
    podcasts = [podcast]

  return <span>
    {
      podcasts.map((item, idx) => {
        if (item?.id && item?.name) {
          return <RouterLink
            key={item.id}
            to={`/podcast/${item.id}`}>
            {item.name}
            {idx !== podcasts.length - 1 ? ', ' : ''}
          </RouterLink>
        }
        else {
          return <span key={idx}>{t`common.unknown`}</span>
        }
      })
    }
  </span>
}
