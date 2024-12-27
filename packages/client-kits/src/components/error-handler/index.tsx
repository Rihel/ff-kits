import { Alert, Avatar, Button, Result } from 'antd'
import { useNavigate, useRouteError } from 'react-router-dom'

import { FFIcon } from '../icon'
import styles from './style.module.scss'
import { useKitI18nTranslation } from '../../i18n'

export const ErrorHandler = () => {
  const navigate = useNavigate()
  const error = useRouteError() as any
  const t = useKitI18nTranslation('errorHandler')
  const btn = (
    <Button
      type="primary"
      ghost
      onClick={() => navigate('/')}
      icon={<FFIcon type="home-outlined" />}
    >
      {t('back')}
    </Button>
  )
  if (error.status === 404) {
    return (
      <Result
        title={t('notFound')}
        icon={<FFIcon type="close-outlined" />}
        extra={<>{btn}</>}
      />
    )
  }
  return (
    <Result
      title={t('error')}
      status="error"
      extra={
        <>
          <div className={styles.error}>
            <pre className={styles.errorTitle}>{error.message}</pre>
            <pre className={styles.errorMessage}>{error.stack}</pre>
          </div>
          {btn}
        </>
      }
    />
  )
}
