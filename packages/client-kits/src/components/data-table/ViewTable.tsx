import { BaseFloat } from '../base-float'
import { Table } from 'antd'
import { useDataTableStore } from './store'
import { useKitI18nTranslation } from 'src/i18n'

export const ViewTable = () => {
  const { viewTableProps, closeView, state } = useDataTableStore()
  const t = useKitI18nTranslation()
  return (
    <BaseFloat
      visible={state.viewVisible}
      hasFooter={false}
      title={t('dataTable.selectedDataTitle')}
      width={'80vw'}
      onClose={() => closeView()}
    >
      <Table {...viewTableProps} />
    </BaseFloat>
  )
}
