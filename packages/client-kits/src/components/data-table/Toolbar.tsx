import { Flex } from 'antd'
import { SearchForm } from './SearchForm'
import { useDataTableStore } from './store'
import { useMemo } from 'react'

export const Toolbar = () => {
  const { toolbar, searchFormPosition, checkSearch } = useDataTableStore()
  const showToolbar = useMemo(() => {
    return (
      !!toolbar || ['left', 'right', 'afterRight'].includes(searchFormPosition)
    )
  }, [toolbar, searchFormPosition])

  if (showToolbar === false) {
    return null
  }
  return (
    <Flex style={{ marginBottom: 24 }} justify="space-between">
      <div className="flex items-center gap-3">
        {toolbar?.left}
        {checkSearch('left') && <SearchForm />}
      </div>
      <div className="flex items-end gap-3">
        {checkSearch('right') && <SearchForm />}
        {toolbar?.right}
        {checkSearch('afterRight') && <SearchForm />}
      </div>
    </Flex>
  )
}
