import { alpha, styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { ReactNode, useState } from 'react'
import { Typography } from '@mui/material'

const Md3Menu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    'borderRadius': 6,
    'marginTop': 2,
    'minWidth': 100,
    'backgroundColor': theme.palette.surfaceVariant.main,
    'color': theme.palette.onSurfaceVariant.main,
    'boxShadow':
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px',
    },
    '& .MuiMenuItem-root': {
      'borderRadius': 4,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))

interface OptionsItem {
  value: any
  title: string
  icon?: ReactNode
}
interface SelectMenuProps {
  value: any
  options: OptionsItem[]
  onChange: (val: any) => void
}
export default function SelectMenu({
  value,
  options,
  onChange,
}: SelectMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSelect = (val: any) => {
    setAnchorEl(null)
    onChange(val)
  }

  return <div>
    <Button
      size={'small'}
      variant="contained"
      disableElevation
      onClick={handleClick}
      endIcon={<KeyboardArrowDownIcon />}
      sx={{
        borderRadius: '8px',
      }}
    >
      {options.find(i => i.value === value)?.title}
    </Button>
    <Md3Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {
        options?.map((op) => {
          return <MenuItem key={op.value} onClick={e => handleSelect(op.value)} selected={value === op.value}>
            <Typography variant='caption'>{op.title}</Typography>
          </MenuItem>
        })
      }

    </Md3Menu>
  </div>
}
