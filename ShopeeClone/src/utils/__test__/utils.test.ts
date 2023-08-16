import { describe, it, expect } from 'vitest'
import { isAxiosError, isAxiosUnproscessableEntityError } from '../utils'
import { AxiosError } from 'axios'
import HttpStatusCode from 'src/constaints/httpStatusCode.enum'

describe('isAxiosError', () => {
  it('isAxiosError tra ve boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnproscessableEntityError', () => {
  it('isAxiosUnproscessableEntityError tra ve boolean', () => {
    expect(isAxiosUnproscessableEntityError(new Error())).toBe(false)
    expect(
      isAxiosUnproscessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnproscessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
