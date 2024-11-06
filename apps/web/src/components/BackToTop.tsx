import { Button, Zoom } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function BackToTop({
  show,
  onBackToTop,
}: { show: boolean; onBackToTop: () => void }) {
  return <div className='absolute bottom-24 right-4 z-50'>
    {
      <Zoom
        in={show}
      >
        <Button
          variant={'contained'}
          color={'primaryContainer' as 'primary'}
          className='no-drag-area'
          sx={{
            height: 50,
            width: 50,
            borderRadius: 3.5,
            minWidth: 50,
          }}
          onClick={onBackToTop}
        >
          <KeyboardArrowUpIcon color={'onPrimaryContainer' as 'primary'} />
        </Button>
      </Zoom>

    }
  </div>
}
