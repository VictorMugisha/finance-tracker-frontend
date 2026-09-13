import { useCallback } from "react"
import type { Envelope } from "@/api/types"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CheckPhoneResponse, LoginResponse } from "../types/auth"
import { checkPhone, fetchMe, login, logout as logoutAction } from "../slice/authSlice"

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const status = useAppSelector((state) => state.auth.status)

  const loginWithPhone = useCallback(
    (input: { phone: string; password: string }): Promise<Envelope<LoginResponse>> =>
      dispatch(login(input)).unwrap(),
    [dispatch]
  )
  const checkPhoneNumber = useCallback(
    (phone: string): Promise<Envelope<CheckPhoneResponse>> => dispatch(checkPhone(phone)).unwrap(),
    [dispatch]
  )
  const refreshUser = useCallback(() => dispatch(fetchMe()).unwrap(), [dispatch])
  const logoutUser = useCallback(() => dispatch(logoutAction()), [dispatch])

  return {
    user,
    status,
    login: loginWithPhone,
    checkPhone: checkPhoneNumber,
    refreshUser,
    logout: logoutUser,
  }
}
