import { css, cx, keyframes } from '@emotion/css'
import { useTheme } from '@mui/material'

const wave = keyframes`
    0% { transform: scaleY(1) }
    50% { transform: scaleY(0.2) }
    100% { transform: scaleY(1)}
  `
const animation = css`
  transform-origin: bottom;
  animation: ${wave} 1s ease-in-out infinite;
`
const delay = ['-100ms', '-500ms', '-1200ms', '-1000ms', '-700ms']

function Wave({ animate }: { animate: boolean }) {
  const theme = useTheme()
  return (
    <div className='grid h-3 flex-shrink-0 grid-cols-5 items-end gap-0.5'>
      {[...Array.from({ length: 5 }).keys()].map(i => (
        <div
          key={i}
          className={cx('h-full w-0.5', animation)}
          style={{
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            animationDelay: delay[i],
            animationPlayState: animate ? 'running' : 'paused',
          }}
        ></div>
      ))}
    </div>
  )
}

export default Wave
