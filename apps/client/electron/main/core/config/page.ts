import { app } from 'electron'

import store from '../util/store'

export interface PageOption {
  width: number
  height: number
  minWidth: number
  minHeight: number
  bindCloseToHide?: boolean
  url: string
}
export type Pages = 'index' | 'minimal'
const IndexUrl = app.isPackaged
  ? `http://127.0.0.1:${import.meta.env.VITE_CLIENT_PORT}`
  : process.env.VITE_DEV_SERVER_URL

let storeSize: {
  width: number
  height: number

} = {
  width: 1000,
  height: 670,
}
initWindowSize()
function initWindowSize() {
  const size = store.get('windowSize')
  if (size) {
    try {
      storeSize = store.get('windowSize')
    }
    catch (e) {
      console.log(e)
    }
  }
}
export default {
  index: {
    width: storeSize.width,
    height: storeSize.height,
    minWidth: 144,
    minHeight: 144,
    bindCloseToHide: true,
    url: `${IndexUrl}`,
  },
  // minimal: {
  //   width: 300,
  //   height: 300,
  //   minWidth: 256,
  //   minHeight: 256,
  //   url: `${IndexUrl}/minimal`,
  // },
} as Record<Pages, PageOption>
