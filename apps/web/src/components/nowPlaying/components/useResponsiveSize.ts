import { useMemo } from 'react'
import { useSematicBreakPoint } from '@/hooks/useBreakpoint'

export default function useResponsiveSize() {
  const { breakname } = useSematicBreakPoint()

  const responsiveSize = useMemo(() => {
    return {
      xxs: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',
        radius: 20,
        padding: 4,
        lyricPadding: 2,
      },
      xs: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',
        radius: 20,
        padding: 4,
        lyricPadding: 2,
      },
      sm: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',
        radius: 20,
        padding: 4,
        lyricPadding: 2,
      },
      md: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',
        radius: 20,
        padding: 4,
        lyricPadding: 2,

      },
      lg: {
        button: 64,
        icon: 30,
        titleVariant: 'h4',
        subtitleVariant: 'body1',
        radius: 24,
        padding: 6,
        lyricPadding: 3,

      },
      xl: {
        button: 64,
        icon: 30,
        titleVariant: 'h4',
        subtitleVariant: 'body1',
        radius: 24,
        padding: 8,
        lyricPadding: 3,

      },
      xll: {
        button: 72,
        icon: 32,
        titleVariant: 'h4',
        subtitleVariant: 'body1',
        radius: 28,
        padding: 8,
        lyricPadding: 4,

      },
      desktop4K: {
        button: 80,
        icon: 36,
        titleVariant: 'h3',
        subtitleVariant: 'h6',
        radius: 30,
        padding: 10,
        lyricPadding: 4,
      },
    }[breakname]
  }, [breakname])

  return {
    responsiveSize,
  }
}
