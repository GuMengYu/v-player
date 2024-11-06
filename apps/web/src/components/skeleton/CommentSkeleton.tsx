import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'

export default function CommentSkeleton() {
  return <div>
    <Skeleton variant="text" className='w-20' sx={{ fontSize: '1rem', lineHeight: 1.5 }}/>
    {
      Array(4).fill('-').map((_, idx) => {
        return <Box key={idx} className='flex flex-col py-2 gap-1' sx={{ borderRadius: 2 }} >
          <div>
            <div className='flex gap-2'>
              <Skeleton variant="rectangular" height={40} width={40} sx={{ borderRadius: '50%' }}/>
              <div className='flex flex-col justify-center'>
                <Skeleton variant="text" className='w-32' sx={{ fontSize: '0.875rem', lineHeight: 1.43 }}/>
              </div>
            </div>
            <Skeleton variant="text" className='w-24 justify-self-center' sx={{ fontSize: '0.75rem', lineHeight: 1.66 }}/>
          </div>
          <Skeleton variant="text" className='justify-self-center' sx={{ fontSize: '0.875rem', lineHeight: 1.43 }}/>
        </Box>
      })
    }
  </div>
}
