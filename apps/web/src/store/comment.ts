import { create } from 'zustand'

export type CommentType = 'playlist' | 'mv' | 'music' | 'album' | null

interface CommentState {
  id: number | null
  type: CommentType
  open: boolean
}
interface CommentStateAction {
  showComment: (id: number, type: CommentType) => void
  closeComment: () => void
}
export const useCommentStore = create<CommentState & CommentStateAction>((set) => {
  return {
    open: false,
    id: null,
    type: null,
    showComment: (id, type) => set((state) => {
      return {
        open: true,
        id,
        type,
      }
    }),
    closeComment: () => set({ open: false, id: null, type: null }),
  }
})
