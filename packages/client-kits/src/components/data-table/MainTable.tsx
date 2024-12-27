import { Alert, Flex, Pagination, PaginationProps, Space, Table } from 'antd'

import { IconText } from '../icon-text'
import _ from 'lodash'
import { cn } from '../../lib/css'
import styles from './style.module.scss'
import { useDataTableStore } from './store'
import { useKitI18nTranslation } from 'src/i18n'

export const MainTable = () => {
  const {
    selectedRowKeys,
    openView,

    emptyAllSelect,
    mainTableProps,
    state,
    paginationProps,
    hasViewer,
  } = useDataTableStore()
  const t = useKitI18nTranslation('dataTable')
  return (
    <Flex gap={10} vertical className="bg-white rounded-md shadow-sm">
      {!_.isEmpty(selectedRowKeys) && hasViewer && (
        <Alert
          message={t('selectedData', {
            data: { count: _.size(selectedRowKeys) },
          })}
          type="info"
          action={
            <Space>
              <IconText
                type="primary"
                onClick={() => openView()}
                iconType="eye-outlined"
              >
                {t('viewSelected')}
              </IconText>
              <IconText
                onClick={() => emptyAllSelect()}
                type="danger"
                iconType="delete-outlined"
              >
                {t('empty')}
              </IconText>
            </Space>
          }
        />
      )}
      <Table
        className={cn(styles.table, mainTableProps.className)}
        {..._.omit(mainTableProps, 'className')}
      />
      {paginationProps ? (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-light">
            {(paginationProps as PaginationProps).showTotal?.(
              state.total,
              [0, 0],
            )}
          </div>
          <Pagination
            {..._.omit(paginationProps as PaginationProps, 'showTotal')}
          />
        </div>
      ) : null}
    </Flex>
  )
}
