import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { UserSchema, userSchema } from 'src/utils/rules'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from 'src/components/InputNumber'
import { useEffect } from 'react'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar', 'date_of_birth'])

export default function Profile() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  // console.log(profile)

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile?.name)
      setValue('address', profile?.address)
      setValue('phone', profile?.phone)
      setValue('avatar', profile?.avatar)
      setValue('date_of_birth', profile?.date_of_birth ? new Date(profile?.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    // await updateProfileMutation.mutateAsync({})
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow-md md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
                classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
              ></Input>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
                    {...field}
                    onChange={field.onChange}
                  ></InputNumber>
                )}
              ></Controller>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
                classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 outline-none focus:border-gray-500 focus:shadow-sm'
              ></Input>
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          ></Controller>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src='https://down-vn.img.susercontent.com/file/27de619231f4702ef370c18a2a29b2fa_tn'
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
