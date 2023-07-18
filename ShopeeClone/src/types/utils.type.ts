export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

//cu phap '-?' se loai bo undifined cua key optional
export type NoundefinedField<T> = {
  [P in keyof T]-?: NoundefinedField<NonNullable<T[P]>>
}
