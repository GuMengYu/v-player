import type { Wallpaper } from '@/types'
import { request } from '@/util/fetch'

export interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  query: any
  seed: any
}
export function wallpapers(params = {
  categories: 110,
  purity: 110,
  sorting: 'toplist',
  order: 'desc',
  topRange: '1w',
  page: 1,
}) {
  return request<{
    code: number
    data: {
      data: Wallpaper[]
      meta: Meta
    }
  }>('/wallhaven/search', {
    params,
  }).then(({ data }) => data)
}
