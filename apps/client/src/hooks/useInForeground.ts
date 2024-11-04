import { useMatches } from 'react-router-dom'
import { useMemo } from 'react'

/**
 * 当前页面是否处于活跃状态
 */
export default function useInForeground(name: string | string[]) {
  const matches = useMatches()
  const isActive = useMemo(() => {
    const match = matches[matches.length - 1]
    return typeof name === 'string' ? name === match.id : name.includes(<string>match.id)
  }, [matches])

  return {
    isActive,
    matches,
  }
}
