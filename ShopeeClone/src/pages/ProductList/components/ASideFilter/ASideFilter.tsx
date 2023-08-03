import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constaints/path'
import { QueryConfig } from '../../ProductList'
import { Category } from 'src/types/category.type'
import classNames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import InputNumber from 'src/components/InputNumber'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoundefinedField } from 'src/types/utils.type'
import RatingStar from '../RatingStar'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoundefinedField<Pick<Schema, 'price_max' | 'price_min'>>
const priceSchema = schema.pick(['price_min', 'price_max'])

export default function ASideFilter({ categories, queryConfig }: Props) {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter'])).toString()
    })
  }

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside filter.all categories')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2 ', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.filter search')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div> {t('aside filter.range')}</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    ref={field.ref}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger(['price_max'])
                    }}
                    value={field.value}
                    placeholder={`₫ ${t('aside filter.min')}`}
                    type='text'
                    className='grow'
                    classNameError='hidden'
                    classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  ></InputNumber>
                )
              }}
            ></Controller>

            <div className=' h-full shrink-0  px-2 text-gray-500'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    ref={field.ref}
                    classNameError='hidden'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger(['price_min'])
                    }}
                    value={field.value}
                    placeholder={`₫ ${t('aside filter.max')}`}
                    type='text'
                    className='grow'
                    classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  ></InputNumber>
                )
              }}
            ></Controller>
          </div>
          <div className='mt-1 min-h-[1.25rem]  text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            {t('aside filter.apply')}
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>{t('aside filter.rating')}</div>
      <RatingStar queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80 '
      >
        {t('aside filter.clear all')}
      </Button>
    </div>
  )
}
