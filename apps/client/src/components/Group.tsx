import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import type { ReactNode } from 'react'

interface ItemProp {
  title?: string
  subTitle?: string
  icon?: ReactNode
  value: any
  children?: ReactNode
}
interface GroupProps {
  items: ItemProp[]
  value: any
  onChange: (val: any) => void
  exclusive?: boolean
}
export default function Group(
  { items = [], value, onChange, exclusive }: GroupProps,
) {
  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    'display': 'grid',
    'width': '100%',
    'borderRadius': 0,
    '& .MuiToggleButtonGroup-grouped': {
      'border': 0,
      'borderRadius': 12,
      'backgroundColor': theme.palette.surfaceVariant.main,
      'color': theme.palette.onSurfaceVariant.main,
      'justifyContent': 'start',
      '&.Mui-disabled': {
        border: 0,
      },
      '&.Mui-selected': {
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.onPrimary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.9),
        },
      },
      '&:not(:first-of-type)': {
        borderRadius: 12,
      },
      '&:first-of-type': {
        borderRadius: 12,
      },
    },
  }))
  return <StyledToggleButtonGroup exclusive={exclusive} value={value} className='grid-cols-3 gap-4' onChange={(e, val) => {
    onChange(val)
  }}>
    {
      items.map((i) => {
        return (<ToggleButton key={i.value} value={i.value}>
          {
            i.children
              ? i.children
              : (<div className='flex gap-2 items-center'>
              {i.icon}
              <div className='flex flex-col items-start justify-center'>
                <Typography variant='caption'>{i.title}</Typography>
                <Typography variant='caption'>{i.subTitle}</Typography>
              </div>
            </div>)
          }

          </ToggleButton>)
      })
    }

  </StyledToggleButtonGroup>
}
