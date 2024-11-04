import { useSnackbar } from 'notistack'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { wallpapers as searchWallpaper } from '@/api/other'
import { CATGORY, PURITY, SORTING, useWallpaperStore } from '@/store/wallpaper'

export function useWallpapers() {
  const { enqueueSnackbar } = useSnackbar()

  const [meta, setMeta] = useState<{
    current_page: number
    last_page: number
    per_page: number
    total: number
  }>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  })
  // const loading = ref(false)
  // const error = ref<unknown>()
  // const reset = ref(false)

  const {
    categories,
    purity,
    sorting,
    order,
    topRange,
    wallpapers,
    page,
    proxy,
    apiKey,
    setWallpapers,
  } = useWallpaperStore()

  const cats = useMemo(() => {
    return `${categories.includes(CATGORY.GENERAL) ? 1 : 0}${categories.includes(CATGORY.ANIME) ? 1 : 0}${
      categories.includes(CATGORY.PEOPLE) ? 1 : 0
    }`
  }, [categories])
  const purities = useMemo(() => {
    return `${purity.includes(PURITY.SFW) ? 1 : 0}${purity.includes(PURITY.SKETCHY) ? 1 : 0}${
      purity.includes(PURITY.NSFW) ? 1 : 0
    }`
  }, [purity])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['wallpapers', cats, purities, sorting, order, page, topRange, apiKey],
    queryFn: async () => {
      const params: Record<string, any> = {
        categories: cats,
        purity: purities,
        sorting,
        order,
        page,
      }
      if (sorting === SORTING.TOPLIST)
        params.topRange = topRange

      if (apiKey)
        params.apikey = apiKey

      if (proxy.open && proxy.url)
        params.proxy = proxy.url

      const { data, meta: _meta } = await searchWallpaper(params as any)
      return { wallpapers: data, meta }
    },
    staleTime: 5 * 60 * 1000,
  })
  useEffect(() => {
    if (data) {
      setWallpapers(data.wallpapers)
      setMeta(data.meta)
    }
  }, [data])
  useEffect(() => {
    refetch()
  }, [cats, purities, sorting, order, page])

  // if (isRef(page)) {
  //   watchEffect(doFetch)
  // } else {
  //   doFetch()
  // }
  return {
    wallpapers,
    meta,
    isLoading,
  }
}
