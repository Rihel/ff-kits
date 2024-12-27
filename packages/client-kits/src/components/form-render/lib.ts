import {
  Widget,
  dateWidget,
  inputWidget,
  pwdWidget,
  radioWidget,
  rangeWidget,
  selectWidget,
  textareaWidget,
} from './widgets'

import { WidgetKey } from './interface'
import _ from 'lodash'

class WidgetRegistry {
  static instance: WidgetRegistry | null = null
  widgetMap = new Map<string, Widget>()
  constructor() {
    if (WidgetRegistry.instance) return WidgetRegistry.instance
    this.widgetMap = new Map<string, Widget>()
    WidgetRegistry.instance = this
  }
  register(widget: Widget) {
    this.widgetMap.set(widget.key, widget)
    return this
  }
  hasWidget(key: WidgetKey = '') {
    return this.widgetMap.has(_.toLower(key))
  }
  getWidget(key: WidgetKey = '') {
    return this.widgetMap.get(_.toLower(key))
  }
  getComponent(key: WidgetKey) {
    const { component } = this.getWidget(key) || {}
    return component
  }
  getTransform(key: WidgetKey) {
    const { transform } = this.getWidget(key) || {}
    return transform
  }

  isEnterWidget(key: WidgetKey = '') {
    return [inputWidget.key, pwdWidget.key, textareaWidget.key].includes(
      _.toLower(key),
    )
  }
}

export const widgetRegistry = new WidgetRegistry()
window['widgetRegistry'] = widgetRegistry
widgetRegistry
  .register(inputWidget)
  .register(pwdWidget)
  .register(textareaWidget)
  .register(selectWidget)
  .register(radioWidget)
  .register(rangeWidget)
  .register(dateWidget)
