import { Skeleton } from '@mui/material'
import GridRow from '@/components/GridRow'
import { GridType } from '@/hooks/useResponsiveGrid'

export default function ExploreSkeleton() {
  return (<div className='flex flex-col gap-4 pr-2'>
    <div>
      <div className='mb-2'>
        <Skeleton variant="text" className='w-24' sx={{ fontSize: '1.5rem', lineHeight: 1.334 }}/>
      </div>
      <GridRow>
        {
          Array(12).fill('_').map((i, idx) => {
            return <Skeleton key={idx} variant="rectangular" height={32} sx={{ borderRadius: 1 }}/>
          })
        }
      </GridRow>
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
