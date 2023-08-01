import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnproscessableEntityError } from 'src/utils/utils'
import omit from 'lodash/omit'
import { toast } from 'react-toastify'

type FormData = Pick<UserSchema, 'confirm_password' | 'password' | 'new_password'>
const passwordSchema = userSchema.pick(['confirm_password', 'password', 'new_password'])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver<FormData>(passwordSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnproscessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow-md md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mr-auto mt-8 flex max-w-2xl flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='password'
                placeholder='Mật khẩu cũ'
                type='password'
                errorMessage={errors.password?.message}
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
              ></Input>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='new_password'
                placeholder='Mật khẩu mới'
                type='password'
                errorMessage={errors.new_password?.message}
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
              ></Input>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập lại mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='confirm_password'
                placeholder='Nhập lại mật khẩu'
                type='password'
                errorMessage={errors.confirm_password?.message}
                className='relative'
                classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
              ></Input>
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
