import { FormRenderer, FormRendererApi } from '../form-render'

import { Button } from 'antd'
import { FFIcon } from '../icon'
import _ from 'lodash'
import { cn } from '../../lib'
import { cva } from 'class-variance-authority'
import { useDataTableStore } from './store'
import { useKitI18nTranslation } from 'src/i18n'
import { useRef } from 'react'

const searchButtonVariant = cva('flex  gap-3 pl-5 border-l', {
  variants: {
    mode: {
      inline: 'mb-6',
      vertical: 'flex-col justify-center mb-6',
    },
  },
})

export const SearchForm = () => {
  const {
    form,
    finallySearchItems,
    state,
    searchFormPosition,
    searchFormProps,
    showSearchButton,
    searchButtonLayout,
    reset,
    handleSearchChange,
    search,
    searchFormRef,
    handleReset,
  } = useDataTableStore()
  const t = useKitI18nTranslation('dataTable')

  return (
    <div className="flex justify-between">
      <FormRenderer
        form={form}
        value={state.searchData}
        ref={(api) => (searchFormRef.current = api as FormRendererApi)}
        onChange={handleSearchChange}
        formProps={{
          layout: 'inline',
        }}
        items={finallySearchItems}
        formItemClassName={cn(
          searchFormPosition === 'default' ? '!mb-6' : '',
          'last:!me-0 ',
          searchFormProps?.formItemClassName,
        )}
        {..._.omit(
          searchFormProps,
          'items',
          'formItemClassName',
          'value',
          'onChange',
        )}
      />
      {showSearchButton && (
        <div className={searchButtonVariant({ mode: searchButtonLayout })}>
          <Button
            icon={<FFIcon type="search-outlined" />}
            type="primary"
            onClick={() => search()}
          >
            {t('search')}
          </Button>
          <Button icon={<FFIcon type="reload" />} onClick={() => handleReset()}>
            {t('reset')}
          </Button>
        </div>
      )}
    </div>
  )
}
