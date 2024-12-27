import { InternalPanel } from './Panel'
import { PanelGroup } from './PanelGroup'

export const Panel = InternalPanel as typeof InternalPanel & {
  Group: typeof PanelGroup
}
Panel.Group = PanelGroup

export * from './interface'
