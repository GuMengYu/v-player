import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'

export default function TrackListSkeleton() {
  return <div>
    {
      Array(6).fill('-').map((_, idx) => {
        return <Box key={idx} className='mb-1 px-2 grid grid-cols-3 gap-4 items-center' height={64} sx={{ borderRadius: 2 }} gridTemplateColumns='1fr 1fr 140px'>
          <div className='flex gap-2'>
            <Skeleton variant="rectangular" height={48} width={48} sx={{ borderRadius: 3 }}/>
            <div className='flex flex-col justify-center'>
              <Skeleton variant="text" className='w-48' sx={{ fontSize: '1rem', lineHeight: 1.5 }}/>
              <Skeleton variant="text" className='w-24' sx={{ fontSize: '0.75rem', lineHeight: 1.66 }}/>
            </div>
          </div>
          <Skeleton variant="text" className='w-48' sx={{ fontSize: '0.875rem', lineHeight: 1.43 }}/>
          <Skeleton variant="text" className='w-8 justify-self-center' sx={{ fontSize: '0.875rem', lineHeight: 1.43 }}/>
        </Box>
      })
    }
  </div>
}
