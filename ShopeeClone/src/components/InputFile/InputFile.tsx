import React, { Fragment, useRef } from 'react'
import config from 'src/constaints/config'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const { t } = useTranslation('profile')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal?.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('Ảnh sai định dạng')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  return (
    <Fragment>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value === null
        }}
      />
      <button
        onClick={handleUpload}
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        {t('select image')}
      </button>
    </Fragment>
  )
}
