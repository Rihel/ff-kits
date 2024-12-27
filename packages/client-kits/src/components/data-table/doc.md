# DataTable 数据表格组件

基本覆盖盖了中后台系统中常见表格场景，仅需简单配置即可达成业务目标

该组件的样式分为三个区域，搜索表单(SearchForm)、工具条(Toolbar)、表格(MainTable)，依次从上到下排列

## 属性

- `theme`:{'ghost' | 'card'} 风格
- `timezone`: {string} 时区
- `language`: {string} 语言
- `hasViewer`: {boolean} 是否需要显示已选数据
- `hasSearch`: {boolean} 是否需要搜索区
- `searchItems`: {Array<SearchItem>} 搜索表单项，同formRender组件的 items
- `showSearchButton`: {boolean} // 是否需要搜索按钮
- `searchFormProps`: {object} // 搜索表单配置
- `searchFormPosition`: {string} // 搜索表单位置 - default : 默认位置，即顶部
  - `left`: 在toolbar.left 之后
  - `right`: 在toolbar.right 之前
  - `default`: 默认
  - `afterRight`: 在toolbar.right 之后
- `searchButtonLayout` : {search} 搜索按钮布局
  - `inline` : 横着排
  - `vertical`: 竖着排
- `quickSearch`: {boolean} 是否启用快速搜索，如果为true，则搜索表单控件的onEnter、onChange事件会触发搜搜
- `columns`: {Array<DataTableColumn>} 列配置，见下表
- `onSelectionChange：`(selectedRowKeys,selectedRowData)=>{} // 选择改变事件
- `selectedRowKeys`: {string[]} 已选数据
- `selectionType`: {string} 选择类型，即：单选（radio） or 多选(checkbox)
- `selectable`: {boolean} 是否可选择
- `toolbar`: {object} 工具条配置
  - `left`
  - `right`
- `service`: ({pager, searchData})=>Promise<DataTableResult> | DataTableResult 请求函数
- `hasPager`: {boolean} 是否开启分页
- `rowKey`: {string} 记录唯一值
- `emptyText`: {string} 空值的文本
- `actionColumn`: {Object} 操作列的列配置，同antd的column配置，已去掉 render
- `actions`: {Array<DataTableAction>} 操作列，通过 IconText 组件渲染

### 默认值

```js
 {
  rowKey: 'id',
  hasPager: false,
  hasSearch: true,
  selectionType: 'checkbox',
  quickSearch: true,
  emptyText: '-',
  showSearchButton: true,
  searchButtonLayout: 'inline',
  searchFormPosition: 'default',
  searchItems: [],
  columns: [],
  theme: 'card',
}
```

### DataTableResult 请求函数返回值

- `data`: {Array} 数据
- `total`?: {number} 条目数

### DataTableColumn 列配置

- `title`: {string} 标题
- `helpText`?: {string} 提示文案
- `dataIndex`?:{string} 字段名
- `type`?: {string} 字段类型
  - `text` 文本
  - `date` 日期时间，会调用formatTime函数格式化，通过format配置可改变格式
  - `dict` 枚举，会获取dict对应的label
- `render`?: (rowContext:{RowContext})=>{} 自定义渲染, 优先级最高
- `format`?：{string} 日期时间 的格式配置
- `dict`?: {Dict} 传入dict对象，通过createDict方法创建的对象
- `tag`?: {boolean} 在type为dict时生效，会通过tag组件渲染，如果dict中有color，则会去color属性
- `ellipsis`?: {boolean} 文本溢出省略号
- `copyable`?: {boolean} 是否可复制
- `tooltip`?: {boolean} 是否显示提示文案

### DataTableAction 操作按钮配置

- `title` {string} 按钮名称
- `key` {string} 按钮标识
- `onClick`?:(rowContext:{RowContext}) => Promise 默认点击按钮触发，如开启二次确认框，则这里是点击确认框的确认按钮
- `confirm`?: 二次确认配置
  - `enable` {boolean}: 是否开启
  - `type` {'pop' | 'dialog'} : 二次确认类型 ，默认pop，pop为气泡确认，dialog为模态框确认
  - `title` {string | (rowContext:{RowContext})=> ReactNode } 二次确认框的标题
  - `content` {string | (rowContext:{RowContext})=> ReactNode } 二次确认框的内容
  - `floatProps` {DataTableActionConfirm} 弹出配置，参考BaseFloat
- `visible` {boolean |(rowContext:{RowContext})=>boolean} 按钮可见性
- `props`: {object} IconText的props

### RowContext 行数据上下文

- `pager`: {object} 分页数据
  - `page`: {number}: 页码
  - `size`: {size}：条数
- `searchData`: {Record<string, any>} 搜索表单数据
- `data`: {Array<any>} 数据源
- `rowData`: {Record<string,any>} 当前行数据
- `value`: {any} 通过 lodash.get 方法，拿到rowData 的dataIndex的值
- `column`: {DataTableColumn} 列配置
- `index`: {number} 第几行数据

## 方法

- `refresh`：刷新数据
- `search`: 搜索数据，会将页码重置为1
- `getSelectionRowData`: 获取当前已选数据
- `getCacheData`: 获取已缓存的数据，内存缓存
