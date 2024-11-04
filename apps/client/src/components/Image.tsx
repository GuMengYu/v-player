import { cx } from '@emotion/css'
import { useAnimate } from 'framer-motion'
import { memo, useEffect, useState } from 'react'

const ease = [0.4, 0, 0.2, 1]
interface Props {
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  src?: string
  srcSet?: string
  sizes?: string
  className?: string
  lazyLoad?: boolean
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
  onMouseOver?: (e: React.MouseEvent<HTMLImageElement>) => void
  gradient?: string
}

function Image({
  fit,
  src,
  srcSet,
  className,
  lazyLoad = true,
  sizes,
  onClick,
  onMouseOver,
  gradient,
}: Props) {
  const [error, setError] = useState(false)
  const [imageScope, animate] = useAnimate()
  const [placeholderScope, placeholderAnimate] = useAnimate()
  useEffect(() => setError(false), [src])

  const onLoad = async () => {
    animate(imageScope.current, { opacity: 1 }, { duration: 0.5 })
    placeholderAnimate(placeholderScope.current, { opacity: 0 }, { duration: 0.5 })
  }
  const onError = () => {
    setError(true)
  }
  return (
    <div
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={cx(
        'overflow-hidden',
        'h-full',
        'w-full',
        'relative',
        className,
      )}
    >
      {/* Image */}
      <img
        ref={imageScope}
        // className='absolute inset-0 h-full w-full'
        style={{
          height: '100%',
          width: '100%',
          objectFit: fit,
          opacity: 0,
        }}
        alt='cover image'
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        decoding="async"
        loading={lazyLoad ? 'lazy' : undefined}
        onError={onError}
        onLoad={onLoad}
      />

      {/* Placeholder / Error fallback */}
      <div
        ref={placeholderScope}
        style={{
          opacity: 1,
        }}
        className="absolute inset-0 h-full w-full bg-white dark:bg-white/10"
      ></div>
      {
        gradient && (
          <div className="absolute inset-0 h-full w-full" style={{
            backgroundImage: gradient,
          }}></div>
        )
      }
    </div>
  )
}

export default memo(Image)
