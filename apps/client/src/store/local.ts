import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getPlayList } from '@/pages/local/api/playlist'
import { getLikedTracks, toggleTrackLike } from '@/pages/local/api/liked'

interface RootState {
  autoSync: boolean
  playlist: []
  likes: number[]
}
interface SettingAction {
  setAutoSync: (isAuto: boolean) => void
  setPlaylist: (playlist: []) => void
  refreshPlaylist: () => void
  refreshLikes: () => void
  likeSong: (id: number, liked: boolean) => Promise<boolean>
  setLikes: (likes: []) => void
}
export const useLocalStore = create(persist<RootState & SettingAction>((set, get) => {
  return {
    autoSync: false,
    playlist: [],
    likes:[],
    setAutoSync: autoSync => set({ autoSync }),
    setPlaylist: playlist => set({ playlist }),
    async refreshPlaylist() {
      const playlist = await getPlayList()
      set({ playlist })
      return playlist
    },
    setLikes: likes => set({ likes }),
    async refreshLikes() {
      const res = await getLikedTracks()
      set({
        likes: res.data.map(i => i.id),
      })
    },
    async likeSong(id: number, like: boolean) {
      let likes = get().likes
      try {
        await toggleTrackLike(id, like)
        if (like)
          likes.push(id)
        else
          likes = likes.filter(i => i !== id)

        set({
          likes,
        })
        return true
      }
      catch (e) {
        return false
      }
    },
  }
}, {
  name: 'local',
  storage: createJSONStorage(() => localStorage),
}))
