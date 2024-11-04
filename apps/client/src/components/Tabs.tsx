import { Tabs } from '@mui/base/Tabs'
import { Tab, tabClasses } from '@mui/base/Tab'

import { TabsList } from '@mui/base/TabsList'
import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

const MYTab = styled(Tab)(({ theme }) => ({
  'backgroundColor': `${theme.palette.primaryContainer.main}33`,
  'height': 46,
  'paddingLeft': 24,
  'paddingRight': 24,
  'borderRadius': 16,
  'display': 'inline-block',
  'marginRight': 6,
  'color': theme.palette.onPrimaryContainer.main,
  'transition': theme.transitions.create('background-color', {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: `${theme.palette.primaryContainer.main}4D`,
  },
  '&:focus': {
    backgroundColor: `${theme.palette.primaryContainer.main}4D`,
  },
  '&:last-child': {
    marginRight: 0,
  },
  [`&.${tabClasses.selected}`]: {
    background: theme.palette.primaryContainer.main,
  },
}))
export default function MYTabs({ tabs, onChange, value }: {
  value?: string | number | undefined
  onChange?: (v: any) => void
  tabs: { value: string; label: string }[]
}) {
  return <Tabs value={value} onChange={(_, val) => {
    onChange && onChange(val)
  }}>
    <TabsList>
      {
        tabs.map(tab => <MYTab key={tab.value} value={tab.value}><Typography>{tab.label}</Typography></MYTab>)
      }
    </TabsList>
  </Tabs>
}
