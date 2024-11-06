import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { Track } from '@/types'
import { personalFM } from '@/api/user'

export enum PLAY_MODE {
  NORMAL = 'normal',
  REPEAT = 'repeat',
  REPEAT_ONCE = 'repeatOnce',
}

export interface PlayerState {
  track: Track | null
  currentTime: number
  playMode: PLAY_MODE
  showPipLyric: boolean
  shuffle: boolean
  volume: number
  playing: boolean
  loadingTrack: boolean
  isCurrentFm: boolean
  fmTrack: null | Track
  fmList: Track[]
}

export interface PlayerAction {
  updatePersonalFmList: () => Promise<Track | undefined>
  setCurrentTime: (val: number) => void
  setPlayMode: (mode: PLAY_MODE) => void
  setShuffle: (val: boolean) => void
  setIsCurrentFm: (val: boolean) => void
  setShowPipLyric: (val: boolean) => void
}

export const usePlayerStore = create(subscribeWithSelector(persist<PlayerState & PlayerAction>((set, get) => {
  return {
    track: null,
    currentTime: 0,
    playMode: PLAY_MODE.REPEAT,
    shuffle: false,
    volume: 0.8,
    showPipLyric: false,
    playing: false,
    loadingTrack: false,
    isCurrentFm: false,
    fmTrack: null,
    fmList: [],
    setIsCurrentFm: val => (set({ isCurrentFm: val })),
    setCurrentTime: val => (set({ currentTime: val })),
    setPlayMode: playMode => (set({ playMode })),
    setShuffle: val => (set({ shuffle: val })),
    setShowPipLyric: val => (set({ showPipLyric: val })),
    async updatePersonalFmList() {
      // 已有的FM歌曲列表 （最多3首）
      const cacheList = [...get().fmList]
      let pop: Track | undefined
      // 只有一首歌曲时，需要接口拉去新数据
      if (cacheList.length <= 1) {
        const { data } = await personalFM()
        // 只有一首时，直接弹出最后一首，并用新数据替换fmList
        if (cacheList.length === 1) {
          pop = cacheList.shift()
        }
        else {
          // 先弹出，再更新fmList
          pop = data?.shift()
        }
        set(() => ({ fmList: data }))
        // this.fmList = data // 更新数据
      }
      else {
        pop = cacheList.shift()
        set(() => ({ fmList: cacheList }))
        // this.fmList = cacheList
      }
      if (pop)
        set({ fmTrack: pop })

      return pop
      // pop && (this.fmTrack = pop)
      // return this.fmTrack
    },
  }
}, {
  name: 'player',
  storage: createJSONStorage(() => localStorage),
})))
