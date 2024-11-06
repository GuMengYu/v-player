import { Chip, ChipProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function MdTag(props: ChipProps & { name: string; tagcolor: string; to: string }) {
  const theme = useTheme()
  const { name, color, to, ...rest } = props
  return <Chip {...rest} sx={{
    bgcolor: theme.palette.surfaceVariant.main,
    color: theme.palette.onSurfaceVariant.main,
    justifyContent: 'start',
    fontSize: 12,
    width: '100%',
    borderLeft: `5px solid ${props.tagcolor}`,
    borderRadius: 1,
  }} label={props.name}></Chip>
}
