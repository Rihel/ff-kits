import { BaseFloat, BaseFloatConfirmProps } from '../base-float'
import {
  DataTableDefinitionColumn,
  DataTableProps,
  DataTableRowContext,
  DataTableState,
} from './interface'
import {
  Form,
  Modal,
  Popconfirm,
  Space,
  TableColumnProps,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { ReactNode, useCallback, useMemo, useRef } from 'react'
import {
  copy,
  formatTime,
  hasContentArray,
  isAvailableData,
  maybeFun,
  recursionTree,
  standardTime,
} from '@ff-kits/base'
import { useKitI18n, useKitI18nMemo, useKitI18nTranslation } from 'src/i18n'
import { useRafState, useRefreshEffect } from '../../hooks'

import { ActionItem } from './ActionItem'
import { DictTag } from '../dict-tag'
import { FFIcon } from '../icon'
import { FormRendererApi } from '../form-render'
import { IconText } from '../icon-text'
import _ from 'lodash'
import { cn } from '../../lib'
import { createStore } from 'hox'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(tz)
dayjs.extend(localizedFormat)

export const [useDataTableStore, DataTableStoreProvider] = createStore(
  (props: DataTableProps) => {
    const {
      theme,
      hasSearch,
      quickSearch,
      searchItems,
      searchFormPosition,
      searchFormProps,
      searchButtonLayout,
      showSearchButton,
      toolbar,
      service,
      rowKey,
      onSelectionChange,
      selectable,
      selectedRowKeys,
      selectionType,
      hasPager,
      columns,
      actions,
      actionColumn,
      emptyText,
      tableProps,
      hasViewer,
      onSuccess,
    } = props as Required<DataTableProps>
    const [form] = Form.useForm()
    const [state, setState] = useRafState<DataTableState>({
      searchData: {},
      data: [],
      total: 0,
      loading: false,
      cacheData: {},
      pager: {
        page: 1,
        size: 10,
      },
      viewVisible: false,
    })

    const { language } = useKitI18n()

    const t = useKitI18nTranslation()

    const getCacheData = () => {
      return (state as DataTableState).cacheData
    }

    const currentOnSuccessRef = useRef<DataTableProps['onSuccess']>(() => {})

    const fetchData = async () => {
      setState((d) => {
        d.loading = true
      })

      try {
        const payload = {
          searchData: state.searchData,
          pager: state.pager,
        }

        const rawData = await service?.(payload)

        if (_.isObject(rawData)) {
          const res = _.pick(rawData, 'data', 'total')
          const newData = {
            ...state.cacheData,
          }

          recursionTree(res.data, {
            childrenKey: 'children',

            visit(item) {
              const key = item[rowKey as string]
              newData[key] = item
            },
          })

          const newState = {
            ...state,
            data: res.data,
            total: res.total as number,
            cacheData: newData,
          }
          if (currentOnSuccessRef.current) {
            currentOnSuccessRef.current(newState)
            currentOnSuccessRef.current = undefined
          }
          setState(newState)
          onSuccess?.(newState)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setState((d) => {
          d.loading = false
        })
      }
    }

    const refresh = useRefreshEffect(fetchData)
    const getContext = useCallback(
      (extra: Partial<DataTableRowContext<Record<string, any>>> = {}) => {
        const { pager, data, searchData } = state
        let currentList = []
        if (extra.rowData) {
          recursionTree(data, {
            visit(item, parent, index, path, depth) {
              if (item[rowKey as string] === extra.rowData[rowKey as string]) {
                currentList = parent?.children || data
              }
            },
          })
        }
        return {
          pager,
          searchData,
          data,
          currentList,
          ...extra,
        } as DataTableRowContext<Record<string, any>>
      },
      [state]
    )

    const getSelectionRowData = useCallback(
      (rowKeys: string[] = []) => {
        rowKeys = _.isEmpty(rowKeys) ? selectedRowKeys : rowKeys
        const { cacheData } = state

        const res = _.chain(rowKeys)
          .map((item) => {
            const data = cacheData?.[item]
            return _.omit(data, 'children')
          })
          .cloneDeep()
          .value()

        return res
      },
      [state, selectedRowKeys]
    )
    const emitChange = useCallback(
      (rowKeys: string[] = []) => {
        rowKeys = _.uniq(rowKeys)

        const rowDatas = getSelectionRowData(rowKeys)
        onSelectionChange?.(rowKeys, rowDatas)
      },
      [onSelectionChange, getSelectionRowData]
    )

    const rowSelection = useMemo(() => {
      const { data } = state

      if (selectable === true) {
        return {
          type: selectionType || 'checkbox',
          selectedRowKeys: [...selectedRowKeys],
          getCheckboxProps: (record: any) => {
            const disabled = props.disabledRowSelect
              ? props.disabledRowSelect?.(getContext({ rowData: record }))
              : false
            return {
              disabled: disabled,
            }
          },
          onChange: (keys: string[], rowData: any[], opt: any) => {
            if (opt.type === 'all') {
              if (_.isEmpty(keys)) {
                // 移除当前页
                const currentPageSelectedRowKeys = []
                recursionTree(data, {
                  visit(item) {
                    currentPageSelectedRowKeys.push(item[rowKey as string])
                  },
                })
                const res = selectedRowKeys?.filter((item) => {
                  return !currentPageSelectedRowKeys.includes(item)
                })
                emitChange(res)
              } else {
                emitChange([...(selectedRowKeys as string[]), ...keys])
              }
            }
          },
          onSelect: (record: any, selected: any) => {
            if (selected) {
              emitChange([record[rowKey as string], ...selectedRowKeys])
            } else {
              emitChange(
                selectedRowKeys.filter((item) => item !== record[rowKey])
              )
            }
          },
        }
      }
      return null
    }, [state, selectable, selectionType, selectedRowKeys, emitChange])

    const reset = () => {
      setState((d) => {
        d.searchData = {}
        d.pager = {
          page: 1,
          size: 10,
        }
      }, false)
      refresh()
    }

    const search = () => {
      setState((d) => {
        d.pager = {
          ...d.pager,
          page: 1,
        }
      }, false)
      refresh()
    }

    const handleSearchChange = (newValue: any) => {
      setState((d) => {
        d.pager = {
          ...d.pager,
          page: 1,
        }
        d.searchData = newValue
      })
    }
    const finallySearchItems = useMemo(() => {
      return searchItems.map((item) => {
        let addOption: any = {}
        if (quickSearch) {
          const isEnterComp = ['input', 'textarea', 'password'].includes(
            _.lowerCase(item.comp as string)
          )

          if (isEnterComp) {
            addOption.onEnter = (...args: any[]) => {
              search()
              // @ts-ignore
              item.onEnter?.(...args)
            }
          } else {
            addOption.onChange = (...args: any[]) => {
              search()
              // @ts-ignore
              item.onChange?.(...args)
            }
          }
        }
        return {
          ...item,
          ...addOption,
        }
      })
    }, [quickSearch, searchItems, search])

    const handlePageChange = (current: number, size: number) => {
      setState((d) => {
        d.pager = {
          page: current,
          size,
        }
      })
      refresh()
    }

    const pagination = useKitI18nMemo(() => {
      const { pager, total } = state
      if (_.isNil(hasPager)) return false
      if (hasPager === false) return false
      return {
        pageSize: pager.size,
        current: pager.page,
        total: total || 0,
        showTotal: (total: number) => {
          return t('dataTable.total', { data: { total } })
        },
        onChange: (current: number, size: number) =>
          handlePageChange(current, size),
        showSizeChanger: true,
      }
    }, [state, hasPager])

    const renderValue = useCallback(
      (column: DataTableDefinitionColumn<Record<string, any>>, value: any) => {
        let type = column.type || 'text'
        if (!isAvailableData(value)) {
          return (
            <span style={{ color: 'var(--text-color-secondary)' }}>
              {emptyText}
            </span>
          )
        }

        let actualValue = value
        switch (type) {
          case 'date':
            actualValue = dayjs(standardTime(value))
              .tz(props.timezone)
              .format(column.format || 'YYYY-MM-DD HH:mm:ss')
            break
          case 'dict':
            if (column.dict) {
              const useTag = !_.has(column, 'tag') || column.tag === true
              if (useTag) {
                return (
                  <DictTag
                    dict={column.dict}
                    language={language}
                    value={value}
                  />
                )
              }
              return column.dict.getLabel(value, language)
            }
        }
        const res = (
          // <Typography.Text
          //   ellipsis={column.ellipsis}
          //   copyable={column.copyable}
          // >
          //   {actualValue}
          // </Typography.Text>
          <div className="flex items-center gap-1">
            <div
              className={cn({
                'ellipsis-2': column.ellipsis,
              })}
              style={{
                width: column.width || 'auto',
              }}
              title={actualValue}
            >
              {actualValue}
            </div>
            {column.copyable && (
              <IconText
                type="primary"
                onClick={() => copy(actualValue)}
                iconType="copy-outlined"
              ></IconText>
            )}
          </div>
        )
        if (column.tooltip) {
          return <Tooltip title={actualValue}>{res}</Tooltip>
        }
        return res
      },
      [emptyText, language, props.timezone]
    )
    const buildColumn = useCallback(
      ({
        column,
      }: {
        column: DataTableDefinitionColumn<Record<string, any>>
      }) => {
        const title = column.title
        const help = column.helpText ? (
          <Tooltip title={column.helpText}>
            <FFIcon
              className="cursor-pointer text-stone-600 hover:text-slate-900"
              type="question-circle-outlined"
            />
          </Tooltip>
        ) : null
        return {
          title: (
            <div className="flex items-center gap-2 shrink-0">
              <span className="block w-fit ellipsis-1">{title}</span>
              {help}
            </div>
          ),
          width: column.width,
          fixed: column.fixed,
          render: (_1: any, rowData: Record<string, any>, index: number) => {
            const value = _.get(rowData, column.dataIndex as string)
            const context = getContext({ value, rowData, column, index })
            if (column.render && _.isFunction(column.render)) {
              return column?.render(context)
            }
            return renderValue(column, value)
          },
        } as TableColumnProps<Record<string, any>>
      },
      [getContext, renderValue]
    )

    const buildActionColumns = () => {
      return {
        title: t('dataTable.action'),
        // width: _.size(actions) * 80,
        fixed: 'right',
        ...(_.omit(actionColumn, 'render') || {}),
        render: (value: any, rowData: Record<string, any>, index: number) => {
          const context = getContext({ value, rowData, index })

          const finallyActions = (actions || []).filter((action) => {
            if (_.isFunction(action.visible)) {
              return action.visible(context)
            }
            return true
          })

          return (
            <Space>
              {finallyActions.map((action) => {
                return (
                  <ActionItem
                    key={action.key}
                    context={context}
                    {..._.omit(action, 'key')}
                  />
                )
              })}
            </Space>
          )
        },
      } as TableColumnProps<Record<string, any>>
    }

    const resolveColumns = useCallback(() => {
      const res: TableColumnProps<Record<string, any>>[] = columns?.map?.(
        (column) => {
          return buildColumn({
            column,
          })
        }
      )
      if (hasContentArray(actions)) {
        res.push(buildActionColumns())
      }
      return res
    }, [actions, columns, buildActionColumns, buildColumn])

    const openView = () => {
      setState((d) => {
        d.viewVisible = true
      })
    }
    const closeView = () => {
      setState((d) => {
        d.viewVisible = false
      })
    }
    const emptyAllSelect = () => {
      emitChange([])
    }
    const resolveViewColumns = useCallback(() => {
      const res = columns?.map?.((column) => {
        return buildColumn({
          column,
        })
      })
      res.push({
        title: t('dataTable.action'),
        fixed: 'right',
        width: 100,
        render: (record) => {
          return (
            <Space>
              <IconText
                type="danger"
                iconType="delete-outlined"
                onClick={() => {
                  emitChange(
                    selectedRowKeys.filter((item) => item !== record[rowKey])
                  )
                }}
              >
                {t('dataTable.remove')}
              </IconText>
            </Space>
          )
        },
      })
      return res
    }, [columns, selectedRowKeys, emitChange, buildColumn])

    const mainTableProps = useMemo(() => {
      return {
        ...(tableProps || {}),
        columns: resolveColumns(),
        pagination: false,
        rowSelection,
        rowKey,
        dataSource: state.data,
        loading: state.loading,
      } as TableProps
    }, [resolveColumns, pagination, state, tableProps, rowKey, rowSelection])
    // console.log('mainTableProps', mainTableProps)
    const viewTableProps = useMemo(() => {
      return {
        ..._.omit(tableProps || {}, 'scroll'),
        columns: resolveViewColumns(),
        pagination: false,
        rowKey,
        dataSource: getSelectionRowData(selectedRowKeys),
        scroll: {
          y: window.innerHeight * 0.4,
          x: window.innerWidth * 1.2,
        },
      } as TableProps
    }, [resolveViewColumns, selectedRowKeys, state, tableProps, rowKey])

    const checkSearch = useCallback(
      (position: DataTableProps['searchFormPosition']) =>
        hasSearch && searchFormPosition === position,
      [hasSearch, searchFormPosition]
    )

    const searchFormRef = useRef<FormRendererApi>()

    const handleReset = () => {
      searchFormRef.current?.reset()
      reset()
    }

    const searchWithData = (
      data: Record<string, any>,
      currentOnSuccess?: (data: DataTableState) => void
    ) => {
      setState((d) => {
        d.searchData = data
      }, false)
      form.setFieldsValue(data)
      refresh()
      currentOnSuccessRef.current = currentOnSuccess
    }

    return {
      searchFormRef,
      handleReset,
      hasPager,
      hasViewer,
      paginationProps: pagination,
      form,
      theme,
      state,
      mainTableProps,
      viewTableProps,
      finallySearchItems,
      searchFormPosition,
      searchFormProps,
      searchButtonLayout,
      showSearchButton,
      selectedRowKeys,
      toolbar,
      checkSearch,
      getCacheData,
      fetchData,
      getContext,
      getSelectionRowData,
      emitChange,
      reset,
      search,
      searchWithData,
      handleSearchChange,
      handlePageChange,
      openView,
      closeView,
      emptyAllSelect,
    }
  }
)
