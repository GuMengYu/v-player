import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Wallpaper } from '@/types'

export enum PURITY {
  SFW = 'sfw',
  SKETCHY = 'sketchy',
  NSFW = 'nsfw',
}
export enum CATGORY {
  GENERAL = 'general',
  ANIME = 'anime',
  PEOPLE = 'people',
}
export enum SORTING {
  RANDOM = 'random',
  RELEVANCE = 'relevance',
  DATE_ADDED = 'date_added',
  VIEWS = 'views',
  FAVORITES = 'favorites',
  TOPLIST = 'toplist',
  HOT = 'hot',
}
export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
export enum TOPRANGE {
  LASTDAY = '1d',
  LAST_THREE_DAYS = '3d',
  LAST_WEEK = '1w',
  LAST_MONTH = '1M',
  LAST_THREE_MONTH = '3M',
  LAST_SIX_MONTH = '6M',
  LAST_YEAR = '1y',
}
export interface WallpaperState {
  wallpapers: Wallpaper[]
  currentIndex: number
  categories: CATGORY[]
  purity: PURITY[]
  sorting: SORTING
  order: ORDER
  topRange: TOPRANGE
  page: number
  apiKey: string | null
  brightness: number
  blur: number
  useTrackCover: boolean
  proxy: {
    open: boolean
    url: string
  }
}

export interface WallpaperAction {
  currentWallpaper: () => Wallpaper
  setWallpapers: (wallpapers: Wallpaper[]) => void
  setCurrentIndex: (currentIndex: number) => void
  setCategories: (categories: CATGORY[]) => void
  setPurity: (purity: PURITY[]) => void
  setSorting: (sorting: SORTING) => void
  setOrder: (order: ORDER) => void
  setTopRange: (topRange: TOPRANGE) => void
  setApiKey: (apiKey: string) => void
  setPage: (page: number) => void
  setBrightness: (brightness: number) => void
  setBlur: (blur: number) => void
  setUseTrackCover: (useTrackCover: boolean) => void
  setProxy: (proxy: WallpaperState['proxy']) => void
}

export const useWallpaperStore = create(persist<WallpaperState & WallpaperAction>((set, get) => {
  return {
    wallpapers: [],
    currentIndex: 0,
    categories: [CATGORY.GENERAL, CATGORY.ANIME, CATGORY.PEOPLE],
    purity: [PURITY.SFW, PURITY.SKETCHY],
    sorting: SORTING.TOPLIST,
    order: ORDER.DESC,
    topRange: TOPRANGE.LAST_WEEK,
    apiKey: '',
    page: 1,
    brightness: 60,
    blur: 50,
    useTrackCover: true,
    proxy: {
      open: false,
      url: 'http://127.0.0.1:7890',
    },
    setWallpapers: wallpapers => set({ wallpapers }),
    setCurrentIndex: currentIndex => set({ currentIndex }),
    setCategories: categories => set({ categories }),
    setPurity: purity => set({ purity }),
    setSorting: sorting => set({ sorting }),
    setOrder: order => set({ order }),
    setTopRange: topRange => set({ topRange }),
    setApiKey: apiKey => set({ apiKey }),
    setPage: page => set({ page }),
    setBrightness: brightness => set({ brightness }),
    setBlur: blur => set({ blur }),
    setUseTrackCover: useTrackCover => set({ useTrackCover }),
    setProxy: proxy => set({ proxy }),
    // actions
    currentWallpaper: () => {
      const { wallpapers, currentIndex } = get()
      return wallpapers[currentIndex]
    },
  }
}, {
  name: 'wallpaper',
  storage: createJSONStorage(() => localStorage),
}))
