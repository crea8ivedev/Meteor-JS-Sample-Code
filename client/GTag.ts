import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (
      key: string,
      measurementId: string,
      config: { page_path: string }
    ) => void
  }
}

export const useGTag = (measurementId: string) => {
  const { listen } = useHistory()

  useEffect(() => {
    // Tracks initial page
    window.gtag('config', measurementId, { page_path: location.pathname })

    return listen((location) => {
      // Tracks page changes
      window.gtag('config', measurementId, { page_path: location.pathname })
    })
  }, [measurementId, listen])
}

export const GTag = ({ measurementId, children }) => {
  useGTag(measurementId)
  return children
}
