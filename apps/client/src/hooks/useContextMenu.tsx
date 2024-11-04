import { useTheme } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import { useCallback } from 'react'
import BasicContextMenu from '@/components/contextMenu/BasicContextMenu'
import { ContextMenuItem } from '@/components/contextMenu/types'
import { ContextMenuType } from '@/types'

export function useContextMenu() {
  const theme = useTheme()
  const openContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, items: ContextMenuItem[], options?: ContextMenuType['options']) => {
    e.preventDefault()
    const cursorPosition = {
      x: e.clientX,
      y: e.clientY,
    }
    const root = ReactDOM.createRoot(document.getElementById('contextmenu-host'))
    root.render(<BasicContextMenu theme={theme} onClose={() => {
      root.unmount()
    }} items={items} target={e.target as HTMLElement} cursorPosition={cursorPosition} options={options} />)
  }, [theme])
  return {
    openContextMenu,
  }
}
