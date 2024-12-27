import {
  Location,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'

export function useRoute({
  onChange,
}: {
  onChange?: (data: {
    location: Location
    prevLocation: Location | null
  }) => void
} = {}) {
  const [searchParams] = useSearchParams()

  const location = useLocation()
  const prevLocation = useRef<Location | null>(null)
  const query = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  )
  const params = useParams()
  useEffect(() => {
    onChange?.({
      prevLocation: prevLocation.current,
      location,
    })
    prevLocation.current = location
  }, [location, onChange])
  return {
    query,
    params,
    ...location,
  }
}

export type RouteData = ReturnType<typeof useRoute>
