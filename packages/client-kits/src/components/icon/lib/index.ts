import { ForwardRefExoticComponent } from 'react'
import antIcons from './ant-icons'
import remixicons from './remixicons'
export const iconMap: Record<string, ForwardRefExoticComponent<any>> = {
  ...antIcons,
  ...remixicons,
}

export const icons = [...Object.values(antIcons)]
export const iconEntries = [...Object.entries(antIcons)]
export const iconNames = [...Object.keys(antIcons)]
