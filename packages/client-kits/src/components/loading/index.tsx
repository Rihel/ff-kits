import { FC, memo } from 'react'
import { Flex, Spin } from 'antd'

import styles from './style.module.scss'
import { useKitI18nEntry } from '../../i18n'

export const Loading: FC = memo(({ tips }: { tips?: string }) => {
  const tip = useKitI18nEntry('loading.tips', tips, '正在加载中...')
  return (
    <Flex
      className={styles.wrap}
      vertical
      align="center"
      justify="center"
      style={{ padding: '200px' }}
    >
      <Spin />
      <p className={styles.text}>{tip}</p>
    </Flex>
  )
})
