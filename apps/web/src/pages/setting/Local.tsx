import { Box, Button, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useQuery } from '@tanstack/react-query'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ClearIcon from '@mui/icons-material/Clear'
import FolderIcon from '@mui/icons-material/Folder'
import SyncIcon from '@mui/icons-material/Sync'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalStore } from '@/store/local'
import Col from '@/components/Col'
import PageTransition from '@/components/PageTransition'
import { addFolder, allFolder, indexing, openPath, removeFolder } from '../local/api/local'

function FolderItem({ folder, onRemove }: { folder: any; onRemove: (id: number) => void }) {
  const [isHovering, setIsHovering] = useState(false)

  const openFolder = useCallback(async () => {
    await openPath(folder.path)
  }, [folder])

  return <ListItem
    onClick={openFolder}
    className='gap-2 cursor-pointer' dense onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    <FolderIcon/>
    <ListItemText primary={folder['path']}></ListItemText>
    {
      isHovering && <IconButton sx={{ padding: 0 }} size='small' onClick={() => onRemove(folder['folderId'])}><ClearIcon/></IconButton>

    }
  </ListItem>
}
export default function Local() {
  const { autoSync, setAutoSync } = useLocalStore()
  const { t } = useTranslation()
  const { data: foldersRes, refetch } = useQuery(['local', 'folders'], async () => {
    return await allFolder()
  })
  async function handleAdd() {
    // const openDialogReturnValue = await dialog.showOpenDialog({
    //   title: '选择文件夹',
    //   properties: ['openDirectory'],
    // })
    // if (openDialogReturnValue?.filePaths?.length) {
    //   const path = openDialogReturnValue?.filePaths[0]
    //   await addFolder(path)
    //   await refetch()
    // }
  }
  async function handleSync() {
    await indexing()
  }
  const handleRemove = useCallback(async (folderId: number) => {
    await removeFolder(folderId)
    await refetch()
  }, [])
  return <PageTransition>
    <Box className='flex flex-col gap-4 pr-2'>
        <div className='mb-3'>
          <Typography variant='subtitle1'>{t`common.local`}</Typography>
        </div>
        <Col variant='caption' title='文件夹' more={
          <Button sx={{ ml: 'auto' }} size='small' onClick={handleAdd}><AddIcon fontSize='small'/>添加文件夹</Button>
        }>
          <List sx={{ py: 0 }}>
            {
              foldersRes?.folders.map((folder) => {
                return <FolderItem key={folder['folderId']} folder={folder} onRemove={handleRemove}></FolderItem>
              })
            }
          </List>
        </Col>
        <Col variant='caption' title='刷新'>
          <Button variant='contained' size='small' onClick={handleSync}><SyncIcon fontSize='small'/>立即刷新</Button>
        </Col>
    </Box>
  </PageTransition>
}
