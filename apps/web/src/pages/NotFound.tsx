import { Box, Button, Link, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFound() {
  const theme = useTheme()
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'100%'} gap={1}>
      <Typography variant="h4" color={theme.palette.onSurfaceVariant.main}>Whoops, Page Not Found</Typography>
      <Typography variant="subtitle2" color={theme.palette.onSurfaceVariant.main}>The page you were looking for does not exist</Typography>
      <Link component={RouterLink} to="/home">
        <Button color="primary" variant="outlined">
          Get me out of here!
        </Button>
      </Link>
    </Box>
  )
}
