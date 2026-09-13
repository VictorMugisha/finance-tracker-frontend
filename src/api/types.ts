export interface Meta {
  total: number
  page: number
  pageSize: number
}

export interface Envelope<T> {
  statusCode: number
  status: "success" | "fail"
  meta: Meta | null
  data: T
  message: string
}
