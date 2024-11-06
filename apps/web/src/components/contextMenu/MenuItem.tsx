import { css, cx } from '@emotion/css'
import { useRef, useState } from 'react'

// import Icon from '../Icon'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { alpha, useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { ContextMenuItem } from './types'

function MenuItem({
  item,
  index,
  onClose,
  onSubmenuOpen,
  onSubmenuClose,
  className,
}: {
  item: ContextMenuItem
  index: number
  onClose: (e: MouseEvent) => void
  onSubmenuOpen: (props: { itemRect: DOMRect; index: number }) => void
  onSubmenuClose: () => void
  className?: string
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const [isHover, setIsHover] = useState(false)
  const theme = useTheme()
  if (item.type === 'divider') {
    return (
      <div className='my-1 h-px w-full px-3'>
        <div className={cx('h-full w-full', css({
          backgroundColor: theme.palette.divider,
        }))}></div>
      </div>
    )
  }

  return (
    <div
      ref={itemRef}
      onClick={(e) => {
        if (!item.onClick)
          return

        const event = e as unknown as MouseEvent
        item.onClick?.(event)
        onClose(event)
      }}
      onMouseOver={() => {
        setIsHover(true)
        if (item.type !== 'submenu')
          return

        onSubmenuOpen({
          itemRect: itemRef.current!.getBoundingClientRect(),
          index,
        })
      }}
      onMouseLeave={(e) => {
        setIsHover(false)
        const relatedTarget = e.relatedTarget as HTMLElement | null
        if (relatedTarget?.classList?.contains('submenu'))
          return

        onSubmenuClose()
      }}
      className={cx(
        'relative',
        className,
        `${item.type === 'submenu' ? 'cursor-default' : 'cursor-pointer'}`,
        css`
          padding-right: 9px;
          padding-left: 9px;
        `,
      )}
    >
      <div
        className={cx(
          'relative flex w-full items-center rounded-lg justify-between whitespace-nowrap p-2',
          css({
            transition: 'background-color .2s ease-in',
            backgroundColor: isHover
              ? alpha(
                theme.palette.surfaceVariant.main,
                theme.palette.action.activatedOpacity,
              )
              : '',
          }),
        )}
      >
        <Typography variant='body2'>{item.label}</Typography>
        {item.type === 'submenu' && (
          <>
            <ArrowRightIcon fontSize='small' className='relative -right-2' />

            {/* 将item变宽一点，避免移动鼠标时还没移动到submenu就关闭submenu了 */}
            <div
              className={cx(
                'absolute h-full',
                css`
                  left: -24px;
                  width: calc(100% + 48px);
                `,
              )}
            ></div>

            {/* 增加三角形，避免斜着移动到submenu时意外关闭菜单 */}
            <div className='absolute -bottom-6 -right-8 h-12 w-12 rotate-45'></div>
            <div className='absolute -right-8 -top-6 h-12 w-12 rotate-45'></div>
          </>
        )}
      </div>
    </div>
  )
}

export default MenuItem
