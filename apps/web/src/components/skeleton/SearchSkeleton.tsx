import { Card, Skeleton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import GridRow from '@/components/GridRow'
import { GridType } from '@/hooks/useResponsiveGrid'

export default function SearchSkeleton() {
  const theme = useTheme()
  return (<div className='flex flex-col gap-4 pr-2'>
    <div className='grid grid-cols-2 gap-4'>
      <div className='flex flex-col'>
        <div className='mb-2'>
          <Skeleton variant="text" className='w-24' sx={{ fontSize: '1rem', lineHeight: 1.75 }}/>
        </div>
        <Card
          variant='outlined'
          sx={{
            flex: 1,
            bgcolor: theme.palette.surfaceVariant.main,
            color: theme.palette.onSurfaceVariant.main,
            borderRadius: 4,
            p: 2,
          }}
        >
            <GridRow rowType={GridType.B}>
              {[1, 2, 3].map(i => (<div key={i}>
                <div className='aspect-square'>
                  <Skeleton className='h-full' height='100%' variant="rectangular" sx={{ borderRadius: 4 }}/>
                </div>
                <div className='px-3 pt-4 pb-6'>
                  <Skeleton variant="text" className='w-full' sx={{ fontSize: '0.875rem', lineHeight: 1.57 }}/>
                </div>
              </div>))}
            </GridRow>
        </Card>
      </div>
      <div className='flex flex-col'>
        <div className='mb-2'>
          <Skeleton variant="text" className='w-24' sx={{ fontSize: '1rem', lineHeight: 1.75 }}/>
        </div>
        <div className='flex flex-col gap-1'>
          <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 4 }}/>
          <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 4 }}/>
          <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 4 }}/>
          <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 4 }}/>
        </div>
      </div>
    </div>
    <div>
      <div className='mb-2'>
        <Skeleton variant="text" className='w-24' sx={{ fontSize: '1.5rem', lineHeight: 1.334 }}/>
      </div>
      <GridRow rowType={GridType.A}>
        {[1, 2, 3, 4].map(i => (<div key={i}>
          <div className='aspect-square'>
            <Skeleton className='h-full' height='100%' variant="rectangular" sx={{ borderRadius: 4 }}/>
          </div>
          <div className='px-3 pt-4 pb-6'>
            <Skeleton variant="text" className='w-full' sx={{ fontSize: '0.875rem', lineHeight: 1.57 }}/>
          </div>
        </div>))}
      </GridRow>
    </div>
    </div>)
}
