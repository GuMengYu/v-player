import { Box, Skeleton } from '@mui/material'
import TrackListSkeleton from '@/components/skeleton/TrackListSkeleton'

export default function PlayListSkeleton() {
  return <><Box className='flex flex-col -ml-2 -mr-4' sx={{ height: 317, bgcolor: 'rgba(0, 0, 0, 0.03)' }}>
    <div className='mb-auto'></div>
    <div className='flex flex-col gap-2 mx-3 mb-4'>
      <Skeleton variant="text" className='w-72' sx={{ fontSize: '2.125rem', lineHeight: 1.235 }}/>
      <Skeleton variant="text" className='w-24' sx={{ fontSize: '1rem', lineHeight: 1.5 }}/>
      <Skeleton variant="text" className='w-20' sx={{ fontSize: '0.75rem', lineHeight: 1.66 }}/>
      <div className='flex'>
        {
          ['pr-4', 'px-4', 'px-4', 'pr-4'].map((i, idx) => {
            return <div key={idx} className={`w-24 flex flex-col items-center ${i}`}>
              <Skeleton variant="circular" width={24} height={24}/>
              <Skeleton variant="text" className='w-8'/>
            </div>
          })
        }
      </div>
      <div className='flex gap-3'>
        <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 6 }}/>
        <Skeleton variant="circular" width={48} height={48}/>
      </div>
    </div>
  </Box>
  <TrackListSkeleton/>
  </>
}
