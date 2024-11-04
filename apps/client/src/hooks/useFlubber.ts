import { interpolate } from 'flubber'
import { MotionValue, useTransform } from 'framer-motion'

export const getIndex = (_: any, index: number) => index

export function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  })
}
