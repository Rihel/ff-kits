import { BaseFloatConfirmProps, BaseFloatProps } from '../base-float'
import { Dict, createDict } from '@ff-kits/base'
import { FormItemSchema, FormRenderProps } from '../form-render'
import { HTMLAttributes, ReactNode } from 'react'
import { ModalFuncProps, ModalProps, TableColumnProps, TableProps } from 'antd'

import { IconTextProps } from '../icon-text'

export type DataTablePager = {
  page: number
  size: number
}
export type DataTableResult<T extends Record<string, any>> = {
  total?: number
  data: T[]
}

export type DataTableServiceParams = {
  pager: DataTablePager
  searchData: Record<string, any>
}

export type DataTableService<T extends Record<string, any>> = (
  data: DataTableServiceParams
) => Promise<DataTableResult<T>>

export type DataTableRowContext<T extends Record<string, any>> = {
  pager: DataTablePager
  rowData: T
  data: T[]
  searchData: Record<string, any>
  column: DataTableDefinitionColumn<T>
  value: T[keyof T]
  index: number
  currentList?: T[] // 当前层级数据
}

export type DataTableApi<T extends Record<string, any>> = {
  refresh(): void
  search(): void
  getSelectionRowData(rowKeys?: string[]): T[]
  getCacheData(): Record<string, T>
  searchWithData: (
    data: Record<string, any>,
    currentOnSuccess?: (data: DataTableState) => void
  ) => void
}

export type DataTableActionConfirm<T extends Record<string, any>> = Partial<{
  enable: boolean
  type: 'pop' | 'dialog'
  title: ReactNode | ((context: DataTableRowContext<T>) => ReactNode)
  content: ReactNode | ((context: DataTableRowContext<T>) => ReactNode)
  floatProps: BaseFloatConfirmProps
}>
// Recursive Keyof Type
type Primitive = string | number | boolean | symbol | null | undefined

type DeepKeyOf<T> = T extends Primitive
  ? ''
  : {
      [K in keyof T & (string | number)]: T[K] extends Primitive
        ? K
        : T[K] extends Array<any>
          ? K
          : `${K}` | `${K}.${DeepKeyOf<T[K]>}`
    }[keyof T & (string | number)]

export type DataTableDefinitionColumn<T extends Record<string, any>> = Partial<{
  title: string
  dataIndex: DeepKeyOf<T>
  width: number
  fixed: 'left' | 'right'
  helpText: string
  type: 'text' | 'date' | 'dict'
  format: string
  dict: Dict
  tag: boolean
  ellipsis: boolean
  copyable: boolean
  tooltip: boolean
  render: (rowContext: DataTableRowContext<T>) => ReactNode
}>

export type DataTableAction<T extends Record<string, any>> = Partial<{
  title: string
  key: string
  onClick: (data: DataTableRowContext<T>) => Promise<void> | void
  confirm: DataTableActionConfirm<T>
  visible: boolean | ((data: DataTableRowContext<T>) => boolean)
  disabled: boolean | ((data: DataTableRowContext<T>) => boolean)
  props: Omit<IconTextProps, 'key' | 'onClick' | 'noLoading'>
}>

export type DataTableProps<
  T extends Record<string, any> = Record<string, any>,
> = Partial<{
  onSuccess: (data: DataTableState) => void
  rowKey: string
  hasPager: boolean
  hasSearch: boolean
  hasViewer: boolean
  selectionType: 'checkbox' | 'radio'
  quickSearch: boolean
  emptyText: string
  timezone: string
  showSearchButton: boolean
  searchButtonLayout: 'inline' | 'vertical'
  searchFormPosition: 'default' | 'left' | 'right' | 'afterRight'
  searchItems: FormItemSchema[]
  actions: DataTableAction<T>[]
  columns: DataTableDefinitionColumn<T>[]
  theme: 'card' | 'ghost'
  selectedRowKeys: string[]

  disabledRowSelect: (data: DataTableRowContext<T>) => boolean
  selectable: boolean
  onSelectionChange: (rowKeys: string[], rowData: T[]) => void
  service: DataTableService<T>
  searchFormProps: Omit<FormRenderProps, 'items' | 'value' | 'onChange'>
  tableProps: Omit<
    TableProps,
    | 'columns'
    | 'dataSource'
    | 'rowKey'
    | 'loading'
    | 'pagination'
    | 'rowSelection'
  >
  actionColumn: Omit<TableColumnProps<T>, 'render' | 'title' | 'fixed'>
  toolbar: {
    left?: ReactNode
    right?: ReactNode
  }
}> &
  HTMLAttributes<HTMLDivElement>

export type DataTableState = {
  searchData: Record<string, any>
  data: Record<string, any>[]
  total: number
  loading: boolean
  cacheData: Record<string, any>
  pager: {
    page: number
    size: number
  }
  viewVisible: boolean
}
