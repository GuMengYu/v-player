import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  Typography, styled, useTheme,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Close,
  EditRounded,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Md3Dialog from '../modal/Md3Dialog'
import { getLocalFolders, openPath } from '../local/api/local'
import FolderIcon from '@mui/icons-material/Folder'
import SearchIcon from '@mui/icons-material/Search'
import ListItemText from '@mui/material/ListItemText'


function FolderSelectDialog({open, onClose, onSelect}: {
  open: boolean,
  onClose: () => void,
  onSelect: (path: string) => void,
}) {
 
  const theme = useTheme()
  const { t } = useTranslation()
  const [folders, setFolders] = useState([])
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    if (!open) {
      return
    }
    setSelected(null)
    getLocalFolders().then((res) => {
      setFolders(res)
    })
  }, [open])
 
  function handleClose() {
    onClose()
  }
  function handleConfirm() {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }
  
  return (
    <Dialog
    sx={{
      '& .MuiPaper-root': {
        borderRadius: 6,
      }
    }}
    open={open} onClose={handleClose}>
      <Card 
        sx={{
          maxWidth: 420,
          bgcolor: theme.palette.surfaceVariant.main,
          color: theme.palette.onSurfaceVariant.main,
        }}
      >
        <CardContent
         sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
        >
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">添加文件夹</Typography>
           
          </Box>
           
        <List sx={{ py: 0, maxHeight: '60vh', overflow: 'auto' }}>
            {
              folders.map((folder) => {
                return <FolderItem selected={selected === folder['path']} key={folder['path']} folder={folder} onClick={() => setSelected(folder['path'])}></FolderItem>
              })
            }
        </List>
          
        </CardContent>
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button variant='text' onClick={handleClose}>{t`common.cancel`}</Button>
          <Button variant='text' onClick={handleConfirm}>{t`common.confirm`}</Button>
        </CardActions>
       
      </Card>
    </Dialog>
  )
}

function FolderItem({ folder, onClick, selected }: { folder: any; onClick?: () => void; selected?: boolean }) {
  const [isHovering, setIsHovering] = useState(false)
  const theme = useTheme()

  const StyledListItem = styled(ListItem)(() => ({
    'cursor': 'pointer',
    'gap': 4,
    borderRadius: 4,
    'padding-left': 8,
    backgroundColor: selected ? theme.palette.secondaryContainer.main : 'inherit',
    '&:hover': {
      backgroundColor: theme.palette.secondaryContainer.main,
      borderColor: theme.palette.primary.main,
    },
  }))

  const openFolder = useCallback(async () => {
    await openPath(folder.path)
  }, [folder])

  return <StyledListItem
    onClick={onClick}
    className='gap-2' dense onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    <FolderIcon/>
    <ListItemText className='line-clamp-1' primary={folder['path']}></ListItemText>
    {
      isHovering && <IconButton sx={{ padding: 0 }} size='small' onClick={openFolder}><SearchIcon/></IconButton>

    }
  </StyledListItem>
}

export default FolderSelectDialog
