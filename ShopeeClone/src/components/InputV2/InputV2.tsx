import { InputHTMLAttributes, useState } from 'react'
import { useController, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form'

export type InputNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameInput?: string
  classNameError?: string
} & InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName>
function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: InputNumberProps<TFieldValues, TName>) {
  const {
    type,
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    className,
    onChange,
    value = '',
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    ...rest
  } = props

  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
