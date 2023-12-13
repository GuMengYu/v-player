import { useLocation } from 'react-router-dom'

export default function useSearchParams() {
  // const [params, setParams] = useState<URLSearchParams>(new URLSearchParams())
  //
  // function update() {
  //   const location = window.location
  //   console.log(location)
  //   const searchParams = new URLSearchParams(location.search)
  //   setParams(searchParams)
  // }
  // useEffect(() => {
  //   window.addEventListener('hashchange', update)
  //   update()
  //   return () => {
  //     window.removeEventListener('hashchange', update)
  //   }
  // }, [])
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  return {
    searchParams,
  }
}
