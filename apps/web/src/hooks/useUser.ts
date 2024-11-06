import { useMemo } from 'react'
import { useUserStore } from '@/store/user'

export default function useUser() {
  const { account } = useUserStore()
  const logged = useMemo(() => {
    return !!account?.profile?.userId
  }, [account])
  const isVip = useMemo(() => account?.profile?.vipType === 11, [account])


  return {
    isVip,
    logged,
    profile: account?.profile,
    vipInfo: account?.vipInfo,
  }
}
