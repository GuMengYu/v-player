import { create } from 'zustand'
import { WindowState } from '@shared/types'

interface AppState {
  rail: boolean
  showLogin: boolean
  showSearch: boolean
  showProfile: boolean
  showQuick: boolean
  showNowPlaying: boolean
  showNowPlayingBar: boolean
  showNowPlayingList: boolean
  showComment: boolean
  windowState: WindowState
}
interface AppStateAction {
  toggleRail: () => void
  toggleLogin: (val?: boolean) => void
  toggleSearch: (val?: boolean) => void
  toggleProfile: (val?: boolean) => void
  toggleQuick: (val?: boolean) => void
  toggleNowPlaying: (val?: boolean) => void
  toggleNowPlayingBar: (val?: boolean) => void
  toggleNowPlayingList: (val?: boolean) => void
  toggleShowComment: (val?: boolean) => void
}
export const useAppStore = create<AppState & AppStateAction>((set) => {
  return {
    rail: false,
    showLogin: false,
    showSearch: false,
    showProfile: false,
    showQuick: false,
    showNowPlaying: false,
    showNowPlayingBar: false,
    showNowPlayingList: false,
    showComment: false,
    windowState: WindowState.NORMAL,
    toggleRail: () => set(state => ({ rail: !state.rail })),
    toggleLogin: val => set((state) => {
      return { showLogin: val !== undefined ? val : !state.showLogin }
    }),
    toggleSearch: val => set((state) => {
      return { showSearch: val !== undefined ? val : !state.showSearch }
    }),
    toggleProfile: val => set((state) => {
      return { showProfile: val !== undefined ? val : !state.showProfile }
    }),
    toggleQuick: val => set((state) => {
      return { showQuick: val !== undefined ? val : !state.showQuick }
    }),
    toggleNowPlaying: val => set((state) => {
      return { showNowPlaying: val !== undefined ? val : !state.showNowPlaying }
    }),
    toggleNowPlayingBar: val => set((state) => {
      return { showNowPlayingBar: val !== undefined ? val : !state.showNowPlayingBar }
    }),
    toggleNowPlayingList: val => set((state) => {
      return { showNowPlayingList: val !== undefined ? val : !state.showNowPlayingList }
    }),
    toggleShowComment: val => set((state) => {
      return { showComment: val !== undefined ? val : !state.showComment }
    }),
  }
})
