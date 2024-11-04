import { styled } from '@mui/material/styles'
import { Switch } from '@mui/material'

export default styled(Switch)(({ theme }) => ({
  'padding': 8,
  '& .MuiSwitch-track': {
    'borderRadius': 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}))
