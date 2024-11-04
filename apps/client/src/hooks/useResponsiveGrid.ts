// import { DisplayBreakpoint, useSematicBreakPoint } from './useBreakpoint'

import { useEffect, useState } from 'react'
import { DisplayBreakpoint, useSematicBreakPoint } from './useBreakpoint'

export enum GridType {
  A,
  B,
  C,
  D,
}

const GridTypeToGap = {
  [GridType.A]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '8px' },
    [DisplayBreakpoint.xs]: { columnCount: 3, gap: '8px' },
    [DisplayBreakpoint.sm]: { columnCount: 4, gap: '16px' },
    [DisplayBreakpoint.md]: { columnCount: 4, gap: '16px' },
    [DisplayBreakpoint.lg]: { columnCount: 6, gap: '16px' },
    [DisplayBreakpoint.xl]: { columnCount: 7, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 7, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 8, gap: '24px' },
  },
  [GridType.B]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '8px' },
    [DisplayBreakpoint.xs]: { columnCount: 2, gap: '8px' },
    [DisplayBreakpoint.sm]: { columnCount: 3, gap: '16px' },
    [DisplayBreakpoint.md]: { columnCount: 4, gap: '16px' },
    [DisplayBreakpoint.lg]: { columnCount: 4, gap: '16px' },
    [DisplayBreakpoint.xl]: { columnCount: 5, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 6, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 6, gap: '24px' },
  },
  [GridType.C]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.xs]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.sm]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.md]: { columnCount: 1, gap: '12px' },
    [DisplayBreakpoint.lg]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.xl]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.xll]: { columnCount: 2, gap: '24px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 2, gap: '24px' },
  },
  [GridType.D]: {
    [DisplayBreakpoint.xxs]: { columnCount: 1, gap: '4px' },
    [DisplayBreakpoint.xs]: { columnCount: 2, gap: '4px' },
    [DisplayBreakpoint.sm]: { columnCount: 3, gap: '8px' },
    [DisplayBreakpoint.md]: { columnCount: 4, gap: '8px' },
    [DisplayBreakpoint.lg]: { columnCount: 4, gap: '8px' },
    [DisplayBreakpoint.xl]: { columnCount: 5, gap: '12px' },
    [DisplayBreakpoint.xll]: { columnCount: 6, gap: '12px' },
    [DisplayBreakpoint.desktop4K]: { columnCount: 6, gap: '12px' },
  },
}
export function useResponsiveGrid(type: GridType) {
  const { breakname } = useSematicBreakPoint()
  const [count, setCount] = useState(1)
  const [gap, setGap] = useState('12px')
  useEffect(() => {
    const { columnCount, gap: gapValue } = GridTypeToGap[type][breakname]
    setCount(columnCount)
    setGap(gapValue)
  }, [breakname])
  return {
    count,
    gap,
  }
}
