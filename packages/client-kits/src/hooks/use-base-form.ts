import { Service, UseRequestOptions, useRequest } from './use-request'

import { Form } from 'antd'
import _ from 'lodash'
import { useEffect } from 'react'
import { useResettable } from './use-resettable'

type UseBaseFormOptions<
  Schema extends Record<string, any>,
  Res extends any,
  S = Service<Res>,
  R = Service<Partial<Schema>>,
> = {
  initialValue: Partial<Schema>
  service: S
  review?: R
  onSubmit?: (data: {
    formData: Partial<Schema>
    result: Res
    payload: any
  }) => void
  requestOptions?: Omit<UseRequestOptions<Res>, 'manual'>
  reviewOptions?: UseRequestOptions<Partial<Schema>>
  onError?: (data: {
    formData: Partial<Schema>
    error: any
    payload: any
  }) => void
}

export function useBaseForm<
  Schema extends Record<string, any>,
  ServiceRes = any,
>({
  initialValue,
  onSubmit,
  onError,
  service,
  requestOptions = {},
  reviewOptions = {},
  review,
}: UseBaseFormOptions<Schema, ServiceRes>) {
  const [form] = Form.useForm()
  const {
    data: formData,
    setData: setFormData,
    reset: resetFormData,
    getDefaultData,
  } = useResettable(initialValue)
  const { run, loading: submitting } = useRequest(
    (payload: any) => {
      return service?.(formData, payload)
    },
    {
      manual: true,
      ..._.omit(requestOptions, 'manual'),
    },
  )

  const { loading: fetching } = useRequest<Partial<Schema>, Partial<Schema>>(
    review as Service<Partial<Schema>>,
    {
      manual: _.isNil(review)
        ? true
        : _.has(reviewOptions, 'manual')
          ? reviewOptions.manual
          : false,
      ..._.omit(reviewOptions, 'onSuccess'),
      onSuccess: (res) => {
        reviewOptions?.onSuccess?.(res)
        setFormData(res)
      },
    },
  )

  async function submit(payload?: Parameters<Service<ServiceRes>>[0]) {
    try {
      await form.validateFields()
      const res = await run(payload)
      onSubmit?.({
        result: res,
        formData,
        payload,
      })
    } catch (error) {
      onError?.({
        error,
        formData,
        payload,
      })

      throw error
    }
  }
  useEffect(() => {
    form.setFieldsValue(formData)
  }, [])

  return {
    formData,
    setFormData,
    resetFormData,
    form,
    getDefaultData,
    submitting,
    submit,
    fetching,
  }
}
