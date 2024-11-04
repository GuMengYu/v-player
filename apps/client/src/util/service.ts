export type EasingFunction = (t: number) => number

const easingPatterns = {
  // linear
  linear: (t: number) => t,
  // accelerating from zero velocity
  easeInQuad: (t: number) => t ** 2,
  // decelerating to zero velocity
  easeOutQuad: (t: number) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t: number) => t ** 3,
  // decelerating to zero velocity
  easeOutCubic: (t: number) => (--t) ** 3 + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  // accelerating from zero velocity
  easeInQuart: (t: number) => t ** 4,
  // decelerating to zero velocity
  easeOutQuart: (t: number) => 1 - (--t) ** 4,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  // accelerating from zero velocity
  easeInQuint: (t: number) => t ** 5,
  // decelerating to zero velocity
  easeOutQuint: (t: number) => 1 + (--t) ** 5,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 + 16 * (--t) ** 5),
}
// 横向滚动
export function goto(container: HTMLElement, _options = {}) {
  const options = {
    offset: 0,
    duration: 500,
    ease: 'easeInOutCubic',
    ..._options,
  }
  const startTime = performance.now()
  const startLocation = container.scrollLeft

  const ease
    = typeof options.ease === 'function' ? options.ease : easingPatterns[options.ease as keyof typeof easingPatterns]
  const offset = options.offset
  return new Promise(resolve =>
    requestAnimationFrame(function step(currentTime) {
      const timeElapsed = currentTime - startTime
      const progress = Math.abs(options.duration ? Math.min(timeElapsed / options.duration, 1) : 1)
      container.scrollLeft = Math.floor(startLocation + offset * ease(progress))
      const clientWidth = container.clientWidth
      const reachRight = container.scrollLeft + clientWidth >= container.scrollWidth
      const reachLeft = container.scrollLeft <= 0 && offset < 0
      if (progress === 1 || reachRight || reachLeft)
        return resolve(offset)

      requestAnimationFrame(step)
    }),
  )
}
