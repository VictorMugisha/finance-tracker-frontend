import axios from "axios"
import { ApiError } from "@/api/errors"
import { tokenStorage } from "@/utils/token"

export const api = axios.create({
  baseURL: "/api",
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode: number = error?.response?.status ?? 0
    const message: string =
      error?.response?.data?.message ?? error?.message ?? "Something went wrong"
    return Promise.reject(new ApiError(statusCode, message))
  }
)
