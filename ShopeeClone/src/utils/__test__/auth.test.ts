import { describe, expect, it } from 'vitest'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE4MjY5MWFmYzJlMWExZjk2OWYwMCIsImVtYWlsIjoiaWxvdmV5b3UwMzQ0NEBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTE4VDAzOjM2OjEwLjI2MFoiLCJpYXQiOjE2OTIzMjk3NzAsImV4cCI6MTY5MjMyOTc3NX0.tOBt8uYu3zSgOpPwgsyvW70JNo8Em2xFYKWK1ztZ4vE'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTE4MjY5MWFmYzJlMWExZjk2OWYwMCIsImVtYWlsIjoiaWxvdmV5b3UwMzQ0NEBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTE4VDAzOjM2OjEwLjI2MFoiLCJpYXQiOjE2OTIzMjk3NzAsImV4cCI6MTY5MjMzMzM3MH0.ZhHLYRUIUxDZJVlDCnwHHLJ54sItCHHHpbbA_MjZ3oI'
const profile =
  '{"_id":"649182691afc2e1a1f969f00","roles":["User"],"email":"iloveyou03444@gmail.com","createdAt":"2023-06-20T10:41:45.426Z","updatedAt":"2023-07-28T05:04:47.312Z","__v":0,"address":"ninh binh","date_of_birth":"2002-11-27T17:00:00.000Z","name":"nguyen hieuu","phone":"08883777355","avatar":"914783cb-74e3-42f7-aa5a-c2caaf045715.png"}'

describe('setAccessTokenToLS', () => {
  it(' access token duoc luu vao trong ls', () => {
    setAccessTokenToLS(access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })
})

describe('setRefreshTokenToLS', () => {
  it('refresh token duoc luu vao trong ls', () => {
    setRefreshTokenToLS(refresh_token)
    expect(getRefreshTokenFromLS()).toBe(refresh_token)
  })
})

describe('setProfileToLS', () => {
  it('set profile', () => {
    setProfileToLS(JSON.parse(profile))
    expect(localStorage.getItem('profile')).toBe(profile)
  })
})

describe('getProfileFromLS', () => {
  it('lay profile', () => {
    getProfileFromLS()
    expect(localStorage.getItem('profile')).toBe(profile)
  })
})

describe('clearLS', () => {
  it('xoa du lieu trong ls', () => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    clearLS()
    expect(localStorage.getItem('refresh_token')).toBe(null)
    expect(localStorage.getItem('access_token')).toBe(null)
  })
})
