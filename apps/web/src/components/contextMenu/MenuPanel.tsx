import { css, cx } from '@emotion/css'
import { ForwardedRef, forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { alpha, useTheme } from '@mui/material/styles'
import MenuItem from './MenuItem'
import { ContextMenuItem, ContextMenuPosition } from './types'

interface PanelProps {
  position: ContextMenuPosition
  items: ContextMenuItem[]
  onClose: (e: MouseEvent) => void
  forMeasure?: boolean
  classNames?: string
  isSubmenu?: boolean
}

interface SubmenuProps {
  itemRect: DOMRect
  index: number
}

const MenuPanel = forwardRef(
  (
    { position, items, onClose, forMeasure, classNames, isSubmenu }: PanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [submenuProps, setSubmenuProps] = useState<SubmenuProps | null>(null)
    const theme = useTheme()
    return (
      // Container (to add padding for submenus)
      <div
        ref={ref}
        className={cx(
          'no-drag-area fixed select-none',
          isSubmenu ? 'submenu z-30 px-1' : 'z-20',
        )}
        style={{ left: position.x, top: position.y, zIndex: theme.zIndex.modal + (isSubmenu ? 2 : 1) }}
      >
        {/* The real panel */}
        <motion.div
          initial={{ opacity: 0, scale: forMeasure ? 1 : 0.86 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.15,
            },
          }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={cx(
            'rounded-lg  py-2.5',
            css({
              boxShadow: theme.shadows[12],
              minWidth: '180px',
              backgroundColor: theme.palette.surface.main,
              color: theme.palette.onSurface.main,
              outlineStyle: 'solid',
              outlineColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
              outlineWidth: 1,
            }),
            classNames,
            position.transformOrigin || 'origin-top-left',
          )}
        >
          {items.map((item, index) => (
            <MenuItem
              key={index}
              index={index}
              item={item}
              onClose={onClose}
              onSubmenuOpen={(props: SubmenuProps) => setSubmenuProps(props)}
              onSubmenuClose={() => setSubmenuProps(null)}
              className={isSubmenu ? 'submenu' : ''}
            />
          ))}
        </motion.div>

        {/* Submenu */}
        <SubMenu
          items={submenuProps?.index ? items[submenuProps?.index]?.items : undefined}
          itemRect={submenuProps?.itemRect}
          onClose={onClose}
        />
      </div>
    )
  },
)
MenuPanel.displayName = 'Menu'

export default MenuPanel

function SubMenu({
  items,
  itemRect,
  onClose,
}: {
  items?: ContextMenuItem[]
  itemRect?: DOMRect
  onClose: (e: MouseEvent) => void
}) {
  const submenuRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState<{
    x: number
    y: number
    transformOrigin: `origin-${'top' | 'bottom'}-${'left' | 'right'}`
  }>()
  useLayoutEffect(() => {
    if (!itemRect || !submenuRef.current)
      return

    const item = itemRect
    const submenu = submenuRef.current.getBoundingClientRect()

    const isRightSide = item.x + item.width + submenu.width <= window.innerWidth
    const x = isRightSide ? item.x + item.width : item.x - submenu.width

    const isTopSide = item.y - 10 + submenu.height <= window.innerHeight
    const y = isTopSide ? item.y - 10 : item.y + item.height + 10 - submenu.height

    // console.log(x, y, submenu.height)
    // //  overflow top
    // if (y < 0) {
    //   // y = 0
    //   const maxHeight = submenu.height + y
    //   submenuRef.current.style.maxHeight = `${maxHeight}px`
    //   submenuRef.current.style.overflowY = 'auto'
    //   y = 0
    // }

    const transformOriginTable = {
      top: {
        right: 'origin-top-left',
        left: 'origin-top-right',
      },
      bottom: {
        right: 'origin-bottom-left',
        left: 'origin-bottom-right',
      },
    } as const

    setPosition({
      x,
      y,
      transformOrigin:
        transformOriginTable[isTopSide ? 'top' : 'bottom'][isRightSide ? 'right' : 'left'],
    })
  }, [itemRect])

  if (!items || !itemRect)
    return <></>

  return (
    <>
      <MenuPanel
        position={{ x: 99999, y: 99999 }}
        items={items || []}
        ref={submenuRef}
        onClose={() => {
          // Do nothing
        }}
        forMeasure={true}
        isSubmenu={true}
      />
      <MenuPanel
        position={position || { x: 99999, y: 99999 }}
        items={items || []}
        onClose={onClose}
        isSubmenu={true}
      />
    </>
  )
}
