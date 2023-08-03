import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import PROFILE_VI from 'src/locales/vi/profile.json'
import PROFILE_EN from 'src/locales/en/profile.json'
import CART_EN from 'src/locales/en/cart.json'
import CART_VI from 'src/locales/vi/cart.json'

export const defaultNS = 'home'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    profile: PROFILE_EN,
    cart: CART_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    profile: PROFILE_VI,
    cart: CART_VI
  }
}

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false
  },
  ns: ['home', 'product', 'profile', 'cart'],
  defaultNS
})
