// import { useResizeObserver } from '@vueuse/core'
// import { computed } from 'vue'
import { useEffect, useMemo, useState } from 'react'

export function useElementScrollSize(el: HTMLElement | null | undefined) {
  const [scrollWidth, setScrollWidth] = useState(0)
  const [clientWidth, setClientWidth] = useState(0)

  useEffect(() => {
    if (!el)
      return
    updateData()
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === el)
          updateData()
      })
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [el])

  function updateData() {
    if (!el)
      return
    const { scrollWidth, clientWidth } = el
    setScrollWidth(scrollWidth)
    setClientWidth(clientWidth)
  }

  const willScroll = useMemo(() => {
    return scrollWidth > clientWidth
  }, [scrollWidth, clientWidth])

  return {
    scrollWidth,
    clientWidth,
    willScroll,
  }
}
