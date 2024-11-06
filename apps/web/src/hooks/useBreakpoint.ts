import { createBreakpoint } from 'react-use'

export enum DisplayBreakpoint {
  'xxs' = 'xxs',
  'xs' = 'xs',
  'sm' = 'sm',
  'md' = 'md',
  'lg' = 'lg',
  'xl' = 'xl',
  'xll' = 'xll',
  'desktop4K' = 'desktop4K',
}

const breakpointsDefine = {
  xxs: 320,
  xs: 600,
  sm: 900,
  md: 1100,
  lg: 1504,
  xl: 1709,
  xll: 1912,
  desktop4K: 2116,
}
export function useSematicBreakPoint() {
  const useBreakpoints = createBreakpoint(breakpointsDefine)

  const breakname = useBreakpoints() as DisplayBreakpoint
  // const xxs = breakpoints.smaller('xxs')
  // const xs = breakpoints.between('xxs', 'xs')
  // const sm = breakpoints.between('xs', 'sm')
  // const md = breakpoints.between('sm', 'md')
  // const lg = breakpoints.between('md', 'lg')
  // const xl = breakpoints.between('lg', 'xl')
  // const xll = breakpoints.between('xl', 'xll')
  // const desktop4K = breakpoints.greater('xll')

  // const breakname = computed(() => {
  //   if (xxs.value) {
  //     return DisplayBreakpoint.xxs
  //   } else if (xs.value) {
  //     return DisplayBreakpoint.xs
  //   } else if (sm.value) {
  //     return DisplayBreakpoint.sm
  //   } else if (md.value) {
  //     return DisplayBreakpoint.md
  //   } else if (lg.value) {
  //     return DisplayBreakpoint.lg
  //   } else if (xl.value) {
  //     return DisplayBreakpoint.xl
  //   } else if (xll.value) {
  //     return DisplayBreakpoint.xll
  //   } else if (desktop4K.value) {
  //     return DisplayBreakpoint.desktop4K
  //   } else {
  //     return DisplayBreakpoint.lg
  //   }
  // })
  return {
    breakname,
    // xxs,
    // xs,
    // sm,
    // md,
    // lg,
    // xl,
    // xll,
    // desktop4K,
  }
}
