import { Button } from '@mui/material'
import PageTransition from '@/components/PageTransition'
import { useCommentStore } from '@/store/comment'

export default function Playground() {

  const { showComment } = useCommentStore()

  function open() {
    showComment(2829883282, 'playlist')
  }

  return <PageTransition>
    {/*<Comment :id="2829883282" type="playlist" />*/}
    <Button onClick={open}>open</Button>
  </PageTransition>
}
