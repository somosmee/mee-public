import { useRef, useState, useEffect } from 'react'

const useInfiniteScroll = ({ onLoadMore } = {}) => {
  const containerRef = useRef()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadMore = async () => {
      onLoadMore && (await onLoadMore())
      setLoading(false)
    }

    if (!loading) return
    loadMore()
  }, [loading])

  const handleScroll = () => {
    const container = containerRef.current

    if (container) {
      /* IMCOMPLETE */
      // Checa se o scroll chegou ao botton de um container espcífico
      // console.log('Scroll: ', container.clientHeight + container.scrollTop, container.offsetHeight)
    } else {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return
      }
      setLoading(true)
    }
  }

  return [loading, setLoading, containerRef]
}

export default useInfiniteScroll
