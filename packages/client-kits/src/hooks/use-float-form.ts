import { Service } from './use-request'
import { useBaseForm } from './use-base-form'
import { useResettable } from './use-resettable'

export type UseFlatFormOptions<
  FormData extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  initialValue: FormData
  service: Service<Result>,
  onError?: (e: any) => void,
  onSubmit?: (res: Result) => void,
  onOpen?: (e?: any) => void,
  onClose?: () => void,
}

export function useFloatForm<T extends Record<string, any>>({
  initialValue,
  service,
  onError,
  onSubmit,
  onOpen,
  onClose,
}: UseFlatFormOptions<T>) {
  const {
    data: floatData,
    setData: setFloatData,
    reset: resetFloatData,
  } = useResettable({
    visible: false,
    isEdit: false,
  })

  const { form, formData, setFormData, resetFormData, submit } = useBaseForm({
    initialValue,
    service: service,
    onSubmit: (...args) => {
      onSubmit?.(...args)
      closeFloat()
    },
    onError: (...args) => {
      onError?.(...args)
    },
  })

  const openFloat = (data?: any) => {
    const isEdit = !!data
    setFloatData((d) => {
      d.visible = true
      d.isEdit = isEdit
    })
    if (isEdit) {
      setFormData(data)
    }
    onOpen?.(data)
  }
  const closeFloat = () => {
    resetFloatData()
    resetFormData()
    onClose?.()
  }

  return {
    floatData,
    form,
    formData,
    setFormData,
    resetFormData,
    openFloat,
    closeFloat,
    submit,
  }
}
