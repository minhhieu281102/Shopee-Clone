import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constaints/path'
import { purchasesStatus } from 'src/constaints/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const { t } = useTranslation('cart')
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchaseList({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasesPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchasesSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation, setExtendedPurchases])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }

  const handleBuyPurchses = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title>Giỏ hàng</title>
        <meta name='description' content='Giỏ hàng' />
      </Helmet>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-x-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>{t('Product')}</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>{t('Unit Price')}</div>
                      <div className='col-span-1'>{t('Quantity')}</div>
                      <div className='col-span-1'>{t('Total Price')}</div>
                      <div className='col-span-1'>{t('Actions')}</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 accent-orange'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  className='h-20 w-20 flex-shrink-0 overflow-hidden'
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                >
                                  <img src={purchase.product.image} alt={purchase.product.name} />
                                </Link>
                                <div className='flex flex-grow items-center  px-2 pb-2 pt-1'>
                                  <Link
                                    className=' line-clamp-2 text-left'
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center '>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                onType={handleTypeQuantity(index)}
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                disabled={purchase.disabled}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value <= purchase.product.quantity &&
                                      value >= 1 &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange '>
                                {formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='bg-none text-black transition-colors hover:text-orange'
                              >
                                {t('Delete')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-10 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckedAll}>
                  {t('Select all')} ({extendedPurchases.length})
                </button>
                <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
                  {t('Delete')}
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>{`${t('Total')} (${checkedPurchasesCount} ${t('items')})`}</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasesPrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>{t('Saved')}</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchses}
                  disabled={buyProductMutation.isLoading}
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                >
                  {t('Check Out')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex h-full w-full flex-col items-center justify-center p-2'>
            <img
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
              alt='anh'
              className=' h-[100px] w-[100px]  object-cover'
            />
            <div className=' pt-2 text-center'>Chưa có sản phẩm</div>
            <Link
              to={path.home}
              className='mt-3  bg-orange px-10 py-3 uppercase text-white transition-all hover:bg-orange/80'
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
