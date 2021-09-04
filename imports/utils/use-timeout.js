import { useEffect, useRef } from 'react'

function useTimeout (callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  savedCallback.current = callback

  // Set up the interval.
  useEffect(() => {
    if (delay > 0) {
      const id = setTimeout(() => {
        savedCallback.current()
      }, delay)
      return () => clearTimeout(id)
    } else {
      savedCallback.current()
    }
  },
  [delay])
}

export default useTimeout
