import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProdictList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayOut from './layouts/MainLayOut'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import ProductDetail from './pages/ProductDetail'
import path from './constaints/path'
import Cart from './pages/Cart'

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
          path: path.profile,
          element: (
            <MainLayOut>
              <Profile />
            </MainLayOut>
          )
        },
        {
          path: path.cart,
          element: (
            <MainLayOut>
              <Cart />
            </MainLayOut>
          )
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
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
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
          <ProdictList />
        </MainLayOut>
      )
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayOut>
          <ProductDetail />
        </MainLayOut>
      )
    }
  ])
  return routeElements
}
