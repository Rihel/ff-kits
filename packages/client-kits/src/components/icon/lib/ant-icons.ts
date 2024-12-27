import * as antIcons from '@ant-design/icons'

import _ from 'lodash'

const filteredIcons = _.pickBy(antIcons, (_1, key) => {
  return /^[A-Z][a-zA-Z]+/.test(key)
})

export default Object.entries(filteredIcons).reduce((acc, [key, item]) => {
  return {
    ...acc,
    [_.kebabCase(key)]: item,
  }
}, {})
