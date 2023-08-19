import { beforeEach, describe, expect, it } from 'vitest'
import { Http } from '../http'
import HttpStatusCode from 'src/constaints/httpStatusCode.enum'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })

  const access_token1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE4MjY5MWFmYzJlMWExZjk2OWYwMCIsImVtYWlsIjoiaWxvdmV5b3UwMzQ0NEBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTE5VDA0OjA2OjE4LjQwM1oiLCJpYXQiOjE2OTI0MTc5NzgsImV4cCI6MTY5MjQxNzk3OX0.7tZXCWG6vKlzDWBQQgHZy_BYNz0qGUmuXjR4XCfQOc0'

  const refresh_token1000days =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE4MjY5MWFmYzJlMWExZjk2OWYwMCIsImVtYWlsIjoiaWxvdmV5b3UwMzQ0NEBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTE5VDA0OjA2OjE4LjQwM1oiLCJpYXQiOjE2OTI0MTc5NzgsImV4cCI6MTc3ODgxNzk3OH0.MtWapXIiZa93mepaZc9tRBOLKAKmarCgBazk_CKg3PA'

  it('call API', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Auth request', async () => {
    await http.post('login', {
      email: 'iloveyou03444@gmail.com',
      password: '123456'
    })
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh token', async () => {
    setAccessTokenToLS(access_token1s)
    setRefreshTokenToLS(refresh_token1000days)
    const httpNew = new Http().instance
    const res = await httpNew.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
