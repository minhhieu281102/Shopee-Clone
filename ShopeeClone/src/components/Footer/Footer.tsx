import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
export default function Footer() {
  const { i18n, t } = useTranslation('home')
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  return (
    <footer className='bg-neutral-100 py-16 '>
      <div className='container '>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>© 2022 {t('aside filter.Shopee. All Rights Reserved.')}</div>
          </div>
          <div className='lg:col-span-2'>
            <div>
              {t('aside filter.Country & Region')}: Singapore Indonesia Đài Loan Thái Lan Malaysia Việt Nam Philippines
              Brazil México Colombia Chile Poland
            </div>
          </div>
        </div>
        {currentLanguage !== 'English' && (
          <div className='mt-10 text-center text-sm'>
            <div>Công ty TNHH Shopee</div>
            <div className='mt-6'>
              Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành
              phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
            </div>
            <div className='mt-2'>
              Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)
            </div>
            <div className='mt-2'>
              Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015
            </div>
            <div className='mt-2'>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</div>
          </div>
        )}
      </div>
    </footer>
  )
}
