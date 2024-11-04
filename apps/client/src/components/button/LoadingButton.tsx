import type { IconButtonProps } from '@mui/material'
import { Box, CircularProgress, IconButton } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { memo } from 'react'

function LoadingButton(props: IconButtonProps & PropsWithChildren & { loading: boolean }) {
  const { loading, ...restProps } = props

  return <IconButton
    {...restProps}
  >
    <Box sx={{
      height: 40,
      width: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {
        props.loading
          ? <CircularProgress
          size={20}
          color={'inverseSurface' as 'primary'}
        ></CircularProgress>
          : props.children
      }

    </Box>

  </IconButton>
}

export default memo(LoadingButton)
