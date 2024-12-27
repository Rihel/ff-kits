import { Button, Empty } from 'antd'
import { ReactNode, memo, useRef } from 'react'

import { FFIcon } from '../icon'
import { FormItemSchema } from './interface'
import { FormListFieldData } from 'antd/es/form'
import { IconText } from '../icon-text'
import _ from 'lodash'

export type FormTableProps = {
  field: FormItemSchema
  dataSource: FormListFieldData[]

  renderItem: (item: FormItemSchema) => ReactNode
  onAdd: () => void
  onRemove: (index: number) => void
}
const minWidth = 180
export const FormTable = memo<FormTableProps>(
  ({ field, dataSource, renderItem, onAdd, onRemove }) => {
    const bodyRef = useRef()
    const headerRef = useRef()
    return (
      <div className="flex-col w-full overflow-hidden bg-white border rounded-md">
        {/* 头 */}
        <div className="relative flex flex-1 overflow-auto border-b">
          {field.items.map((subItem) => {
            const hasRequired = subItem.rules?.some((rule) =>
              _.chain(rule).get('required').eq(true).value(),
            )
            return (
              <div
                className="flex flex-1 gap-1 p-3 border-r"
                key={subItem.name}
                style={{ minWidth }}
              >
                {hasRequired && <span className="text-red-500">*</span>}
                <div>{subItem.label}</div>
              </div>
            )
          })}
          <div className="sticky right-0 z-10 w-20 p-3 bg-white border-l shrink-0">
            操作
          </div>
        </div>
        {/* 数据 */}
        <div className="flex flex-col">
          {_.isEmpty(dataSource) ? (
            <Empty className="py-4 border-b" />
          ) : (
            dataSource.map((rowData) => {
              return (
                <div className="flex flex-1 border-b" key={rowData.key}>
                  {field.items.map((subItem) => {
                    const name = [rowData.name, subItem.name].join('.')
                    const formItem = {
                      ...subItem,
                      name,
                      label: '',
                    }
                    return (
                      <div
                        className="flex-1 p-3 border-r "
                        key={name}
                        style={{ minWidth }}
                      >
                        {renderItem(formItem)}
                      </div>
                    )
                  })}
                  <div className="flex w-20 gap-1 p-3">
                    <IconText
                      type="danger"
                      iconType="delete-outlined"
                      onClick={() => onRemove(rowData.name)}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
        {/* 底部 */}
        <div className="flex items-center p-4 ">
          <Button
            icon={<FFIcon type="plus-outlined" />}
            onClick={() => onAdd()}
          >
            添加
          </Button>
        </div>
      </div>
    )
  },
)
