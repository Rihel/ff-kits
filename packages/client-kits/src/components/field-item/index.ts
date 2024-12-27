import { FieldGroup } from './FieldGroup'
import { FieldItem as InternalFieldItem } from './FieldItem'

export const FieldItem = InternalFieldItem as typeof InternalFieldItem & {
  Group: typeof FieldGroup
}

FieldItem.Group = FieldGroup

export * from './interface'
