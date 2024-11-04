import type { DialogProps } from '@mui/material'
import { Dialog, styled } from '@mui/material'
import { memo } from 'react'

function Md3Dialog(props: DialogProps) {
  const MdDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 24,
    },
  }))

  return <MdDialog {...props}>
    {props.children}
  </MdDialog>
}

export default memo(Md3Dialog)
