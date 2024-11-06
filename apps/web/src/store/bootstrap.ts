import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useUserStore } from './user'
import { useLocalStore } from './local'

dayjs.extend(localizedFormat)

export default async function () {
  useUserStore.getState().fetchAccount()
  useLocalStore.getState().refreshPlaylist()
  useLocalStore.getState().refreshLikes()
}
