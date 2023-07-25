const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  productDetail: '/:nameId',
  cart: '/cart',
  user: '/user'
} as const

export default path
