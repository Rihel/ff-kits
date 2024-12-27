import { DataTableApi, DataTableProps } from './interface'
import { DataTableStoreProvider, useDataTableStore } from './store'
import { ReactNode, Ref, forwardRef, memo, useImperativeHandle } from 'react'

import { MainTable } from './MainTable'
import { SearchForm } from './SearchForm'
import { Toolbar } from './Toolbar'
import { ViewTable } from './ViewTable'
import _ from 'lodash'
import { cn } from '../../lib'
import { cva } from 'class-variance-authority'

const searchFormVariant = cva('', {
  variants: {
    theme: {
      card: 'bg-white rounded-md shadow-sm px-5 pt-5',
      ghost: '',
    },
  },
})
const contentVariant = cva('', {
  variants: {
    theme: {
      card: 'bg-white rounded-md shadow-sm p-5 mt-5',
      ghost: '',
    },
  },
})

const DataTableMain = memo(
  forwardRef<DataTableApi<any>, DataTableProps<any>>((props, ref) => {
    const {
      fetchData,
      search,
      getSelectionRowData,
      getCacheData,
      theme,
      checkSearch,
      searchWithData,
    } = useDataTableStore()
    useImperativeHandle(
      ref,
      () => {
        return {
          refresh: () => fetchData(),
          search: () => search(),
          getSelectionRowData: () => getSelectionRowData(),
          getCacheData: () => getCacheData(),
          searchWithData,
        }
      },
      [fetchData, search, getSelectionRowData, getCacheData],
    )

    return (
      <div className={cn(['data-table', props.className])}>
        <ViewTable />
        {checkSearch('default') && (
          <div className={searchFormVariant({ theme })}>
            <SearchForm />
          </div>
        )}
        <div className={contentVariant({ theme })}>
          <Toolbar />
          <MainTable />
        </div>
      </div>
    )
  }),
)
const DataTableInner = <T extends Record<string, any>>(
  {
    rowKey = 'id',
    hasPager = false,
    hasSearch = true,
    selectionType = 'checkbox',
    quickSearch = true,
    emptyText = '-',
    showSearchButton = true,
    searchButtonLayout = 'inline',
    searchFormPosition = 'default',
    searchItems = [],

    columns = [],
    theme = 'card',
    ...props
  }: DataTableProps<T>,
  ref: Ref<DataTableApi<T>>,
) => {
  return (
    <DataTableStoreProvider
      rowKey={rowKey}
      hasPager={hasPager}
      hasSearch={hasSearch}
      selectionType={selectionType}
      quickSearch={quickSearch}
      emptyText={emptyText}
      showSearchButton={showSearchButton}
      searchButtonLayout={searchButtonLayout}
      searchFormPosition={searchFormPosition}
      searchItems={searchItems}
      // @ts-ignore
      columns={columns}
      theme={theme}
      {...props}
    >
      <DataTableMain ref={ref} {...props} />
    </DataTableStoreProvider>
  )
}
export const DataTable = memo(forwardRef(DataTableInner)) as <
  T extends Record<string, any>,
>(
  props: DataTableProps<T> & { ref?: React.Ref<DataTableApi<T>> },
) => ReactNode

export * from './interface'
