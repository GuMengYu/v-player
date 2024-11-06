import { create } from 'zustand'

interface ToolTipState {
  queue: boolean
  play: boolean
}
interface ToolTipAction {
  toggleQueueToolTip: (val: boolean) => void
  togglePlayToolTip: (val: boolean) => void

}
export const useToolTipStore = create<ToolTipState & ToolTipAction>((set) => {
  return {
    queue: false,
    play: false,
    toggleQueueToolTip: val => set(state => ({ queue: val !== undefined ? val : !state.queue })),
    togglePlayToolTip: val => set(state => ({ play: val !== undefined ? val : !state.play })),
  }
})
