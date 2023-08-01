import { Navigate, Outlet, useRoutes } from 'react-router-dom'
// import ProductList from './pages/ProductList'
// import Login from './pages/Login'
// import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayOut from './layouts/MainLayOut'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './contexts/app.context'
// import ProductDetail from './pages/ProductDetail'
import path from './constaints/path'
import CartLayout from './layouts/CartLayout'
// import Cart from './pages/Cart'
import UserLayout from './pages/User/layouts/UserLayout'
// import ChangePassword from './pages/User/Pages/ChangePassword'
// import HistoryPurchase from './pages/User/Pages/HistoryPurchase'
// import Profile from './pages/User/Pages/Profile'
// import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/Pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/Pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/Pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayOut>
              <UserLayout />
            </MainLayOut>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayOut>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayOut>
      )
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayOut>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayOut>
      )
    },
    {
      path: '*',
      element: (
        <MainLayOut>
          <NotFound />
        </MainLayOut>
      )
    }
  ])
  return routeElements
}
