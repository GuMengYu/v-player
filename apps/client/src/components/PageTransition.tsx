import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

function PageTransition({ children, disableEnterAnimation, className }: {
  children: ReactNode
  disableEnterAnimation?: boolean
  className?: string
}) {
  // To restore scroll position
  // useLayoutEffect(() => {
  //   const main = document.querySelector('main')
  //   if (main) {
  //     main.scrollTop = scrollPositions.get(window.location.pathname) ?? 0
  //   }
  // }, [])

  return (
    <motion.div
      className={className}
      initial={{
        opacity: disableEnterAnimation ? 1 : 0,
        transform: disableEnterAnimation ? 'translateX(0px)' : 'translateX(20px)',
      }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      exit={{ opacity: 0, transform: 'translateX(-20px)' }}
      transition={{ duration: 0.3, ease: [0.42, 0.0, 0.58, 1.0] }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
