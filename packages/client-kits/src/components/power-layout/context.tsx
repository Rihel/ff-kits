import { LoaderData } from './interface'
import { createContext } from 'react'

export type ContextData = {
  language?: string
}

export const PowerLayoutContext = createContext<ContextData | null>(null)
