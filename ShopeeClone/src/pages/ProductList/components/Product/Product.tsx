import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constaints/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  const { t, i18n } = useTranslation('home')
  const currentLanguage = locales[i18n.language as keyof typeof locales]

  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='shadown overflow-hidden rounded-sm  bg-white transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-sm'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex items-center '>
            <div className=' max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating} />
            {currentLanguage !== 'English' ? (
              <div className='ml-2 text-xs '>
                <span className='mr-1 '>{t('aside filter.sold')}</span>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
              </div>
            ) : (
              <div className='ml-2 text-xs '>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1 '>{t('aside filter.sold')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
