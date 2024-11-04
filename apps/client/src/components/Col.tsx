import type { TypographyVariant } from '@mui/material'
import {
  Box, IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'
import { ArrowCircleRightOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { alpha } from '@mui/material/styles'

export default function Col(
  props: PropsWithChildren & {
    title?: string
    subTitle?: string
    more?: ReactNode | string
    variant?: TypographyVariant
    className?: string
  },
) {
  const theme = useTheme()
  return (
    <div className={props.className}>
      <Box className="mb-2">
        <Box
          className="flex justify-between items-center"
        >
          <Typography variant={props.variant ?? 'h6'}>{props.title}</Typography>
          <Box>{
            typeof props.more === 'string'
              ? <IconButton
              sx={{
                bgcolor: alpha(theme.palette.tertiaryContainer.main, theme.palette.action.activatedOpacity),
              }}
              component={Link}
              color={'tertiary' as 'primary'}
              size='small'
              to={props.more}
            >
              <ArrowCircleRightOutlined fontSize='small' />
            </IconButton>
              : props.more
          }</Box>
        </Box>
        <Box>
          <Typography
            variant="caption"
          >
            {props.subTitle}
          </Typography>
        </Box>
      </Box>
      {props.children}
    </div>
  )
}
