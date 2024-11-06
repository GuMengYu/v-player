import { useCallback, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { getOpacity } from '@/App'

export default function useVirtualListScroll() {
  const appRef = useRef<HTMLDivElement>()
  const cacheOpacity = useRef(0)

  useEffect(() => {
    appRef.current = document.getElementById('app-container') as HTMLDivElement
    return () => {
      appRef.current && appRef.current.style.setProperty('--top-bar-opacity', '0')
    }
  }, [])

  const handleScroll = useCallback(throttle((e: any) => {
    const scrollTop = e.target.scrollTop
    const opacity = getOpacity(scrollTop, 36 + 56, 56)
    if (Number(cacheOpacity.current).toPrecision(2) !== Number(opacity).toPrecision(2)) {
      requestAnimationFrame(() => {
        appRef.current && appRef.current.style.setProperty('--top-bar-opacity', `${Number(opacity).toPrecision(2)}`)
      })
    }
    cacheOpacity.current = opacity
  }, 250, { trailing: true, leading: true }), [appRef])
  return {
    appRef,
    handleScroll,
  }
}
