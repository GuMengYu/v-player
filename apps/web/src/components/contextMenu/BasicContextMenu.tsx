/**
 * @credit https://github.com/qier222/YesPlayMusic/tree/new-design/packages/web/components/ContextMenus
 */
import { useLayoutEffect, useRef, useState } from 'react'
import { useClickAway } from 'react-use'

// import useLockMainScroll from '@/web/hooks/useLockMainScroll'
import useMeasure from 'react-use-measure'
import { createPortal } from 'react-dom'
import { ThemeProvider } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { ContextMenuItem, ContextMenuPosition } from './types'
import MenuPanel from './MenuPanel'

function BasicContextMenu({
  onClose,
  items,
  target,
  cursorPosition,
  options,
  classNames,
  theme,
}: {
  onClose: (e: MouseEvent) => void
  items: ContextMenuItem[]
  target: HTMLElement
  cursorPosition: { x: number; y: number }
  options?: {
    useCursorPosition?: boolean
    fixedPosition?: `${'top' | 'bottom'}-${'left' | 'right'}`
  } | null
  classNames?: string
  theme?: Theme
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [measureRef, menu] = useMeasure()

  const [position, setPosition] = useState<ContextMenuPosition | null>(null)

  useClickAway(menuRef, onClose)
  // useLockMainScroll(!!position)

  useLayoutEffect(() => {
    if (options?.useCursorPosition) {
      const leftX = cursorPosition.x
      const rightX = cursorPosition.x - menu.width
      const bottomY = cursorPosition.y
      const topY = cursorPosition.y - menu.height
      const position = {
        x: leftX + menu.width < window.innerWidth ? leftX : rightX,
        y: bottomY + menu.height < window.innerHeight ? bottomY : topY,
      }
      setPosition(position)
    }
    else if (options?.fixedPosition) {
      const [vertical, horizontal] = options.fixedPosition.split('-') as [
        'top' | 'bottom',
        'left' | 'right',
      ]
      const button = target.getBoundingClientRect()
      const leftX = button.x
      const rightX = button.x - menu.width + button.width
      const bottomY = button.y + button.height + 8
      const topY = button.y - menu.height - 8
      const position: ContextMenuPosition = {
        x: horizontal === 'left' ? leftX : rightX,
        y: vertical === 'bottom' ? bottomY : topY,
        transformOrigin: `origin-${options.fixedPosition}`,
      }
      setPosition(position)
    }
    else {
      const button = target.getBoundingClientRect()
      const leftX = button.x
      const rightX = button.x - menu.width + button.width
      const bottomY = button.y + button.height + 8
      const topY = button.y - menu.height - 8
      const position = {
        x: leftX + menu.width < window.innerWidth ? leftX : rightX,
        y: bottomY + menu.height < window.innerHeight ? bottomY : topY,
      }
      setPosition(position)
    }
  }, [target, menu, options?.useCursorPosition, cursorPosition])

  return createPortal(
    <ThemeProvider theme={theme}>
      <MenuPanel
        position={{ x: 99999, y: 99999 }}
        items={items}
        ref={measureRef}
        onClose={() => {
          //
        }}
        forMeasure={true}
        classNames={classNames}
      />
      {position && (
        <MenuPanel
          position={position}
          items={items}
          ref={menuRef}
          onClose={onClose}
          classNames={classNames}
        />
      )}
    </ThemeProvider>,
    document.body,
  )
}

export default BasicContextMenu
